
const routes = require('express').Router(); // создали роутер
const {  getUsers, getUserById, createUser, editUser, editAvatar } = require('../controllers/users.js')


routes.get('/users', getUsers)

routes.get('/users/:userId', getUserById)

routes.post('/users', createUser)

routes.patch('/users/me', editUser)

routes.patch('/users/me/avatar', editAvatar)

module.exports = routes; 