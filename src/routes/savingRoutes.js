import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'

import {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  addMoneyToSavingsGoal,
  deleteSavingsGoal,
} from '../controllers/savingsController.js'

const router = express.Router()

router.post(
  '/',
  authMiddleware,
  createSavingsGoal
)

router.get(
  '/',
  authMiddleware,
  getSavingsGoals
)

router.put(
  '/:id',
  authMiddleware,
  updateSavingsGoal
)

router.patch(
  '/:id/add-money',
  authMiddleware,
  addMoneyToSavingsGoal
)

router.delete(
  '/:id',
  authMiddleware,
  deleteSavingsGoal
)

export default router