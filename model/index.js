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

const removeContact = async (contactId) => {
  try {
    let isRemoveContact = false;
    const contacts = await listContacts();
    const newContactsList = contacts.filter(({ id }) => {
      if (String(id) === String(contactId)) isRemoveContact = true;
      return String(id) !== String(contactId);
    });

    if (isRemoveContact)
      await fs.writeFile(
        contactsPath,
        JSON.stringify(newContactsList, null, 2)
      );

    return isRemoveContact;
  } catch (error) {
    console.log(error.message);
  }
};

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

const updateContact = async (contactId, body) => {
  try {
    let contact = "";
    const contacts = await listContacts();
    const newContacts = contacts.map((data) => {
      if (String(data.id) === String(contactId)) {
        contact = { ...data, ...body };
        return contact;
      }
      return data;
    });
    if (contact !== "")
      await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
