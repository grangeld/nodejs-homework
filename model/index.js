const Contact = require("./schemas/contact");

const listContacts = async (userId) => {
  try {
    const results = await Contact.find({ owner: userId });
    return results;
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (userId, contactId) => {
  try {
    const result = await Contact.findOne({
      _id: contactId,
      owner: userId,
    }).populate({ path: "owner" });
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (userId, contactId) => {
  try {
    const result = Contact.findByIdAndRemove({ _id: contactId, owner: userId });
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

const updateContact = async (userId, contactId, body) => {
  try {
    const result = await Contact.findOneAndUpdate(
      {
        _id: contactId,
        owner: userId,
      },
      { ...body },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

const updateStatusContact = async (userId, contactId, body) => {
  try {
    const result = await Contact.findOneAndUpdate(
      {
        _id: contactId,
        owner: userId,
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
