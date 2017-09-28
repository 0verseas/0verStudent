const student = (() => {

	const baseUrl = env.baseUrl;

	function setHeader() {
		const $studentInfoHeader = $('#header-studentInfo');
		let $headerSystem = $studentInfoHeader.find('#headerSystem');
		const $headerIdentity = $studentInfoHeader.find('#headerIdentity');
		const $headerId = $studentInfoHeader.find('#headerId');

		let headerData = {
			system: "學士班",
			identity: "港澳生",
			id: "200003"
		}

		$headerSystem.html(headerData.system);
		$headerIdentity.html(headerData.identity);
		$headerId.html(headerData.id);
	}

	function register(data) {
		return fetch(baseUrl + `/student/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	return {
		setHeader,
		register
	};

})();
