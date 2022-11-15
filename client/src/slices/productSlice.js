import {createSlice} from "@reduxjs/toolkit"

import {get} from "../helpers/api"
export const initialState = {
	loading: false,
	hasErrors: false,
	search: "",
	data: [],
	count: 0
}

const productSlice = createSlice({
	name: "product",
	initialState: initialState,
	reducers: {
		listProduct: (state, {payload}) => {
			state.loading = true
			state.hasErrors = false
			state.data = []

			return state
		},
		listProductSuccess: (state, {payload}) => {
			state.loading = true
			state.hasErrors = false
			state.data = payload.data.products
			state.count = payload.data.totalCount

			return state
		},
		listProductReject: state => {
			state.loading = false
			state.hasErrors = true
			state.data = []
			state.count = 0

			return state
		}
	},
	extraReducers: {}
})

export const {listProduct, listProductReject, listProductSuccess} = productSlice.actions

export const productDataSelector = state => state.product

export function listProducts({limit, skip, search, token}) {
	return async dispatch => {
		try {
			dispatch(listProduct())
			const response = await get(
				`products?limit=${limit}&skip=${skip}&search=${search}`,
				{},
				{Authorization: `Bearer ${token}`}
			)

			if (response.status === 200) {
				dispatch(listProductSuccess(response))
			} else {
				dispatch(listProductReject())
			}
		} catch (error) {
			console.log("Error", error)
			dispatch(listProductReject())
		}
	}
}

export default productSlice
