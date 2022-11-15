import Sql from 'sequelize'

exports.sql = Sql

const db = new Sql(process.env.DATABASE_NAME, process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
	host: process.env.DBHOST,
	port: process.env.DBPORT,
	dialect: "postgres",
	define: {
		timestamps: true
	},

	pool: {
		max: 10,
		min: 0,
		idle: 10000
	},
	query: {
		raw: true
	},
	logging: true,
	sync: true
})

db.dialect.supports.schemas = true

exports.database = db

exports.defineModel = function(name, def, opts) {
	return db.define(name, def, opts)
}

console.log("! storage loaded.")
