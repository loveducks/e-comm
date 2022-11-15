import { Op } from 'sequelize'
// models
import Product from "../../models/product"

export const listAllProducts = () => {
	return Product.findAll()
		.then(prod => {
			return Promise.resolve(prod)
		})
		.catch(err => Promise.reject(err))
}

export const createProduct = (product_name, brand_name, description, qty, price) => {
	return Product.create({
		product_name, brand_name, description, qty, price
	})
		.then(() => {
			return Promise.resolve({ message: 'Product added', status: 200 })
		})
		.catch(err => Promise.reject(err))
}

export const productsList = async (
	limit,
	skip,
	search = null,
	priceFloor,
	priceCeil
) => {
	try {
		let searchQuery = {
			price: {
				[Op.between]: [
					priceFloor,
					priceCeil
				]
			}
		}
		if (search?.length && search !== "undefined" && search !== "null") {
			searchQuery = {
				[Op.and]: {
					product_name: {
						[Op.iLike]: "%" + search + "%"
					},
					price: {
						[Op.between]: [
							priceFloor,
							priceCeil
						]
					}
				}
			}
		}

		const products = await Product.findAll({ limit, offset: skip, where: searchQuery })

		const productCollectionCount = await Product.findAndCountAll({ where: searchQuery })
		const totalCount = productCollectionCount.count
		return Promise.resolve({ data: { products, totalCount }, message: 'Products found', status: 200 })
	} catch (err) {
		console.log('Error in search query', err)
		return Promise.reject(err)
	}
}
