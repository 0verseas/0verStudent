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
				console.log(_olympiaList);
			}

			if (_hasAdmission) {
				_admissionList = resAdmission[admissionKey[(_systemId - 1)]];
				console.log(_admissionList);
			}

			if (_hasPlacement) {
				_placementList = resPlacement.student_department_admission_placement_order;
				console.log(_placementList);
			}

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


		loading.complete();

	}

})();

	// "student_misc_data": {
	// 	"user_id": 216,
	// 	"email_verified": false,
	// 	"backup_email_verified": null,
	// 	"join_admission_selection": false,
	// 	"admission_placement_apply_way": null,
	// 	"year_of_hk_dse": null,
	// 	"year_of_hk_ale": null,
	// 	"year_of_hk_cee": null,
	// 	"my_admission_ticket_no": null,
	// 	"has_olympia_aspiration": null,
	// 	"agree_privacy_policy": true,
	// 	"created_at": "2017-10-18T21:17:51+0800",
	// 	"updated_at": "2017-10-19T00:20:06+0800",
	// 	"confirmed_at": null,
	// 	"overseas_student_id": null,
	// 	"rule_code_of_overseas_student_id": null
	// },

	// "student_misc_data": {
	// 	"user_id": 197,
	// 	"email_verified": true,
	// 	"backup_email_verified": false,
	// 	"join_admission_selection": true,
	// 	"admission_placement_apply_way": 17,
	// 	"year_of_hk_dse": null,
	// 	"year_of_hk_ale": null,
	// 	"year_of_hk_cee": null,
	// 	"my_admission_ticket_no": null,
	// 	"has_olympia_aspiration": true,
	// 	"agree_privacy_policy": true,
	// 	"created_at": "2017-10-12T16:14:31+0800",
	// 	"updated_at": "2017-10-19T00:14:02+0800",
	// 	"confirmed_at": null,
	// 	"overseas_student_id": null,
	// 	"rule_code_of_overseas_student_id": null
	// },
