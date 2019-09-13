(() => {

	/**
	 *	private variable
	 */

	let _studentID;

	/**
	*	cache DOM
	*/
	const $reviewItemsArea = $('#reviewItemsArea'); // 各備審項目
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$('body').on('change.upload', '.file-certificate', _handleUpload);

	function _init() {
		loading.complete();
		_studentID= '2318';
		reviewItemHTML = `
			<div class="row" style="margin-bottom: 15px;">
				<div class="col-12">
					<input type="file" class="filestyle file-certificate" data-type="" data-deptid="" multiple>
				</div>
			</div>

			<div class="card">
				<div class="card-body">
					<h4 class="card-title"><span>已上傳檔案</span> <small class="text-muted">(點圖可放大或刪除)</small></h4>

				</div>
			</div>
		`;

		$reviewItemsArea.html(reviewItemHTML);

		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 選擇檔案",
			input: false
		});

	}


	async function _handleUpload() {
		//alert("upload");
		const workType = ($(this).attr('data-workstype')) ? $(this).data('workstype') : false;
		const fileList = this.files;
		let data = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			data.append('files[]', fileList[i]);
		}

		if (!!workType) {
			data.append('file_type', workType);
		}

		try {
			loading.start();
			const response = await student.MacauTranscriptsetReviewItem({data, student_id: _studentID});
			if (!response.ok) { throw response; }
			const responseJson = await response.json();

			// const uploadFileItemIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === (+responseJson.type_id ));
			// if (!!workType && workType === "works") {
			// 	_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].work_files = responseJson.work_files;
			// } else {
			// 	_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files = _wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files.concat(responseJson.files);
			// }
			//_handleEditForm();
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
	}

})();
