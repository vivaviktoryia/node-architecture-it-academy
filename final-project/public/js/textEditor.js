document.addEventListener('DOMContentLoaded', function () {
	tinymce.init({
		selector: '#tourDescription',
		plugins:
			'advlist autolink lists link image charmap print preview hr anchor pagebreak',
		toolbar:
			'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | link image',
		menubar: false,
	});
});
