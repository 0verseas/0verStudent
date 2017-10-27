(() => {

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	async function _init() {
		try {

			const response = await student.isLogin();
			if (!response.ok) { throw response; }

			$('#btn-smart').attr('href', env.baseUrl + '/students/print-admission-paper');
			console.log("Asd");
			loading.complete();

		} catch (e) {
			if (e.status && e.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		}
	}

})();
