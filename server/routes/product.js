import * as expect from "../helpers/valid"
import {listAllProducts, createProduct, productsList} from "../controllers/product"

export default function createApi(api, app) {
	api.get("list", {auth: api.Auth.jwt}, async (req, res, next) => {
		try {
			const list = await listAllProducts()
			return {data: list, message: "Products fetched", status: 200}
		} catch (err) {
			console.log("Error fetching products", err)
			return {message: "Error fetching products", status: 500}
		}
	})

	api.post(
		"create",
		{
			auth: api.Auth.jwt,
			schema: {
				product_name: expect.string(3, 50),
				brand_name: expect.string(3, 50),
				description: expect.string(6, 200),
				qty: expect.number(0, 100),
				price: expect.number(0, 1000)
			}
		},
		(req, res, next) => {
			return createProduct(
				req.body.product_name,
				req.body.brand_name,
				req.body.description,
				req.body.qty,
				req.body.price
			)
				.then(resp => {
					return resp
				})
				.catch(error => {
					console.log("Error creating product", error)
					return {message: "Error creating product", status: 500}
				})
		}
	)

	api.get(
		"products",
		{
			auth: api.Auth.jwt
		},
		async function (req, res) {
			try {
				const limit = parseInt(req.query.limit) || null
				const skip = parseInt(req.query.skip) || 0
				const search = req.query.search || ""
				const priceFloor = parseFloat(req.query.priceFloor) || 0
				const priceCeil = parseFloat(req.query.priceCeil) || 999

				const resp = await productsList(limit, skip, search, priceFloor, priceCeil)
				return resp
			} catch (error) {
				console.log("Error creating product", error)
				return {message: "Error creating product", status: 500}
			}
		}
	)
}
