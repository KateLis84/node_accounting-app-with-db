'use strict';

const express = require('express');
const userRoutes = require('./routes/userRoutes');
const expensesRoutes = require('./routes/expensesRoutes');

function createServer() {
  const app = express();

  app.use('/users', express.json(), userRoutes);
  app.use('/expenses', express.json(), expensesRoutes);

  return app;
}

module.exports = {
  createServer,
};
