(() => {

	/**
	*	private variable
	*/

	let _systemId = 0;
	let _hasOlympia = false;
	let _hasAdmission = false;
	let _hasPlacement = false;
	let _olympiaList = [];
	let _admissionList = [];
	let _placementList = [];

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

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	async function _init() {

		try {
			const response = await student.getOrderResultList();
			if (!response[0].ok) { throw response[0]; }

			const resAdmission = await response[0].json();
			const resOlympia = await response[1].json();
			const resPlacement = await response[2].json();

			_systemId = resAdmission.student_qualification_verify.system_id;

			if (_systemId === 1) { // 學士班
				_hasOlympia = (resOlympia.student_misc_data.has_olympia_aspiration !== null && resOlympia.student_misc_data.has_olympia_aspiration === true);
				_hasAdmission = (resAdmission.student_misc_data.join_admission_selection !== null && resAdmission.student_misc_data.join_admission_selection === true);
				_hasPlacement = (resPlacement.student_misc_data.admission_placement_apply_way !== null && resPlacement.student_misc_data.admission_placement_apply_way !== 79);
			} else if (_systemId === 2) { // 二技
				_hasAdmission = (resAdmission.student_misc_data.join_admission_selection !== null && resAdmission.student_misc_data.join_admission_selection === true);
			} else { // 碩博
				_hasAdmission = (resAdmission.student_misc_data.join_admission_selection !== null && resAdmission.student_misc_data.join_admission_selection === true);
			}

			console.log(_hasOlympia);
			console.log(_hasAdmission);
			console.log(_hasPlacement);

			const admissionKey = [
			"student_department_admission_selection_order",
			"student_two_year_tech_department_admission_selection_order",
			"student_graduate_department_admission_selection_order",
			"student_graduate_department_admission_selection_order"
			]

			if (_hasOlympia) {
				_olympiaList = resOlympia.student_olympia_aspiration_order;
				let olympiaHTML = '';
				_olympiaList.forEach((val, index) => {
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
				console.log(_olympiaList);
			}

			if (_hasAdmission) {
				_admissionList = resAdmission[admissionKey[(_systemId - 1)]];
				let admissionHTML = '';
				_admissionList.forEach((val, index) => {
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
				console.log(_admissionList);
			}

			if (_hasPlacement) {
				_placementList = resPlacement.student_department_admission_placement_order;
				let placementHTML = '';
				_placementList.forEach((val, index) => {
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
				console.log(_placementList);
			}

			if (!_hasOlympia && !_hasAdmission && !_hasPlacement) {
				$noSelectForm.show();
			}
			loading.complete();
		} catch(e) {
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
