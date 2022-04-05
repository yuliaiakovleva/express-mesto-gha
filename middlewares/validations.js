const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
// const validator = require('validator');

const validateAuthorization = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().messages({'any.required': 'вы не авторизованы'})
   }).unknown(),
})

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  })
})

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id карточки');
    }),
  })
})

module.exports = { validateAuthorization, validateUserId, validateCardId }