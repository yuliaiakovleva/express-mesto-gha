const card = require("../models/card");

module.exports.getCards = (req, res) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
        if (err.errors.about.name === "ValidatorError") {
          const ERROR_CODE = 400;
          res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при создании карточки." });
          return;
        } else {
          const ERROR_CODE = 500;
          res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
        }
      });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.user._id);
  const owner = req.user._id;
  card
    .create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
        if (err.errors.about.name === "ValidatorError") {
          const ERROR_CODE = 400;
          res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при создании карточки." });
          return;
        } else {
          const ERROR_CODE = 500;
          res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
        }
      });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  console.log(cardId);
  card
    .findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
        if (err.errors.about.name === "DocumentNotFoundError") {
          const ERROR_CODE = 404;
            res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при создании карточки." });
            return;
          }
      });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
      // {
      //     new: true, // обработчик then получит на вход обновлённую запись
      //     runValidators: true, // данные будут валидированы перед изменением
      //     upsert: true // если пользователь не найден, он будет создан
      // }
    )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
        if (err.errors.about.name === "ValidatorError") {
          const ERROR_CODE = 400;
          res.status(ERROR_CODE).send({ message: "Переданы некорректные данные для постановки лайка." });
          return;
        }
        if (err.errors.about.name === "DocumentNotFoundError") {
          const ERROR_CODE = 404;
          res.status(ERROR_CODE).send({ message: "Передан несуществующий _id карточки." });
          return;
        } else {
          const ERROR_CODE = 500;
          res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
        }
      });
};

module.exports.dislikeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
        if (err.errors.about.name === "ValidatorError") {
          const ERROR_CODE = 400;
          res.status(ERROR_CODE).send({ message: "Переданы некорректные данные для снятии лайка." });
          return;
        }
        if (err.errors.about.name === "DocumentNotFoundError") {
          const ERROR_CODE = 404;
          res.status(ERROR_CODE).send({ message: "Передан несуществующий _id карточки." });
          return;
        } else {
          const ERROR_CODE = 500;
          res.status(ERROR_CODE).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
        }
      });
};
