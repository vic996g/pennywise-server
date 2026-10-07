import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'


// ==============================
// REGISTER USER
// ==============================

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          'Name, email and password are required',
      })
    }

    const existingUser =
      await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message:
          'An account with this email already exists',
      })
    }

    const hashedPassword =
      await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    res.status(201).json({
      message:
        'User registered successfully',

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(
      'Registration error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}


// ==============================
// LOGIN USER
// ==============================

export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message:
          'Email and password are required',
      })
    }

    const user =
      await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message:
          'Invalid email or password',
      })
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      )

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          'Invalid email or password',
      })
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    res.status(200).json({
      message: 'Login successful',

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(
      'Login error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}


// ==============================
// GET USER PROFILE
// ==============================

export const getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.userId
      ).select(
        '-password'
      )

    if (!user) {
      return res.status(404).json({
        message:
          'User not found',
      })
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(
      'Get profile error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}


// ==============================
// UPDATE USER PROFILE
// ==============================

export const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
    } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        message:
          'Name cannot be empty',
      })
    }

    const user =
      await User.findById(
        req.user.userId
      )

    if (!user) {
      return res.status(404).json({
        message:
          'User not found',
      })
    }

    user.name =
      name.trim()

    await user.save()

    res.status(200).json({
      message:
        'Profile updated successfully',

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(
      'Update profile error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}