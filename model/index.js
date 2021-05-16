const Contact = require("./schemas/contact");

const listContacts = async () => {
  try {
    const results = await Contact.find({});
    return results;
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const result = await Contact.findOne({
      _id: contactId,
    });
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const result = Contact.findByIdAndRemove({ _id: contactId });
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (body) => {
  try {
    const result = Contact.create(body);
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const result = await Contact.findOneAndUpdate(
      {
        _id: contactId,
      },
      { ...body },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const result = await Contact.findOneAndUpdate(
      {
        _id: contactId,
      },
      { ...body },
      { new: true }
    );
    return result;
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
  updateStatusContact,
};
