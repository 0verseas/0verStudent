var personalInfo = (function () {

    /**
	 * cache DOM
	 */
    

    /**
	 * init
	 */

    init();

    /**
	 * bind event
	 */

    function init() {
        $('.datepicker').datepicker({
            format: 'yyyy-mm-dd'
        });
    }
})();