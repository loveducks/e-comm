const Validator = require("jsonschema").Validator

export function matchSchema(data, schema) {
	if (schema.type !== "object") {
		schema = object(schema)
	}

	return new Validator().validate(data, schema)
}

export function string(minLength, maxLength, required) {
	return {
		type: "string",
		minLength: minLength,
		maxLength: maxLength,
		required: required === undefined || required
	}
}

export function int(min, max, required) {
	return {
		type: "integer",
		minimum: min,
		maximum: max,
		required: required === undefined || required
	}
}

export function number(min, max, required) {
	return {
		type: "number",
		minimum: min,
		maximum: max,
		required: required === undefined || required
	}
}

export function bool(required) {
	return {
		type: "boolean",
		required: required === undefined || required
	}
}

export function array(required) {
	return {
		type: "array",
		required: required === undefined || required
	}
}

export function object(props) {
	return Object.assign(
		{
			type: "object"
		},
		{
			properties: props
		}
	)
}

export function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}
