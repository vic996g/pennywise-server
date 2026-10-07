import ContactMessage from '../models/ContactMessage.js'


// ==============================
// CREATE CONTACT MESSAGE
// ==============================

export const createContactMessage = async (
  req,
  res
) => {
  try {

    const {
      name,
      email,
      subject,
      message,
    } = req.body


    // ==============================
    // VALIDATION
    // ==============================

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        message:
          'All contact form fields are required',
      })
    }


    // ==============================
    // SAVE MESSAGE
    // ==============================

    const contactMessage =
      await ContactMessage.create({
        name,
        email,
        subject,
        message,
      })


    // ==============================
    // SUCCESS RESPONSE
    // ==============================

    res.status(201).json({
      message:
        'Your message has been sent successfully',

      contactMessage: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        subject: contactMessage.subject,
        message: contactMessage.message,
        status: contactMessage.status,
        createdAt:
          contactMessage.createdAt,
      },
    })

  } catch (error) {

    console.error(
      'Contact message error:',
      error
    )

    res.status(500).json({
      message:
        'Unable to send your message',
    })

  }
}


// ==============================
// GET ALL CONTACT MESSAGES
// ==============================

export const getContactMessages = async (
  req,
  res
) => {
  try {

    const messages =
      await ContactMessage.find()
        .sort({
          createdAt: -1,
        })


    res.status(200).json({
      messages,
    })

  } catch (error) {

    console.error(
      'Get contact messages error:',
      error
    )

    res.status(500).json({
      message:
        'Unable to load contact messages',
    })

  }
}


// ==============================
// MARK CONTACT MESSAGE AS READ
// ==============================

export const markContactMessageAsRead = async (
  req,
  res
) => {
  try {

    const {
      id,
    } = req.params


    // ==============================
    // FIND MESSAGE
    // ==============================

    const message =
      await ContactMessage.findById(
        id
      )


    // ==============================
    // MESSAGE NOT FOUND
    // ==============================

    if (!message) {

      return res.status(404).json({
        message:
          'Contact message not found',
      })

    }


    // ==============================
    // UPDATE STATUS
    // ==============================

    message.status = 'read'

    await message.save()


    // ==============================
    // SUCCESS RESPONSE
    // ==============================

    res.status(200).json({
      message:
        'Contact message marked as read',

      contactMessage: {
        id: message._id,
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        status: message.status,
        createdAt:
          message.createdAt,
      },
    })

  } catch (error) {

    console.error(
      'Mark contact message as read error:',
      error
    )

    res.status(500).json({
      message:
        'Unable to update contact message',
    })

  }
}