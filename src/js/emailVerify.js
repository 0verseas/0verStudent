(() => {
	/**
	* init
	*/
	_verify();

	/**
	* private method
	*/
	async function _verify(){
		try {
			const email = _getParam('email', window.location.href);
			const token = _getParam('token', window.location.href);

			const response = await student.verifyEmail(email, token);
			if (!response.ok) { throw response; }

			$('#alert-valid').show();
			setTimeout(() => {
				location.href = './index.html';
			}, 3000);
			loading.complete();

		} catch (e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			})
			$('#alert-invalid').show();
			loading.complete();
		}
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
