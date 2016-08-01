var request = new Promise((resolve, reject) => {
	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {
		if(xhr.readyState === 4) {
			if(xhr.status !== 200){
				reject(xhr.responseText);
			}
			else {
				resolve(xhr.responseText);
			}
		}
	};

	xhr.open('GET', url);
	xhr.send();
});