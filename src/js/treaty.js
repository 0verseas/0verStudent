(() => {

	/**
	*	cache DOM
	*/
	$chechBox2 = $('#agreeLawCheck2');
	$chechBox3 = $('#agreeLawCheck3');
	$chechBox4 = $('#agreeLawCheck4');
	$chechBox5 = $('#agreeLawCheck5');
	$chechBox6 = $('#agreeLawCheck6');
	$chechBox7 = $('#agreeLawCheck7');
	$chechBox8 = $('#agreeLawCheck8');
	$chechBox9 = $('#agreeLawCheck9');
	$chechBox10 = $('#agreeLawCheck10');
	
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/
	$chechBox2.on('change',_handleCheck);
	$chechBox3.on('change',_handleCheck);
	$chechBox4.on('change',_handleCheck);
	$chechBox5.on('change',_handleCheck);
	$chechBox6.on('change',_handleCheck);
	$chechBox7.on('change',_handleCheck);
	$chechBox8.on('change',_handleCheck);
	$chechBox9.on('change',_handleCheck);
	$chechBox10.on('change',_handleCheck);

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
