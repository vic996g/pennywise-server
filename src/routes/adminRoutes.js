import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

import {
  getUsers,
} from '../controllers/adminController.js'


const router = express.Router()


// ==============================
// GET ALL USERS
// ==============================

router.get(
  '/users',
  authMiddleware,
  adminMiddleware,
  getUsers
)


export default router