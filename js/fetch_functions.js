const getData = (url, callback) => {
	const request = new Request(url, {
		method: 'GET',
		headers: {'Content-Type': 'application/json;charset=UTF-8'}
	});
	fetch(request)
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		})
		.then(response => {
			callback(response);
		}).catch(error => {
			console.error(error);
		});
};

const postData = (url, data, callback) => {
	const request = new Request(url, {
		method: 'POST',
		headers: {'Content-Type': 'application/json;charset=UTF-8'},
		body: JSON.stringify(data)
	});
	fetch(request)
		.then(response => {
			if (response.ok) {
				return response.text();
			} else {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		})
		.then((response) => {
			callback(response);
		}).catch(error => {
			console.error(error);
		});
};