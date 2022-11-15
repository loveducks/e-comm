import React from 'react'
import { Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'

function App() {
	return (
		<Routes>
			<Route path="/sign-up" element={<SignUp />} />
			<Route path="/login" element={<Login />} />
			<Route path="/" element={<Home />} />
		</Routes>
	);
}

export default App;
