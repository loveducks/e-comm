import { combineReducers } from "redux"

import userSlice from "../slices/userSlice"
import productSlice from "../slices/productSlice"

export default history =>
	combineReducers({
		userSlice,
		productSlice
	})
