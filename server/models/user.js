import storage from "./storage.js"
const sql = storage.sql

const User = storage.database.define(
	"user",
	{
		email: {
			type: sql.STRING,
			validate: {
				isEmail: true
			}
		},
		hashed_password: sql.STRING,
		address: sql.STRING,
		phone: sql.STRING
	},
	{
		freezeTableName: true,
		timestamps: true,
		hooks: {
			afterCreate: user => {
				return user
			}
		}
	}
)

User.sync()

export default User
