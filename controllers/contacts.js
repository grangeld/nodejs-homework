const Contacts = require("../model/index");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contactAll = await Contacts.listContacts(userId);
    return res
      .status(200)
      .json({ status: "success", code: 200, data: contactAll });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await await Contacts.getContactById(
      userId,
      req.params.contactId
    );
    if (contact)
      return res
        .status(200)
        .json({ status: "success", code: 200, data: contact });

    return res
      .status(400)
      .json({ status: "error", code: 400, data: { message: "Not found" } });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
    return res
      .status(201)
      .json({ status: "success", code: 201, data: contact });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isRemove = await Contacts.removeContact(userId, req.params.contactId);
    if (isRemove) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: isRemove });
    }
    return res.status(404).json({
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Проверка на пустое тело
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      console.log(req.body);
      return res.status(400).json({
        message: "missing fields",
      });
    }
    const updateContact = await Contacts.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
    // Проверка прошло ли изменение
    if (updateContact !== "") {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: updateContact });
    }

    return res.status(404).json({
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const responce = await Contacts.updateStatusContact(
      userId,
      req.params.id,
      req.body
    );
    if (responce) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: responce });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not Found" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  remove,
  update,
  updateStatus,
  create,
};
