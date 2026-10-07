import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

import {
  createContactMessage,
  getContactMessages,
  markContactMessageAsRead,
} from '../controllers/contactController.js'


const router = express.Router()


// ==============================
// PUBLIC CONTACT FORM
// ==============================

router.post(
  '/',
  createContactMessage
)


// ==============================
// ADMIN - GET ALL MESSAGES
// ==============================

router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  getContactMessages
)


// ==============================
// ADMIN - MARK MESSAGE AS READ
// ==============================

router.patch(
  '/:id/read',
  authMiddleware,
  adminMiddleware,
  markContactMessageAsRead
)


export default router