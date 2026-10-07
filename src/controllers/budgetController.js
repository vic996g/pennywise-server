
import Budget from '../models/Budget.js'
import Transaction from '../models/Transaction.js'

// Create a budget
export const createBudget = async (req, res) => {
  try {
    const {
      category,
      amount,
      month,
      year,
    } = req.body

    if (!category || !amount || !month || !year) {
      return res.status(400).json({
        message:
          'Category, amount, month and year are required',
      })
    }

    const budget = await Budget.create({
      user: req.user.userId,
      category,
      amount,
      month,
      year,
    })

    res.status(201).json({
      message: 'Budget created successfully',
      budget,
    })
  } catch (error) {
    console.error(
      'Budget creation error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}


// Get all budgets for logged-in user
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user.userId,
    }).sort({
      year: -1,
      month: -1,
    })

    const transactions =
      await Transaction.find({
        user: req.user.userId,
        type: 'expense',
      })

    const budgetsWithSpending =
      budgets.map((budget) => {
        const spent =
          transactions
            .filter((transaction) => {
              const transactionDate =
                new Date(transaction.date)

              const transactionMonth =
                transactionDate.getMonth() + 1

              const transactionYear =
                transactionDate.getFullYear()

              return (
                transaction.category ===
                  budget.category &&
                transactionMonth ===
                  budget.month &&
                transactionYear ===
                  budget.year
              )
            })
            .reduce(
              (total, transaction) =>
                total +
                Number(transaction.amount),
              0
            )

        const remaining =
          Number(budget.amount) - spent

        const percentageUsed =
          budget.amount > 0
            ? (spent /
                Number(budget.amount)) *
              100
            : 0

        return {
          ...budget.toObject(),

          spent,

          remaining,

          percentageUsed,
        }
      })

    res.status(200).json({
      budgets: budgetsWithSpending,
    })
  } catch (error) {
    console.error(
      'Get budgets error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}


// Update a budget
export const updateBudget = async (req, res) => {
  try {
    const {
      category,
      amount,
      month,
      year,
    } = req.body

    if (!category || amount === undefined || Number(amount) <= 0 || !month || !year) {
      return res.status(400).json({
        message:
          'Category, amount, month and year are required',
      })
    }

    const budget =
      await Budget.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.userId,
        },
        {
          category,
          amount,
          month,
          year,
        },
        {
          new: true,
          runValidators: true,
        }
      )

    if (!budget) {
      return res.status(404).json({
        message: 'Budget not found',
      })
    }

    res.status(200).json({
      message: 'Budget updated successfully',
      budget,
    })
  } catch (error) {
    console.error(
      'Update budget error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}


// Delete a budget
export const deleteBudget = async (req, res) => {
  try {
    const budget =
      await Budget.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId,
      })

    if (!budget) {
      return res.status(404).json({
        message: 'Budget not found',
      })
    }

    res.status(200).json({
      message: 'Budget deleted successfully',
    })
  } catch (error) {
    console.error(
      'Delete budget error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}

