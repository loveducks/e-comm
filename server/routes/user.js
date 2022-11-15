import * as expect from "../helpers/valid"
import { get_jwt } from '../helpers/auth'
import {signup} from '../controllers/user'

export default function createApi(api, app) {
	api.post(
		"signup",
		{
			auth: api.Auth.public,
			schema: {
				email: expect.string(3, 200),
				password: expect.string(1, 200),
				phone: expect.string(6, 30),
				address: expect.string(6, 100)
			}
		},
		(req, res, next) => {
			return signup(
				req.body.email,
				req.body.password,
				req.body.phone,
				req.body.address,
			)
				.then(resp => {
					return resp
				})
				.catch(error => {
					return error
				})
		}
	)

	api.post("login", { auth: api.Auth.local }, async (req, res, next) => {
		try {
			if (req.error)
				return req.error
			const user = req.user
			const token = get_jwt({ userid: user.id })
			const userData = {
				email: user.email,
				address: user.address,
				phone: user.phone,
				id: user.id,
				jwt: token
			}
			return { data: userData, status: 200, message: 'logged in successfully' }
		} catch (err) {
			console.log('Error in login', err)
			return { status: 500, message: 'Error in login' }
		}
	})

}

