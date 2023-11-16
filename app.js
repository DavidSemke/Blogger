require('dotenv').config()
const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const session = require("express-session")
const passport = require('./auth/passport.js')
const mongoose = require("mongoose")

/* MongoDB Setup */
const connecter = process.env.MONGO_DB_CONNECT

main().catch((err) => console.log(
  err));

async function main() {
  await mongoose.connect(connecter);
}

const app = express()

/* View Engine Setup */
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

/* Authentication Setup */
app.use(session(
  { 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true 
  }
));
app.use(passport.initialize());
app.use(passport.session());

/* Locals Setup */
app.use((req, res, next) => {
  // for use in views
  res.locals.user = req.user
  next()
})

/* Dev Setup */
app.use(logger("dev"))

/* Miscellaneous Setup */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

/* Route Setup */
const indexRouter = require("./routes/index")
const signupRouter = require("./routes/signup")
// passport is argument here to authenticate login
const loginRouter = require("./routes/login")(passport)
const logoutRouter = require("./routes/logout")
const usersRouter = require("./routes/users")
const blogsRouter = require("./routes/blogs")

app.use("/", indexRouter)
app.use("/signup", signupRouter)
app.use("/login", loginRouter)
app.use("/logout", logoutRouter)
app.use("/users", usersRouter)
app.use("/blogs", blogsRouter)

/* Error Handling */
app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("pages/error")
})

module.exports = app
