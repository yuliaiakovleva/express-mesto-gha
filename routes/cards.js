const cardRoutes = require('express').Router(); // создали роутер

const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');
const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');
const {validateAuthorization} = require('../middlewares/validations');
const { validateCardId } = require('../middlewares/validations');

cardRoutes.get('/cards', getCards);

cardRoutes.post('/cards',
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
            if (validator.isURL(value)) {
              return value;
            }
            return helpers.message('Невалидная ссылка');
          })
  })
 }), createCard);

cardRoutes.delete('/cards/:cardId', validateCardId, deleteCard);

cardRoutes.put('/cards/:cardId/likes', validateCardId, likeCard);

cardRoutes.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

// cardRoutes.get('/cards/:cardId', getMyCard);

module.exports = cardRoutes;
