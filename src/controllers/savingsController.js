
import mongoose from 'mongoose'

import SavingsGoal from '../models/SavingsGoal.js'
import Transaction from '../models/Transaction.js'

export const createSavingsGoal = async (
  req,
  res
) => {
  try {
    const {
      name,
      targetAmount,
      currentAmount,
      targetDate,
    } = req.body

    if (
  !name ||
  !name.trim() ||
  Number(targetAmount) <= 0
) {
  return res.status(400).json({
    message:
      'Name and a valid target amount are required',
  })
}

    const savingsGoal =
      await SavingsGoal.create({
        user: req.user.userId,
        name,
        targetAmount,
        currentAmount:
          currentAmount || 0,
        targetDate,
      })

    res.status(201).json({
      message:
        'Savings goal created successfully',
      savingsGoal,
    })
  } catch (error) {
    console.error(
      'Savings goal creation error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}

export const getSavingsGoals = async (
  req,
  res
) => {
  try {
    const savingsGoals =
      await SavingsGoal.find({
        user: req.user.userId,
      }).sort({
        createdAt: -1,
      })

    const goalsWithProgress =
      savingsGoals.map((goal) => {
        const targetAmount =
          Number(goal.targetAmount)

        const currentAmount =
          Number(goal.currentAmount)

        const remaining =
          targetAmount - currentAmount

        const percentage =
          targetAmount > 0
            ? (currentAmount /
                targetAmount) *
              100
            : 0

        return {
          ...goal.toObject(),
          remaining,
          percentage,
        }
      })

    res.status(200).json({
      savingsGoals:
        goalsWithProgress,
    })
  } catch (error) {
    console.error(
      'Get savings goals error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}

export const updateSavingsGoal = async (
  req,
  res
) => {
  try {
    const {
      name,
      targetAmount,
      currentAmount,
      targetDate,
    } = req.body

    if (!name || !targetAmount) {
      return res.status(400).json({
        message:
          'Name and target amount are required',
      })
    }

    const savingsGoal =
      await SavingsGoal.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.userId,
        },
        {
          name,
          targetAmount,
          currentAmount,
          targetDate,
        },
        {
          returnDocument: 'after',
          runValidators: true,
        }
      )

    if (!savingsGoal) {
      return res.status(404).json({
        message:
          'Savings goal not found',
      })
    }

    res.status(200).json({
      message:
        'Savings goal updated successfully',
      savingsGoal,
    })
  } catch (error) {
    console.error(
      'Update savings goal error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}

export const addMoneyToSavingsGoal =
  async (req, res) => {
    const session =
      await mongoose.startSession()

    try {
      const { amount } = req.body

      // Validate amount

      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({
          message:
            'Please enter a valid amount',
        })
      }

      const amountToAdd =
        Number(amount)

      // Start MongoDB transaction

      session.startTransaction()

      // Find the savings goal
      // and make sure it belongs to
      // the logged-in user

      const savingsGoal =
        await SavingsGoal.findOne({
          _id: req.params.id,
          user: req.user.userId,
        }).session(session)

      if (!savingsGoal) {
        await session.abortTransaction()

        return res.status(404).json({
          message:
            'Savings goal not found',
        })
      }

      const currentAmount =
        Number(
          savingsGoal.currentAmount
        )

      const targetAmount =
        Number(
          savingsGoal.targetAmount
        )

      const newAmount =
        currentAmount + amountToAdd

      // Prevent savings from exceeding target

      if (newAmount > targetAmount) {
        await session.abortTransaction()

        return res.status(400).json({
          message:
            'Amount added cannot exceed the savings target',
        })
      }

      // Update savings goal

      savingsGoal.currentAmount =
        newAmount

      await savingsGoal.save({
        session,
      })

      // Create transaction

      const transaction =
        await Transaction.create(
          [
            {
              user: req.user.userId,
              type: 'expense',
              category: 'Savings',
              amount: amountToAdd,
              description:
                `Contribution to ${savingsGoal.name}`,
              date: new Date(),
            },
          ],
          {
            session,
          }
        )

      // Commit both changes

      await session.commitTransaction()

      res.status(200).json({
        message:
          'Money added to savings successfully',

        savingsGoal,

        transaction:
          transaction[0],
      })
    } catch (error) {
      // Roll back all changes

      await session.abortTransaction()

      console.error(
        'Add money to savings error:',
        error
      )

      res.status(500).json({
        message: 'Server error',
      })
    } finally {
      await session.endSession()
    }
  }

export const deleteSavingsGoal = async (
  req,
  res
) => {
  try {
    const savingsGoal =
      await SavingsGoal.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId,
      })

    if (!savingsGoal) {
      return res.status(404).json({
        message:
          'Savings goal not found',
      })
    }

    res.status(200).json({
      message:
        'Savings goal deleted successfully',
    })
  } catch (error) {
    console.error(
      'Delete savings goal error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}
