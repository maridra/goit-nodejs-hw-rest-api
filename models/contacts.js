const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");
const updateContactsList = require("./updateContactsList");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);

  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contactById = contacts.find((it) => it.id === contactId);

  if (!contactById) {
    return null;
  }

  return contactById;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();

  const idx = contacts.findIndex((it) => it.id === contactId);

  if (idx === -1) {
    return null;
  }

  const [removeContactById] = contacts.splice(idx, 1);
  // await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  await updateContactsList(contacts);

  return removeContactById;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { id: v4(), ...body };
  contacts.push(newContact);

  await updateContactsList(contacts);

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();

  const idx = contacts.findIndex((it) => it.id === contactId);

  if (idx === -1) {
    return null;
  }

  contacts[idx] = { id: contactId, ...body };

  await updateContactsList(contacts);
  return contacts[idx];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
