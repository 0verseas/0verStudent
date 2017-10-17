(() => {

	/**
	*	cache DOM
	*/
	const $applyWaysFieldSet = $('#apply-ways');
	
	/**
	*	init
	*/
	_init();

	/**
	*	bind event
	*/
	$applyWaysFieldSet.on('change.chooseOption', '.radio-option', _handleChoose);

	/**
	* event handler
	*/
	function _handleChoose() {
		if (+$(this).val() === 23) {
			// 以香港中學文憑考試成績 (DSE)、以香港高級程度會考成績 (ALE)、以香港中學會考成績 (CEE)申請
			$('.forCode23').fadeIn();
		} else {
			$('.forCode23').hide();
		}
	}

	function _init() {
		// 取得選項
		student.getStudentAvailableApplyWayList()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			let fieldSetHTML = '';

			json.forEach((file, index) => {
				fieldSetHTML += '<div class="form-check"><label class="form-check-label"><input type="radio" class="form-check-input radio-option" name="grade" id="" value=' + file.code + '>' + file.description + '</label></div>';
			});

			$applyWaysFieldSet.html(fieldSetHTML);
		})
		.then(() => {
			// 取得選擇的選項
			student.getStudentAdmissionPlacementApplyWay()
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				const option = json.student_misc_data.admission_placement_apply_way;
				!!option && $(`.radio-option[value=${option}]`).trigger('click');
			})
		})
		.catch((err) => {
			console.error(err);
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			}

			err.json && err.json().then((data) => {
				console.error(data);
			})
		});
	}

})();
