const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Должно быть минимум 2 символа'],
    maxlength: [30, 'Должно быть максимум 30 символов'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Должно быть минимум 2 символа'],
    maxlength: [30, 'Должно быть максимум 30 символов'],
    // minlength: 2,
    // maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
