(() => {
	/**
	*	cache DOM
	*/
	const $SystemChoose = $('.SystemChoose');
	const $nextBtn = $SystemChoose.find('.SystemChoose__btnNext');
	const $system = $SystemChoose.find('#SystemChoose__inputSystem');

	const smoothScroll = (number = 0, time) => {
		if (!time) {
			document.body.scrollTop = document.documentElement.scrollTop = number;
			return number;
		}
		const spacingTime = 20; // 動畫循環間隔
		let spacingInex = time / spacingTime; // 計算動畫次數
		let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 擷取當前scrollbar位置
		let everTop = (number - nowTop) / spacingInex; // 計算每次動畫的滑動距離
		let scrollTimer = setInterval(() => {
			if (spacingInex > 0) {
				spacingInex--;	
				smoothScroll(nowTop += everTop); //在動畫次數結束前要繼續滑動
			} else {
				clearInterval(scrollTimer); // 結束計時器
			}
		}, spacingTime);
	};

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

			if (!response.ok) {
				throw response;
			}
			const json = await response.json();

			if (json.student_qualification_verify) {
				$system.val(json.student_qualification_verify.system_id);
			}
			if(document.body.scrollWidth<768)  // 判別網頁寬度 少於768會今入單欄模式
			smoothScroll(document.body.scrollHeight/2.2,800);  // 用整體長度去做計算  滑動到需要填寫欄位位置	
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
