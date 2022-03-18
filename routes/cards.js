const cardRoutes = require('express').Router(); // создали роутер

const card = require('../models/card');
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards')

cardRoutes.get('/cards', getCards)

cardRoutes.post('/cards', createCard)

cardRoutes.delete('/cards/:cardId', deleteCard)

cardRoutes.put('/cards/:cardId/likes', likeCard)

cardRoutes.delete('/cards/:cardId/likes', dislikeCard)

module.exports = cardRoutes