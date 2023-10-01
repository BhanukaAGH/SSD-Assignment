const express = require('express')
const passport = require('passport')
const { StatusCodes } = require('http-status-codes')

const { login, register, getUser } = require('../controllers/authController')
const { authenticateUser } = require('../middleware/authentication')

const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(passport.authenticate('local'), login)

router.route('/google').get(
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

router.route('/google/callback').get(
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/login',
  })
)
router.route('/facebook').get(
  passport.authenticate('facebook', {
    scope: ['email'],
  })
)

router.route('/facebook/callback').get(
  passport.authenticate('facebook', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/login',
  })
)

router.route('/user').get(authenticateUser, getUser)

router.route('/logout').post((req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.status(StatusCodes.OK).json({ msg: 'Successfully Logout' })
  })
})

module.exports = router
