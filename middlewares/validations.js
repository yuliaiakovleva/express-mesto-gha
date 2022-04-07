const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
// const validator = require('validator');

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id карточки');
    }),
  }),
});

module.exports = { validateUserId, validateCardId };
