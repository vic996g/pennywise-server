import express from 'express'

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} from '../controllers/authController.js'

import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()


// ==============================
// PUBLIC AUTH ROUTES
// ==============================

router.post(
  '/register',
  registerUser
)

router.post(
  '/login',
  loginUser
)


// ==============================
// PROTECTED PROFILE ROUTES
// ==============================

router.get(
  '/profile',
  authMiddleware,
  getProfile
)

router.put(
  '/profile',
  authMiddleware,
  updateProfile
)


export default router