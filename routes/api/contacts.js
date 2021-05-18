const express = require("express");
const router = express.Router();
const Contacts = require("../../model/index");
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateFavorite,
} = require("./validation");

router.get("/", async (req, res, next) => {
  try {
    const contactAll = await Contacts.listContacts();
    return res
      .status(200)
      .json({ status: "success", code: 200, data: contactAll });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
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
});

router.post("/", validateCreateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: contact });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const isRemove = await Contacts.removeContact(req.params.contactId);
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
});

router.put("/:contactId", validateUpdateContact, async (req, res, next) => {
  try {
    // Проверка на пустое тело
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      console.log(req.body);
      return res.status(400).json({
        message: "missing fields",
      });
    }
    const updateContact = await Contacts.updateContact(
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
});

router.patch(
  "/:id/favorite",
  validateUpdateFavorite,
  async (req, res, next) => {
    try {
      const responce = await Contacts.updateStatusContact(
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
  }
);

module.exports = router;
