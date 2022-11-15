import {createSlice} from "@reduxjs/toolkit"

import {get, post} from "../helpers/api"
export const initialState = {
	loading: false,
	hasErrors: false,
	data: [],
	jwt: ""
}

const userSlice = createSlice({
	name: "user",
	initialState: initialState,
	reducers: {
		onLogin: state => {
			state.loading = true
			state.hasErrors = false
			state.data = []

			return state
		},
		onLoginSuccess: (state, {payload}) => {
			state.loading = true
			state.hasErrors = false
			state.data = payload.data
			state.jwt = payload.data.jwt
			console.log(payload.data.jwt)
			localStorage.setItem("token", payload.data.jwt)

			return state
		},
		onLoginReject: state => {
			state.loading = false
			state.hasErrors = true
			state.data = []

			return state
		}
	},
	extraReducers: {}
})

export const {onLogin, onLoginSuccess, onLoginReject} = userSlice.actions

export const userDataSelector = state => state.user

export function login(email, password) {
	return async dispatch => {
		try {
			dispatch(onLogin())
			const response = await post(
				"login",
				{
					email,
					password
				},
				{}
			)

			if (response.status === 200) {
				dispatch(onLoginSuccess(response))
			} else {
				dispatch(onLoginReject())
			}
		} catch (error) {
			console.log("Error", error)
			dispatch(onLoginReject())
		}
	}
}

export default userSlice
