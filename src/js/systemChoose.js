(() => {
	/**
	*	cache DOM
	*/
	const $SystemChoose = $('.SystemChoose');
	const $nextBtn = $SystemChoose.find('.SystemChoose__btnNext');
	const $system = $SystemChoose.find('#SystemChoose__inputSystem');

	/**
	*	bind event
	*/
	_init();

	/**
	*	bind event
	*/
	$nextBtn.on('click', _handleSubmit);

	/**
	*	event handler
	*/

	async function _init() {
		try {
			const response = await student.getStudentRegistrationProgress();
			console.log(response.status);
			if (!response.ok) {
				if (response.status && response.status === 401) {
                    alert('請登入。');
                    location.href = "./index.html";
				} else {
                    throw response;
                }
			}
			const json = await response.json();

			if (json.student_qualification_verify) {
				$system.val(json.student_qualification_verify.system_id);
			}

		} catch (error) {
			console.log(error);
		}

		loading.complete();
	}

	function _handleSubmit() {
		let system = +$system.val();
		if (system >= 3) {
			location.href = `./qualify3.html?systemid=${system}`;
		} else {
			location.href = `./qualify${system}.html`;
		}
	}
})();
