import Transaction from '../models/Transaction.js'

export const createTransaction = async (req, res) => {
  try {
    const {
      type,
      category,
      amount,
      description,
      date,
    } = req.body

    if (!type || !category || !amount || amount === undefined || Number(amount) <= 0) {
      return res.status(400).json({
        message: 'Type, category and amount are required',
      })
    }

    const transaction = await Transaction.create({
      user: req.user.userId,
      type,
      category,
      amount,
      description,
      date,
    })

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
    })
  } catch (error) {
    console.error('Transaction creation error:', error)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.userId,
    }).sort({
      date: -1,
    })

    res.status(200).json({
      transactions,
    })
  } catch (error) {
    console.error('Get transactions error:', error)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

export const updateTransaction = async (req, res) => {
  try {
    const {
      type,
      category,
      amount,
      description,
      date,
    } = req.body

    if (!type || !category || !amount) {
      return res.status(400).json({
        message: 'Type, category and amount are required',
      })
    }

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        type,
        category,
        amount,
        description,
        date,
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found',
      })
    }

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction,
    })
  } catch (error) {
    console.error(
      'Update transaction error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    })

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found',
      })
    }

    res.status(200).json({
      message: 'Transaction deleted successfully',
    })
  } catch (error) {
    console.error(
      'Delete transaction error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}