const User = require('../models/User')
const Company = require('../models/Company')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createTokenUser } = require('../utils')

//! REGISTER CONTROLLER
const register = async (req, res, next) => {
  const {
    name,
    email,
    password,
    companyWebsite,
    companyLocation,
    numberOfEmployees,
    companyDescription,
    userRole,
  } = req.body

  if (!name || !email || !password) {
    throw new CustomError.BadRequestError('Please provide all values')
  }

  if (
    userRole === 'company' &&
    (!companyLocation || !numberOfEmployees || !companyDescription)
  ) {
    throw new CustomError.BadRequestError('Please provide all values')
  }

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments()) === 0
  const role = isFirstAccount && userRole !== 'company' ? 'admin' : userRole

  let user
  if (role === 'admin' || role === 'user' || !role) {
    user = await User.create({
      name,
      email,
      password,
      role,
    })
  } else {
    const company = await Company.create({
      companyWebsite,
      companyLocation,
      numberOfEmployees,
      companyDescription,
    })
    user = await User.create({
      name,
      email,
      password,
      _company: company._id,
      role,
    })
  }

  req.login(user, function (err) {
    if (err) {
      console.log('error accoured', err)
      return next(err)
    }
    res.status(StatusCodes.OK).json({ user: createTokenUser(req.user) })
  })
}

//! LOGIN CONTROLLER
const login = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: createTokenUser(req.user) })
}

//! GET USER
const getUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

module.exports = { login, register, getUser }
