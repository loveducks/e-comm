const API_URL = process.env.REACT_APP_BASE_URL

export function apiCall(url, method = "GET", payload = {}, contentType, header = {}) {
	let headers = new Headers()

	headers.set("Content-Type", "application/json; charset=utf-8")
	headers.set("Cache-control", "private, max-age=0, no-cache, no-store")
	for (const [key, value] of Object.entries(header)) {
		// console.log("key", key)
		// console.log("value", value)
		headers.set(key, value)
	}

	let options = {
		method,
		headers,
		credentials: "include"
	}
	if (method === "POST" || method === "PUT") {
		options.body = JSON.stringify(payload)
	}

	if (contentType === "text/html") {
		return fetch(url, options)
			.then(r => {
				return r.status === 200 ? r.blob() : r.json()
			})
			.catch(err => {
				console.log(err)
				throw err
			})
	} else {
		return fetch(API_URL + url, options)
			.then(r => {
				return r.text().then(text => {
					return text ? JSON.parse(text) : {}
				})
			})
			.catch(err => {
				console.log(API_URL, url, options)
				console.log("fetch error", err)
				throw err
			})
			.then(r => {
				return r
			})
	}
}

export function put(url, payload, contentType, header = {}) {
	return apiCall(url, "PUT", payload, contentType, header)
}

export function post(url, payload, contentType, header = {}) {
	return apiCall(url, "POST", payload, contentType, header)
}

export function get(url, contentType, header = {}) {
	return apiCall(url, "GET", null, contentType, header)
}
