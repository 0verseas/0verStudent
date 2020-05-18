(() => {

	/**
	*	cache DOM
	*/
	const $chinesesAgreeCheckBox = $('#agree-check-chinese');
	const $englishAgreeCheckBox = $('#agree-check-english');
	const $agreeButton = $('#btn-agree');
	let agreeCheck = false;
	
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/
	$chinesesAgreeCheckBox.on('change',_handleCheck);
	$englishAgreeCheckBox.on('change',_handleCheck);
	$agreeButton.on('click',_handleAgree);

	function _init() {
		loading.complete();
	}

	function _handleCheck(){
		console.log($chinesesAgreeCheckBox);
		console.log($englishAgreeCheckBox);
		if($(this)[0].checked){
			$chinesesAgreeCheckBox[0].checked = true;
			$englishAgreeCheckBox[0].checked = true;
			agreeCheck = true;
		} else {
			$chinesesAgreeCheckBox[0].checked = false;
			$englishAgreeCheckBox[0].checked = false;
			agreeCheck = false;
		}
	}

	function _handleAgree(){
		if(agreeCheck){
			location.href='./register.html'
		} else {
			alert('你必須詳讀所有條款內容，並在最後勾選表示同意。\n You have to read the all the terms thoroughly, and then check the checkbox in the end.')
		}
	}


})();
