import {combineReducers, configureStore} from "@reduxjs/toolkit"
import {createLogger} from "redux-logger"

import productSlice from "../slices/productSlice"
import userSlice from "../slices/userSlice"

const rootReducer = combineReducers({
	product: productSlice.reducer,
	user: userSlice.reducer
})

const configureAppStore = (initialState = {}) => {
	const isProduction = Boolean(process.env.NODE_ENV === "production")
	const logger = createLogger({
		collapsed: true
	})
	const middleware = isProduction ? [] : [logger]

	const store = configureStore({
		reducer: rootReducer,
		middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middleware),
		devTools: !isProduction,
		preloadedState: initialState
	})

	return {store}
}

export default configureAppStore
