(() => {

	/**
	*	private variable
	*/

	let _schoolId = "A8"; // 暫時假資料（南開科技大學）
	let _system = "bachelor";
	let _wishList = [ // 志願列表
	{id:"2A801" , school: "南開科技大學", dept: "機械工程系車輛組"},
	{id:"2A807" , school: "南開科技大學", dept: "工業管理系"},
	{id:"1A801" , school: "南開科技大學", dept: "企業管理系"}
	]

	/**
	*	cache DOM
	*/

	const $wishListWrap = $('#wrap-wishList');
	const $wishList = $('#wishList');
	const wishList = document.getElementById('wishList');
	let $wishEditBtn;
	const $uploadForm = $('#form-upload');
	const $ModalDeptId = $('#ModalDeptId');
	const $ModalSchool = $('#ModalSchool');
	const $ModalDeptName = $('#ModalDeptName');
	const $saveBtn = $('#btn-save');
	const $exitBtn = $('#btn-exit');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$wishEditBtn.on('click', _handleEditModal);
	$saveBtn.on('click', _handleSave);
	$exitBtn.on('click', _handleExit);

	function _init() {
		student.setHeader();
		_renderWishList();
		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 選擇圖片",
			input: false
		});
	}

	function _renderWishList() {
		let wishHTML = '';
		_wishList.forEach((value, index) => {
			wishHTML += `
			<tr class="table-warning">
			<td>` + (index + 1) + `</td>
			<td>` + value.id + `</td>
			<td>` + value.school + ` ` + value.dept + `</td>
			<td class="text-right">
			<button type="button" class="btn btn-info btn-wishEdit" data-toggle="modal" data-target="#modal-applicationDoc" data-deptid="` + value.id + `">
			<i class="fa fa-upload" aria-hidden="true"></i>
			<span class="hidden-sm-down"> 上傳</span>
			</button>
			</td>
			</tr>
			`
		});
		wishList.innerHTML = wishHTML;
		$wishEditBtn = $wishList.find('.btn-wishEdit');
	}

	function _handleEditModal() {
		const deptId = $(this).data('deptid');
		let applicationDoc = {};
		student.getDeptApplicationDoc(_schoolId, _system, deptId)
		.then((res) => { return res.json(); })
		.then((json) => {
			applicationDoc["schoolId"] = json.id;
			applicationDoc["schoolName"] = json.title;
			applicationDoc["deptId"] = json.departments[0].id;
			applicationDoc["deptNmae"] = json.departments[0].title;
			applicationDoc["applicationDocFiles"] = [];
			json.departments[0].application_docs.forEach((value, index) => {
				applicationDoc["applicationDocFiles"][index] = {};
				applicationDoc["applicationDocFiles"][index]["typeId"] = value.type_id;
				applicationDoc["applicationDocFiles"][index]["name"] = value.type.name;
				applicationDoc["applicationDocFiles"][index]["description"] = value.description;
				applicationDoc["applicationDocFiles"][index]["engDescription"] = value.eng_description;
				applicationDoc["applicationDocFiles"][index]["required"] = value.required;
				applicationDoc["applicationDocFiles"][index]["files"] = []

			})
			console.log(applicationDoc);
		})
		.then(() => {
			$ModalDeptId.text(applicationDoc.deptId)
			$ModalSchool.text(applicationDoc.schoolName);
			$ModalDeptName.text(applicationDoc.deptNmae);
			$wishListWrap.hide();
			$uploadForm.fadeIn();
		})
	}

	function _handleSave() {
		$uploadForm.hide();
		$wishListWrap.fadeIn();
	}
	
	function _handleExit() {
		$uploadForm.hide();
		$wishListWrap.fadeIn();
	}

})();
