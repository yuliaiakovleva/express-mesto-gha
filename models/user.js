const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (str) => validator.isURL(str),
      message: 'Введите ссылку',
      // подумать тут над фразой
    },
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    validate: {
      validator: (str) => validator.isEmail(str),
      message: 'Введите корректный email',
      // подумать тут над фразой
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    // спрятали пароль при get запросах
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
