const res = require("express/lib/response");
const user = require("../models/user");

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.errors.about.name === "ValidatorError") {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при создании пользователя." });
        return;
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  user
    .findById(userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.errors.about.name === "DocumentNotFoundError") {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({ message: "Пользователь по указанному _id не найден." });
        return;
      } else {
        const ERROR_CODE = 500
        res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.errors.about.name === "ValidatorError") {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при создании пользователя." });
        return;
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.editUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: true, // если пользователь не найден, он будет создан
      }
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.errors.about.name === "ValidatorError") {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при обновлении профиля." });
        return;
      }
      if (err.errors.about.name === "DocumentNotFoundError") {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({ message: "Пользователь с указанным _id не найден." });
        return;
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;

  user
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: true, // если пользователь не найден, он будет создан
      }
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.errors.about.name === "ValidatorError") {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при обновлении аватара." });
        return;
      }
      if (err.errors.about.name === "DocumentNotFoundError") {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({ message: "Пользователь с указанным _id не найден." });
        return;
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};
