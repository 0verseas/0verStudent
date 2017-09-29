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

	function getDeptApplicationDoc(schoolId, system, deptId) { // 接系所資料（暫時用在「上傳備審資料」上）
		return fetch(baseUrl + `/schools/` + schoolId + `/systems/` + system + `/departments/` + deptId, {
			method: 'GET'
		});
	}

	return {
		setHeader,
		register,
		getDeptApplicationDoc
	};

})();
