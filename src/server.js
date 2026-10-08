import express from 'express'
import dotenv from 'dotenv'
import dns from 'node:dns'
import cors from 'cors'

import connectDB from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import budgetRoutes from './routes/budgetRoutes.js'
import savingRoutes from './routes/savingRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import contactRoutes from './routes/contactRoutes.js'


// ==============================
// LOAD ENVIRONMENT VARIABLES
// ==============================

dotenv.config()


// ==============================
// DNS CONFIGURATION
// ==============================

dns.setServers([
  '1.1.1.1',
  '1.0.0.1',
])


// ==============================
// CONNECT TO DATABASE
// ==============================

connectDB()


// ==============================
// CREATE EXPRESS APP
// ==============================

const app = express()


// ==============================
// MIDDLEWARE
// ==============================

app.use(
  cors({
    origin:
      'https://pennywise-client.vercel.app',
  })
)

app.use(
  express.json()
)


// ==============================
// API ROUTES
// ==============================

app.use(
  '/api/auth',
  authRoutes
)

app.use(
  '/api/transactions',
  transactionRoutes
)

app.use(
  '/api/budgets',
  budgetRoutes
)

app.use(
  '/api/savings',
  savingRoutes
)

app.use(
  '/api/admin',
  adminRoutes
)

app.use(
  '/api/contact',
  contactRoutes
)


// ==============================
// ROOT ROUTE
// ==============================

app.get(
  '/',
  (req, res) => {
    res.send(
      'PENNYWISE backend is running'
    )
  }
)


// ==============================
// LOCAL DEVELOPMENT SERVER
// ==============================

const PORT =
  process.env.PORT || 5000

if (
  process.env.NODE_ENV !==
  'production'
) {

  app.listen(
    PORT,
    () => {
      console.log(
        `Server running on port ${PORT}`
      )
    }
  )

}


// ==============================
// EXPORT APP FOR VERCEL
// ==============================

export default app
