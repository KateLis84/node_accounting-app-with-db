const { Op } = require('sequelize');
const { Expense } = require('../models/Expense.model');
const userService = require('../services/userService');

function getExpenses({ userId: queryUserId, categories, to, from }) {
  const filter = {};

  if (queryUserId) {
    filter.userId = queryUserId;
  }

  if (categories) {
    const categoriesArray =
      typeof categories === 'string' ? categories.split(',') : categories || [];

    filter.category = {
      [Op.in]: categoriesArray,
    };
  }

  if (from || to) {
    filter.spentAt = {};

    if (from) {
      filter.spentAt[Op.gte] = from;
    }

    if (to) {
      filter.spentAt[Op.lte] = to;
    }
  }

  return Expense.findAll({
    where: filter,
  });
}

function getExpenseById(id) {
  return Expense.findByPk(id);
}

async function createExpense({
  userId,
  spentAt,
  title,
  amount,
  category,
  note,
}) {
  const user = await userService.getUserById(userId);

  if (!user) {
    return null;
  }

  return Expense.create({
    userId,
    spentAt,
    title,
    amount,
    category,
    note: note || '',
  });
}

async function updateExpense(id, newValues) {
  const expenseToUpdate = await getExpenseById(id);

  if (!expenseToUpdate) {
    return null;
  }

  const [updatedNumber] = await Expense.update(
    { ...newValues },
    {
      where: { id },
    },
  );

  return updatedNumber;
}

async function deleteExpense(id) {
  const deleted = await Expense.destroy({
    where: { id },
  });

  return deleted;
}

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
