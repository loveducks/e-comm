const auth = require("./auth")
const express = require("express")

import * as expect from "./valid"

let app = express()

const api = {
	Auth: {
		jwt: auth.passport.authenticate("jwt"),
		public: (req, res, next) => {
			next()
		},
		local: (req, res, next) => {
			auth.passport.authenticate("local", async (err, user) => {
				if (err) {
					req.error = err
				}

				req.user = user

				next()
			})(req, res)
		},
	},
	makeMethod: function(expressFn, url, data, handlerFn) {
		if (!handlerFn) {
			handlerFn = data
			data = {}
		}

		data.auth = data.auth || this.Auth.jwt

		let schemaHandler = handlerFn

		if (data.schema) {
			schemaHandler = function(req, res, next) {
				let validation = expect.matchSchema(req.body, data.schema)
				if (validation.errors.length) {
					res.status(400)
					res.json({status: 400, error: "ValidationFail", errors: validation.errors})
					return
				}
				return handlerFn(req, res, next)
			}
		}

		let promiseHandler = async (req, res, next) => {

			let result = schemaHandler(req, res, next)

			if (!result || typeof result.then !== "function") {
				return
			}

			return result
				.then(async r => {
					console.log(data)
					console.log(r)

					const response = {
						data: r?.data,
						status: r?.status,
						error: r?.error,
						message: r?.message
					}

					res.status(response.status)
					res.json(response)
				})
				.catch(err => {
					console.log(err)
					res.json(err)
					next(err)
				})
		}

		return expressFn("/api/" + url, data.auth, promiseHandler)
	},

	post: async function(url, data, handlerFn) {
		return this.makeMethod(app.post.bind(app), url, data, handlerFn)
	},

	put: async function(url, data, handlerFn) {
		return this.makeMethod(app.put.bind(app), url, data, handlerFn)
	},

	get: async function(url, data, handlerFn) {
		return this.makeMethod(app.get.bind(app), url, data, handlerFn)
	},

	delete: async function(url, data, handlerFn) {
		return this.makeMethod(app.delete.bind(app), url, data, handlerFn)
	}
}

module.exports = {api, app}
