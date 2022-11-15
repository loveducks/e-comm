import React, { useEffect, useState } from 'react'

// react-router
import { useNavigate } from "react-router-dom"
// redux
import { useDispatch, useSelector } from "react-redux"
import { productDataSelector, listProducts } from '../../slices/productSlice'
import { userDataSelector } from '../../slices/userSlice'

const Home = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const user = useSelector(userDataSelector)
	const product = useSelector(productDataSelector)

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token)
			dispatch(
				listProducts({
					limit: 20,
					skip: 0,
					search: '',
					token
				})
			)
		else
			navigate('/login')
	}, [])

	return <ul>
		{product.data.map(prod => <li key={prod.id}>{prod.product_name}</li>)}
	</ul>
}

export default Home
