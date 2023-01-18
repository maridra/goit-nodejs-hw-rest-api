const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");

const { HttpError, ctrlWrapper } = require("../helpers");
const { User } = require("../models/user");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const updateSubscription = async (req, res) => {
  const { _id, subscription } = req.user;
  const { subscription: newSubscription } = req.body;

  const version = ["starter", "pro", "business"];

  const updateSubscription = version.find((it) => it === newSubscription);

  if (!updateSubscription || newSubscription === subscription) {
    throw HttpError(400, "Incorrectly selected subscription");
  }

  await User.findByIdAndUpdate(
    _id,
    { subscription: updateSubscription },
    { new: true }
  );

  res.json({
    message: `Subscription changed to ${updateSubscription}`,
  });
};

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400, "Avatar is not attach");
  }
  const { path: tmpUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarDir, filename);

  const img = await jimp.read(tmpUpload);
  await img
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(tmpUpload);

  await fs.rename(tmpUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
