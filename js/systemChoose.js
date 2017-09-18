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
	 * event handler
	 */
	function _handleSubmit() {
		const system = $system.val();
		location.href = `./qualify${system}.html`;
	}
})();
