import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import {init} from './helpers/auth'
require("dotenv").config()
import user from './routes/user'
import product from './routes/product'
import {app, api} from "./helpers/api.js"

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
init(app)

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

// parse application/json
app.use(express.json())

app.all("/api/*", function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", req.headers.origin)

	res.setHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE")
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, cache-control"
	)
	res.setHeader("Access-Control-Allow-Credentials", "true")

	next("route")
})


user(api)
product(api)

app.listen(process.env.PORT, () => console.log(`server listening on port ${process.env.PORT}`))
