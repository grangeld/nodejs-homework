const Joi = require("joi");

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required().messages({
    "string.empty": `"missing required name field`,
    "any.required": `missing required name field`,
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: false },
    })
    .required()
    .messages({
      "string.empty": `"missing required name field`,
      "any.required": `missing required name field`,
    }),

  phone: Joi.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/)
    .required()
    .messages({
      "string.empty": `"missing required name field`,
      "any.required": `missing required name field`,
    }),
});

const validateUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).optional().messages({
    "string.empty": `"missing required name field`,
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: false },
    })
    .optional()
    .messages({
      "string.empty": `"missing required name field`,
    })
    .messages({
      "string.empty": `"missing required name field`,
    }),
  phone: Joi.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/)
    .optional()
    .messages({
      "string.empty": `"missing required name field`,
    }),
});

const validateUpdateFavorite = Joi.object({
  favorite: Joi.boolean().required().messages({
    "string.empty": "missing field favorite",
  }),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: 400, message: `${err.message.replace(/"/g, "")}` });
  }
};

module.exports.validateCreateContact = (req, _res, next) => {
  return validate(schemaCreateContact, req.body, next);
};

module.exports.validateUpdateContact = (req, _res, next) => {
  return validate(validateUpdateContact, req.body, next);
};

module.exports.validateUpdateFavorite = (req, _res, next) => {
  return validate(validateUpdateFavorite, req.body, next);
};
