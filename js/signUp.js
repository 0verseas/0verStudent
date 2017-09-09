var signUp = (function () {

    /**
	 * cache DOM
	 */

     var $signUpForm = $('#form-signUp');
     var $checkId = $signUpForm.find('.checkId');
     var $checkIdAlert = $signUpForm.find('#checkIdAlert');
     var $holdpassport = $signUpForm.find('.holdpassport');
     var $holdpassportPForm = $signUpForm.find('#holdpassportPForm');
     var $holdpassportP = $signUpForm.find('.holdpassportP');
     var $getPForm = $signUpForm.find('#getPForm');
     var $holdOtherPassportForm = $signUpForm.find('#holdOtherPassportForm');

    /**
	 * init
	 */

     init();

    /**
	 * bind event
	 */

    $checkId.on("click", _switchCheckIdAlert);
    $holdpassport.on("click", _switchHoldpassportPForm);
    $holdpassportP.on("click", _switchPassportForm);


    function init() {
        $('.datepicker').datepicker({
            format: 'yyyy-mm-dd'
        });
    }

    function _switchCheckIdAlert() {
        var status = $(this).data('checkid');
        if (!status) {
            $checkIdAlert.fadeIn();
        } else {
            $checkIdAlert.fadeOut();
        }
    }

    function _switchHoldpassportPForm() { // 是否持有英國國民(海外)護照或香港護照以外之旅行證照，或持有澳門護照以外之旅行證照？(含葡萄牙護照)
        var status = $(this).data('holdpassport');
        if (status) {
            $holdpassportPForm.fadeIn();
            _switchPassportForm();
        } else {
            $holdpassportPForm.fadeOut();
            $getPForm.fadeOut();
            $holdOtherPassportForm.fadeOut();
        }
    }

    function _switchPassportForm() { // 您是否持有葡萄牙護照？
        var status = $(this).data('holdpassportp');
        if (status) {
            $getPForm.fadeIn();
            $holdOtherPassportForm.fadeOut();
        } else {
            $holdOtherPassportForm.fadeIn();
            $getPForm.fadeOut();
        }
    }

})();