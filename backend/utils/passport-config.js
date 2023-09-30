const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/User')
const createTokenUser = require('./createTokenUser')

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ email: username })
        if (!user) {
          return done(null, false)
        }
        if (user && (user.googleId || user.facebookId)) {
          return done(null, false)
        }
        if (!(await user.comparePassword(password))) {
          return done(null, false)
        }
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const currentUser = await User.findOne({ googleId: profile.id })

      if (currentUser) {
        done(null, currentUser)
      } else {
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          photoUrl: profile.photos[0].value,
        })

        done(null, newUser)
      }
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/v1/auth/facebook/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      const currentUser = await User.findOne({ facebookId: profile.id })

      if (currentUser) {
        done(null, currentUser)
      } else {
        const newUser = await User.create({
          facebookId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          photoUrl: profile.photos[0].value,
        })

        done(null, newUser)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, createTokenUser(user))
  })
})
