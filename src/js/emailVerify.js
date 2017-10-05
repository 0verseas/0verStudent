(() => {
	/**
	* init
	*/
	_verify();

	/**
	* private method
	*/
	function _verify(){
		const email = _getParam('email', window.location.href);
		const token = _getParam('token', window.location.href);
		student.verifyEmail(email, token)
		.then((res) => {
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((data) => {
			$('#alert-valid').show();
			setTimeout(() => {
				window.location.href = './systemChoose.html';
			}, 5000);
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
			});
			$('#alert-invalid').show();
		});
	}

	function _getParam(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
		const results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
})();
