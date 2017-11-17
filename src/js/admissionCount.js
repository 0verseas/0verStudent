(() => {

	/**
	*	cache DOM
	*/

	$countTbody = $('#tbody-count');
	$title = $('#title');
	
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	async function _init() {
		try {
			const response = await student.getAdmissionCountDetail();
			if (!response.ok) { throw response; }
			const detailJson = await response.json();

			let hkMaster = detailJson.hk_master;

			$title.text("HK Master");

			let countSum = 0;
			let countList = hkMaster.map((value) => {
				countSum += value.count;
				return {
					date: value.Date,
					count: value.count,
					sum: countSum
				}
			})

			tbodyHTML = '';
			countList.forEach((value, index) => {
				tbodyHTML += `
					<tr>
						<td>${value.date}</td>
						<td>${value.count}</td>
						<td>${value.sum}</td>
					</tr>
				`
			})
			$countTbody.html(tbodyHTML);

			console.log(countList);

			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			})
			loading.complete();
		}
	}


})();
