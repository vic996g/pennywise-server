import User from '../models/User.js'


// ==============================
// GET ALL USERS
// ==============================

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select(
        '_id name email currency role createdAt'
      )
      .sort({
        createdAt: -1,
      })

    res.status(200).json({
      users,
    })
  } catch (error) {
    console.error(
      'Get users error:',
      error
    )

    res.status(500).json({
      message: 'Server error',
    })
  }
}