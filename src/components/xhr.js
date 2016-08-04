const request = (method, url, data='') => {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4) {
				if(xhr.status === 200 || xhr.status === 202) {
					if(method === 'POST') {
						resolve(xhr.status);
					}
					else {
						resolve(xhr.responseText);
					}
				}
				else {
					reject(xhr.responseText);
				}
			}
		};

		xhr.open(method, url);
		xhr.send(JSON.stringify({
			...data
		}));
	});
};

module.exports = {
	request
};