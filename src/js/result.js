(() => {

	/**
	*	private variable
	*/

	let _systemId = 0;
	let _hasOlympia = false;
	let _hasAdmission = false;
	let _hasPlacement = false;

	/**
	*	cache DOM
	*/
	
	const $olympiaForm = $('#form-olympia');
	const $olympiaTbody = $('#tbody-olympia');
	const $admissionForm = $('#form-admission');
	const $admissionTbody = $('#tbody-admission');
	const $placementForm = $('#form-placement');
	const $placementTbody = $('#tbody-placement');
	const $noSelectForm = $('#form-no-select');
	const $checkBtn = $('#btn-check');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$checkBtn.on('click', _checkAllSet);

	async function _init() {

		try {
			const progressResponse = await student.getStudentRegistrationProgress();
			if (!progressResponse.ok) { throw progressResponse; }
			const progressJson = await progressResponse.json();

			_systemId = progressJson.student_qualification_verify.system_id;

			console.log(!!progressJson.student_olympia_aspiration_order);

			if (_systemId === 1) {
				_hasOlympia = !!progressJson.student_olympia_aspiration_order;
				_hasAdmission = !!progressJson.student_department_admission_selection_order;
				_hasPlacement = !!progressJson.student_department_admission_placement_apply_way;
			} else if (_systemId === 2) {
				_hasAdmission = !!progressJson.student_two_year_tech_department_admission_selection_order;
			} else {
				_hasAdmission = !!progressJson.student_graduate_department_admission_selection_order;
			}

			if (!_hasOlympia && !_hasAdmission && !_hasPlacement) {
				$noSelectForm.show();
			} else {

				const admissionKey = [ // 個人申請在每個學制的 key
				"student_department_admission_selection_order",
				"student_two_year_tech_department_admission_selection_order",
				"student_graduate_department_admission_selection_order",
				"student_graduate_department_admission_selection_order"
				]
				
				if (_systemId === 1) { // 學士班，三種都有可能
					if (_hasOlympia) {
						const url = '/students/olympia-aspiration-order';
						const olympiaResponse = await student.getOrderResultList(url);
						if (!olympiaResponse.ok) { throw olympiaResponse; }
						const olympiaJson = await olympiaResponse.json();
						const olympiaList = olympiaJson.student_olympia_aspiration_order;
						let olympiaHTML = '';
						olympiaList.forEach((val, index) => {
							olympiaHTML += `
							<tr>
							<td>` + val.order + `</td>
							<td>` + val.department_data.card_code + `</td>
							<td>` + val.department_data.school.title + ' ' + val.department_data.title + `</td>
							</tr>
							`
						})
						$olympiaTbody.html(olympiaHTML);
						$olympiaForm.show();
					}
					if (_hasAdmission) {
						const url = '/students/admission-selection-order';
						const admissionResponse = await student.getOrderResultList(url);
						if (!admissionResponse.ok) { throw admissionResponse; }
						const admissionJson = await admissionResponse.json();
						const admissionList = admissionJson[admissionKey[(_systemId - 1)]];
						let admissionHTML = '';
						admissionList.forEach((val, index) => {
							let showId = (_systemId === 1) ? val.department_data.card_code : val.dept_id;
							admissionHTML += `
							<tr>
							<td>` + val.order + `</td>
							<td>` + showId + `</td>
							<td>` + val.department_data.school.title + ' ' + val.department_data.title + `</td>
							</tr>
							`
						})
						$admissionTbody.html(admissionHTML);
						$admissionForm.show();
					}
					if (_hasPlacement) {
						const url = '/students/admission-placement-order';
						const placementResponse = await student.getOrderResultList(url);
						if (!placementResponse.ok) { throw placementResponse; }
						const placementJson = await placementResponse.json();
						const placementList = placementJson.student_department_admission_placement_order;
						let placementHTML = '';
						placementList.forEach((val, index) => {
							placementHTML += `
							<tr>
							<td>` + val.order + `</td>
							<td>` + val.department_data.card_code + `</td>
							<td>` + val.department_data.school.title + ' ' + val.department_data.title + `</td>
							</tr>
							`
						})
						$placementTbody.html(placementHTML);
						$placementForm.show();
					}
				} else { // 其他學制，只需判斷個人申請
					if (_hasAdmission) {
						const url = '/students/admission-selection-order';
						const admissionResponse = await student.getOrderResultList(url);
						if (!admissionResponse.ok) { throw admissionResponse; }
						const admissionJson = await admissionResponse.json();
						const admissionList = admissionJson[admissionKey[(_systemId - 1)]];
						let admissionHTML = '';
						admissionList.forEach((val, index) => {
							let showId = (_systemId === 1) ? val.department_data.card_code : val.dept_id;
							admissionHTML += `
							<tr>
							<td>` + val.order + `</td>
							<td>` + showId + `</td>
							<td>` + val.department_data.school.title + ' ' + val.department_data.title + `</td>
							</tr>
							`
						})
						$admissionTbody.html(admissionHTML);
						$admissionForm.show();
					}
				}
			}
			loading.complete();
		} catch(e) {
			if (e.status && e.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (e.status && e.status === 403) {
				e.json && e.json().then((data) => {
					alert(`ERROR: \n${data.messages[0]}\n` + '即將返回上一頁');
					window.history.back();
				})
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		}
	}

	function _checkAllSet() {
		var isAllSet = confirm("確認後就無法再次更改資料，確認送出嗎？");
		if (isAllSet === true) {
			const data = {
				"confirmed": true
			}
			student.dataConfirmation(data)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				console.log(json);
				alert("成功確認資料。");
				location.href = "./uploadReviewItems.html";
				loading.complete();
			})
			.catch((err) => {
				if (err.status && err.status === 401) {
					alert('請登入。');
					location.href = "./index.html";
				} else {
					err.json && err.json().then((data) => {
						console.error(data);
						alert(`ERROR: \n${data.messages[0]}`);
					})
				}
				loading.complete();
			});
		} 
	}

})();
