const express = require('express');

const app = express();
// require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const validator = require('validator');
const { validateAuthorization } = require('./middlewares/validations');



const { PORT = 3000 } = process.env;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/signup',
celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }).unknown(true)
 }), createUser);

app.post('/signin',
celebrate({
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
    password: Joi.string().required().min(8).messages({
      'any.required': 'Пароль не указан',
      'string.min': 'Пароль должен быть длиннее',
    })
  }),
}), login)

app.use(validateAuthorization, auth);

app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Путь не найден' });
});

app.use(errors());

app.use(errorHandler);

// console.log(process.env.NODE_ENV);

// app.use((err, req, res, next) => {
//   // если у ошибки нет статуса, выставляем 500
//   const { statusCode = 500, message } = err;

//   res
//     .status(statusCode)
//     .send({
//       // проверяем статус и выставляем сообщение в зависимости от него
//       message: statusCode === 500
//         ? `Произошла ошибка: ${err.name} ${err.message}`
//         : message,
//     });
// });

// делаю так, чтобы подключение к бд происходило раньше чем запуск сервера

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await app.listen(PORT);

  // await console.log(`Server listen port ${PORT}`);
}

main();
