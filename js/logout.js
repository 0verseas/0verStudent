(() => {

	/**
	*	cache DOM
	*/

	const $logoutBtn = $('#btn-logout');

	/**
	*	bind event
	*/

	$logoutBtn.on('click', _handleLogout);

	function _handleLogout() {
		student.logout()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			alert('登出成功。');
			location.href="./index.html";
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			})
		})
	}

})();
