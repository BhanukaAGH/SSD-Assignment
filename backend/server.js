require('dotenv').config()
require('express-async-errors')
require('./utils/passport-config')

const express = require('express')
const fs = require('fs')
const app = express()

// rest of the packages
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const rateLimiter = require('express-rate-limit')

// database
const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/authRoutes')
const companyRouter = require('./routes/companyRoutes')
const jobRouter = require('./routes/jobRoutes')
const candidateRouter = require('./routes/candidateRoutes')
const eventRouter = require('./routes/eventRoutes')
const adminRouter = require('./routes/adminRoutes')
const adminReportRouter = require('./routes/adminReportRoutes')
const applicantRouter = require('./routes/applicantRoutes')

// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  })
)
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(morgan('tiny'))
app.use(
  morgan('combined', {
    stream: fs.createWriteStream('./logs/access.log', { flags: 'a' }),
  })
)
app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 Day
    },
  })
)

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.send('<center><h1>Jobs Portal Backend</h1></center>')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/company', companyRouter)
app.use('/api/v1/job', jobRouter)
app.use('/api/v1/candidate', candidateRouter)
app.use('/api/v1/event', eventRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/adminreport', adminReportRouter)
app.use('/api/v1/applicant', applicantRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
