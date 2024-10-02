document.addEventListener('DOMContentLoaded', function () {
	const popup = document.querySelector('.popup');
	if (popup) {
		popup.style.display = 'block';
		setTimeout(() => {
			popup.style.display = 'none'; 
		}, 3000); 
	}
});
