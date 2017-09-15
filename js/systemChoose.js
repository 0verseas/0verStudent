(() => {
	/**
	 * cache DOM
	 */
	const $SystemChoose = $('.SystemChoose');
	const $nextBtn = $SystemChoose.find('.SystemChoose__btnNext');
	const $system = $SystemChoose.find('#SystemChoose__inputSystem');

	/**
	 * bind event
	 */
	$nextBtn.on('click', _handleSubmit);

	/**
	 * private method
	 */
	function _handleSubmit() {
		const system = $system.val();
		location.href = `./signUp${system}.html`;
	}
})();
