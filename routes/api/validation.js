const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const patternTel = "^[- +()0-9]+$";
const schema = Joi.object({
  name: Joi.string().alphanum().min(1).max(30).empty("").required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua", "ru", "pl"] },
    })
    .required(),
  phone: Joi.string().pattern(new RegExp(patternTel)).required(),

  favorite: Joi.boolean().optional(),
});

const schemaId = Joi.object({
  contactId: Joi.objectId().required(),
});

const schemaStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, obj, res, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "it's validation error: missing required name field",
    });
  }
};

module.exports.validateContact = async (req, res, next) => {
  return await validate(schema, req.body, res, next);
};

module.exports.validateIdContact = async (req, res, next) => {
  return await validate(schemaId, req.params, res, next);
};

module.exports.validateStatusContact = async (req, res, next) => {
  return await validate(schemaStatusContact, req.body, res, next);
};
