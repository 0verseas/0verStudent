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

	const ScrollTop = (number = 0, time) => {
		if (!time) {
			document.body.scrollTop = document.documentElement.scrollTop = number;
			return number;
		}
		const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
		let spacingInex = time / spacingTime; // 计算循环的次数
		let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 获取当前滚动条位置
		let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离
		let scrollTimer = setInterval(() => {
			if (spacingInex > 0) {
				spacingInex--;
				ScrollTop(nowTop += everTop);
			} else {
				clearInterval(scrollTimer); // 清除计时器
			}
		}, spacingTime);
	};

	async function _init() {
		try {
			const response = await student.getStudentRegistrationProgress();

			if (!response.ok) {
				throw response;
			}
			const json = await response.json();

			if (json.student_qualification_verify) {
				$system.val(json.student_qualification_verify.system_id);
			}
			console.log(document.body.scrollHeight);
			ScrollTop(document.body.scrollHeight/2.2,800);
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
