import React, { useEffect, useState } from 'react'
// react-router
import { useNavigate } from "react-router-dom"

// redux
import { useDispatch, useSelector } from "react-redux"
import { userDataSelector, login } from '../../slices/userSlice'

const Login = () => {
	const [formData, setFormData] = useState({ email: '', password: '' })
	const [error, setError] = useState(false)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const user = useSelector(userDataSelector)

	const handleChange = (e) => {
		if (e.target.value.includes(' ')) {
			setError(true)
			return
		}
		setError(false)
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = e => {
		e.preventDefault()
		dispatch(
			login(formData.email, formData.password)
		)
	}

	// TODO
	// redirection  on page load
	// /state api for fetching user details
	useEffect(() => {
		if(user.jwt)
			navigate('/')
	}, [user.jwt])

	return (
		<div>
			<h1>login</h1>
			<form onSubmit={handleSubmit}>
				<div className="container">
					<label>Email: </label>
					<input type="email" placeholder="Enter email" name="email" required onChange={handleChange} />
					<label>Password : </label>
					<input type="password" placeholder="Enter Password" name="password" required onChange={handleChange} />
					<button type="submit">Login</button>
					{error && <div>error</div>}
				</div>
			</form>
		</div>
	)
}

export default Login
