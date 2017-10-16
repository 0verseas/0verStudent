(() => {

	/**
	*	cache DOM
	*/

    const applyWaysFieldSet = document.getElementById('apply-ways');
	
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	function _init() {
		student.setHeader();
		student.getStudentAvailableApplyWayList()
		.then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
		})
		.then((json) => {
            let fieldSetHTML = '';

			json.forEach((file, index) => {
                fieldSetHTML += '<div class="form-check"><label class="form-check-label"><input type="radio" class="form-check-input" name="grade" id="" value=' + file.code + '>' + file.description + '</label></div>';
            });

            applyWaysFieldSet.innerHTML = fieldSetHTML;
        })
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			}

			err.json && err.json().then((data) => {
				console.error(data);
			})
		})
	}

})();
