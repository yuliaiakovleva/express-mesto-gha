// const res = require('express/lib/response');
const user = require('../models/user');
const User = require('../models/user');


module.exports.getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.send({ data: users}))
    .catch((err) => {
      if (err.name === 'ValidatorError' ) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    })
}

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  // console.log(userId);
  User
    .findById(userId)
    .orFail(() => {
      const error = new Error('Пользователь по указанному _id не найден.');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id пользователя' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        // const ERROR_CODE = 500;
        res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.errors.name.name === 'ValidatorError') {
        // const ERROR_CODE = 400;
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        // const ERROR_CODE = 500;
        res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;
//  console.log(req.user._id);
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail(() => {
      const error = new Error('Пользователь по указанному _id не найден.');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err.name);
      if (err.errors.about.name === 'ValidatorError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id пользователя' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}`, ...err });
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
        new: true,
        runValidators: true,
      },
    )
    .orFail(() => {
      const error = new Error('Пользователь по указанному _id не найден.');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        // const ERROR_CODE = 400;
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        // const ERROR_CODE = 500;
        res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};
