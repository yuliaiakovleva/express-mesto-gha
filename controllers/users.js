// const res = require('express/lib/response');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.status(200).res.send({ data: users }))
    .catch((err) => {
      if (err.errors.about.name === 'ValidatorError') {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  // console.log(userId);
  User
    .findById(userId)
    .then((user) => res.status(200).res.send({ data: user }))
    .catch((err) => {
      if (err.errors.about.name === 'DocumentNotFoundError') {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.errors.about.name === 'ValidatorError') {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: true, // если пользователь не найден, он будет создан
      },
    )
    .then((user) => res.status(200).res.send({ data: user }))
    .catch((err) => {
      if (err.errors.about.name === 'ValidatorError') {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.errors.about.name === 'DocumentNotFoundError') {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: true, // если пользователь не найден, он будет создан
      },
    )
    .then((user) => res.status(200).res.send({ data: user }))
    .catch((err) => {
      if (err.errors.about.name === 'ValidatorError') {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.errors.about.name === 'DocumentNotFoundError') {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};
