const storage = require("./storage")
const sql = storage.sql
//const auth = require("../helpers/auth")

const Product = storage.database.define(
	"product",
	{
		product_name: {
			type: sql.STRING,
			unique: true
		},
		brand_name: sql.STRING,
		description: sql.STRING,
		price: sql.DECIMAL,
		qty: sql.DECIMAL
	},
	{
		freezeTableName: true,
		timestamps: true,
		hooks: {
			afterCreate: product => {
				return product
			}
		}
	}
)

Product.sync()
// TODO
// add seeders

export default Product
