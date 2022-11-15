import passport from "passport"
import passportLocal from "passport-local"
import {Strategy as JwtStrategy} from "passport-jwt"
import {ExtractJwt} from "passport-jwt"
import jwt from "jsonwebtoken"
import session from "express-session"

import {login} from "../controllers/user"

// models
import User from "../models/user"
import storage from '../models/storage'

const fromAuthHeader = ExtractJwt.fromAuthHeaderWithScheme('jwt')

exports.passport = passport

passport.serializeUser(function(user, done) {
	done(null, user)
})

passport.deserializeUser(async function(user, done) {
	await User.findOne({
		where: { id: user.id }
	})
		.then(user => done(null, user))
		.catch(error => {
			done(error, null)
			console.log("error", error)
		})
})

export const get_jwt = user  => {
	return jwt.sign(user, process.env.JWT_KEY)
}

export const init = app => {
	if (process.env.NODE_ENV !== "dev") {
		app.set("trust proxy", 1)
	}

	var SequelizeStore = require("connect-session-sequelize")(session.Store)
	var sessionStore = new SequelizeStore({
		db: storage.database
	})

	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			resave: true,
			saveUninitialized: true,
			rolling: true,
			store: sessionStore,
			cookie: {
				path: "/",
				httpOnly: true,
				secure: false,
				sameSite: true,
				maxAge: 3 * 24 * 3600 * 1000 // 3 days
			}
		})
	)

	sessionStore.sync()

	const LocalStrategy = passportLocal.Strategy

	passport.use(
		new LocalStrategy({usernameField: "email", passwordField: "password"}, function(email, password, done) {
			login(email, password).then(
				user => done(null, user),
				error => done(error)
			)
		})
	)

	passport.use(
		new JwtStrategy(
			{
				secretOrKey: process.env.JWT_KEY,
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
			},
			function(jwtPayload, done) {
				return User.findOne({
					where: { id: jwtPayload.userid }
				}).then(
					user => done(null, user),
					() => done(null, false, { message: "Invalid jwt userid", status: 400 })
				)
			}
		)
	)

	app.use(passport.initialize())
	app.use(passport.session())
}
