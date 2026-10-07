import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'

import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js'

const router = express.Router()

router.post(
  '/',
  authMiddleware,
  createTransaction
)

router.put(
  '/:id',
  authMiddleware,
  updateTransaction
)

router.get(
  '/',
  authMiddleware,
  getTransactions
)

router.delete(
  '/:id',
  authMiddleware,
  deleteTransaction
)

export default router
