const expensesService = require('../services/expensesService');
const userService = require('../services/userService');

const getExpenses = async (req, res) => {
  const queries = req.query;
  const expenses = await expensesService.getExpenses(queries);

  res.json(expenses);
};

const getExpenseById = async (req, res) => {
  const id = +req.params.id;
  const expense = await expensesService.getExpenseById(id);

  if (!expense) {
    return res.sendStatus(404);
  }
  res.json(expense);
};

const createExpense = async (req, res) => {
  const { userId, spentAt, title, amount, category, note } = req.body;

  if (!userId || !spentAt || !title || !amount) {
    return res.status(400).send('Missing required fields');
  }

  const user = await userService.getUserById(userId);

  if (!user) {
    return res.status(400).send('User not found');
  }

  const expense = await expensesService.createExpense({
    userId,
    spentAt,
    title,
    amount,
    category,
    note: note || '',
  });

  if (!expense) {
    return res.status(400).send('Failed to create expense');
  }

  res.status(201).json(expense);
};

const updateExpense = async (req, res) => {
  const id = Number(req.params.id);
  const expense = await expensesService.getExpenseById(id);

  if (!expense) {
    return res.sendStatus(404);
  }

  const updatedNumber = await expensesService.updateExpense(id, req.body);

  if (!updatedNumber) {
    return res.sendStatus(404);
  }

  const updatedExpense = await expensesService.getExpenseById(id);

  res.json(updatedExpense);
};

const deleteExpense = async (req, res) => {
  const id = Number(req.params.id);
  const expense = await expensesService.getExpenseById(id);

  if (!expense) {
    return res.sendStatus(404);
  }
  await expensesService.deleteExpense(id);
  res.sendStatus(204);
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
