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
    })
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

const schemaUpdateCat = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.number().required(),
});

const schemaStatusVaccinatedCat = Joi.object({
  isVaccinated: Joi.boolean().required(),
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

module.exports.validateUpdateCat = (req, _res, next) => {
  return validate(schemaUpdateCat, req.body, next);
};
module.exports.validateStatusVaccinatedCat = (req, _res, next) => {
  return validate(schemaStatusVaccinatedCat, req.body, next);
};
