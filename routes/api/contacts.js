const express = require("express");
const router = express.Router();
const Contacts = require("../../model/index");

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

router.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.patch("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
