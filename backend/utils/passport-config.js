const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/User')

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (username, password, done) => {
      User.findOne({ email: username }, async function (err, user) {
        if (err) {
          return done(err)
        }
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
      })
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/v1/auth/google/callback',
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
      callbackURL: 'http://localhost:5000/api/v1/auth/facebook/callback',
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
    done(null, {
      userId: user._id,
      name: user.name,
      role: user.role,
      profileImg: user.photoUrl,
    })
  })
})