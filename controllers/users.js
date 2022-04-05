const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const User = require('../models/user');
const { NotFoundError, BadRequestError, DoubleUseEmailError, UnauthorizedError } = require('../errors/errors')
// const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

 return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        'some-secret-key', { expiresIn: '7d' });
      res.send({ token, user });
    })
    .catch(() => {
      next (new UnauthorizedError('Передан неверный логин или пароль.'));
      })
        // next  (new UnauthorizedError('Передан неверный логин или пароль.');
      // })
      // res
      //   .status(401)
      //   .send({ message: err.name });
    // })
  };

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next (new BadRequestError('Переданы некорректные данные.'));
      }  else {
        next(err);
      }
    })
};

module.exports.getCurrentUser = (req, res, next) => {
  console.log(req);
  User.findById(req.user._id)
    .orFail(() => {
    next  (new NotFoundError('Нет пользователя с таким id'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
        if (err.name === 'ValidationError') {
          next (new BadRequestError('Передан невалидный id пользователя'));
        } else {
          next(err);
        }
    })
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  console.log(userId);
  User.findById(userId)
    .orFail(() => {
      next  (new NotFoundError('Нет пользователя с таким id'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next (new BadRequestError('Передан невалидный id пользователя'))
      }
      else {
        next(err);
      }
    })
};


module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  // const { owner } = req.user._id;

User.findOne({ email })
    .then((user) => {
      if(user) {
        next  (new DoubleUseEmailError('Пользователь с такой почтой уже существует.'));
      } else {
        return bcrypt.hash(password, 10)
      }
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((answer) => res.send({ _id: answer._id, email: answer.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next (new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
      })
    };

module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;
  //  console.log(req.user._id);
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
        next  (new NotFoundError('Пользователь по такому id не найден.'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next  (new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
        }
      if (err.name === 'CastError') {
        next  (new BadRequestError('Передан невалидный id пользователя.'));
      }
      else {
        next(err);
      }
    })
};

module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
  .orFail(() => {
    next  (new NotFoundError('Пользователь по такому id не найден.'));
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {

      if (err.name === 'ValidationError') {
        next  (new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
        } else {
          next(err);
        }
      })
      // if (err.statusCode === 404) {
      //   return res.status(404).send({ message: err.message });
      // }
      // return res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    // })
};
