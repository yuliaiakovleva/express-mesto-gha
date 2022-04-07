const routes = require('express').Router(); // создали роутер
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, editUser, editAvatar, getCurrentUser,
} = require('../controllers/users');
const { validateUserId } = require('../middlewares/validations');

// заголовок authorization проверяю в app.js

routes.get('/users', getUsers);

routes.get('/users/me', getCurrentUser);

// тут нужно проверить req.params
routes.get('/users/:userId', validateUserId, getUserById);

// тут нужно проверить поля name и about из body
routes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), editUser);

// тут нужно проверить поле avatar из body
routes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }),
}), editAvatar);

module.exports = routes;
