const express = require('express');

const app = express();
// require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const validator = require('validator');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { NotFoundError } = require('./errors/errors');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({

    email: Joi.string().required().custom((value, helper) => {
      if (!validator.isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }).messages({
      'any.required': 'Email не указан',
      'string.notEmail': 'Email некорректный',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Пароль не указан',
      'string.min': 'Пароль должен быть длиннее',
    }),
  }),
}), login);

app.use(auth);

app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use((req, res) => {
  // res.status(404).send({ message: 'Путь не найден' });
  throw new NotFoundError('Путь не найден');
});

app.use(errors());

app.use(errorHandler);

// делаю так, чтобы подключение к бд происходило раньше чем запуск сервера

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await app.listen(PORT);
}

main();
