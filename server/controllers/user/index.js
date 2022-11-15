import bcrypt from 'bcrypt'
// models
import User from "../../models/user"

const saltRounds = 10

const checkBcrypt = function(user, password) {
	return bcrypt.compareSync(password, user.hashed_password)
}

export const signup = async (
	email,
	password,
	phone,
	address
) => {
	try {
		const exists = await User.findOne({
			where: {
				email
			}
		})

		if (exists) {
			return { message: 'User Already Exists', status: 400 }
		}

		const hashed_password = bcrypt.hashSync(password, saltRounds)
		await User.create({
			email,
			hashed_password,
			phone,
			address
		})

		return { message: 'User created successfully', status: 200 }

	} catch (err) {
		console.log('Error in signup', err)
		return {messsage: 'Error in signup', status: 500}
	}
}

export const login = async function(email, password) {
	try {
		const user = await User.findOne({
			where: {email: email.toLowerCase()}
		})

		// No user found
		if (!user || !checkBcrypt(user, password)) {
			return Promise.reject({message: "Invalid Credentials", status: 401})
		}

		return user
	} catch (error) {
		console.error(error)
	}
}
