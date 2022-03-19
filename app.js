const express = require('express');

const app = express();
const mongoose = require('mongoose');
// const routes = require('./routes/users.js')
const bodyParser = require('body-parser');
const read = require('body-parser/lib/read');
const res = require('express/lib/response');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json());

app.use('/', (req, res, next) => {
  req.user = {
    _id: '622f6db6bcb2e6960f576cde',
  };

  next();
});



app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Путь не найден'})
})
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
