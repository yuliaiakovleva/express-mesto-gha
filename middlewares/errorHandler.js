const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500 ;
  console.log(err.stack || err);

  res.status(status). send({
    err,
    message: err.message
  })
}

module.exports = errorHandler;