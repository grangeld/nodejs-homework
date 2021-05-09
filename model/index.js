const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const resp = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(resp);
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find(({ id }) => String(id) === String(contactId));
};

const removeContact = async (contactId) => {};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    const newContact = { id: uuid(), ...body };
    const newContactsList = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(newContactsList, null, 2));
    return newContact;
  } catch (error) {
    console.log(error.message);
  }
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
