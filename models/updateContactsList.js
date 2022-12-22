const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const updateContactsList = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

module.exports = updateContactsList;
