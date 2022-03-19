const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.errors.about.name === 'ValidatorError') {
        const ERROR_CODE = 400;
        res
          .status(ERROR_CODE)
          .send({
            message: 'Переданы некорректные данные при создании карточки.',
          });
      } else {
        const ERROR_CODE = 500;
        res
          .status(ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  // console.log(req.user._id);
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.errors.about.name === 'ValidatorError') {
        const ERROR_CODE = 400;
        res
          .status(ERROR_CODE)
          .send({
            message: 'Переданы некорректные данные при создании карточки.',
          });
      } else {
        const ERROR_CODE = 500;
        res
          .status(ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  // console.log(cardId);
  Card
    .findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.errors.about.name === 'DocumentNotFoundError') {
        const ERROR_CODE = 404;
        res
          .status(ERROR_CODE)
          .send({
            message: 'Переданы некорректные данные при создании карточки.',
          });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
      // {
      //     new: true, // обработчик then получит на вход обновлённую запись
      //     runValidators: true, // данные будут валидированы перед изменением
      //     upsert: true // если пользователь не найден, он будет создан
      // }
    )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.errors.about.name === 'ValidatorError') {
        const ERROR_CODE = 400;
        res
          .status(ERROR_CODE)
          .send({
            message: 'Переданы некорректные данные для постановки лайка.',
          });
      }
      if (err.errors.about.name === 'DocumentNotFoundError') {
        const ERROR_CODE = 404;
        res
          .status(ERROR_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        const ERROR_CODE = 500;
        res
          .status(ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.errors.about.name === 'ValidatorError') {
        const ERROR_CODE = 400;
        res
          .status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для снятии лайка.' });
      }
      if (err.errors.about.name === 'DocumentNotFoundError') {
        const ERROR_CODE = 404;
        res
          .status(ERROR_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        const ERROR_CODE = 500;
        res
          .status(ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};
