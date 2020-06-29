(() => {

	/**
	*	cache DOM
	*/
	const $checkBox2 = $('#agreeLawCheck2');
	const $checkBox3 = $('#agreeLawCheck3');
	const $checkBox4 = $('#agreeLawCheck4');
	const $checkBox5 = $('#agreeLawCheck5');
	const $checkBox6 = $('#agreeLawCheck6');
	const $checkBox7 = $('#agreeLawCheck7');
	const $checkBox8 = $('#agreeLawCheck8');
	const $checkBox9 = $('#agreeLawCheck9');
	const $checkBox10 = $('#agreeLawCheck10');
	
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/
	$checkBox2.on('change',_handleCheck);
	$checkBox3.on('change',_handleCheck);
	$checkBox4.on('change',_handleCheck);
	$checkBox5.on('change',_handleCheck);
	$checkBox6.on('change',_handleCheck);
	$checkBox7.on('change',_handleCheck);
	$checkBox8.on('change',_handleCheck);
	$checkBox9.on('change',_handleCheck);
	$checkBox10.on('change',_handleCheck);

	function _init() {
		loading.complete();
	}

	function _handleCheck(){
		let checkAll = 1;
		for(let i=0; i<9;i++){
			if(!$('#agreeLawCheck'+(i+2))[0].checked){
				checkAll = 0;
				break;
			}
		}
		if(checkAll === 1){
			$('#btn-agree').prop('disabled', false);
		} else {
			$('#btn-agree').prop('disabled', true);
		}
	}


})();
