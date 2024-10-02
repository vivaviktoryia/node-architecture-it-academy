// const hidePopup = () => {
// 	const el = document.querySelector('.popup');
// 	if (el) el.parentElement.removeChild(el);
// };

// const displayPopup = (type, msg) => {
// 	hidePopup();
// 	const markup = `<div class="popup popup--${type}">${msg}</div>`;
// 	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
// 	window.setTimeout(hidePopup, 5000);
// };


// document.getElementById('voteForm').addEventListener('submit', (event) => {
// 	const options = document.querySelectorAll('input[name="code"]');
// 	let isChecked = false;

// 	options.forEach((option) => {
// 		if (option.checked) {
// 			isChecked = true;
// 		}
// 	});

// 	if (!isChecked) {
// 		event.preventDefault();
// 		displayPopup('error', 'Please vote before submitting!');
// 	}
// });

document.addEventListener('DOMContentLoaded', function () {
	const popup = document.querySelector('.popup');
	if (popup) {
		popup.style.display = 'block';
		setTimeout(() => {
			popup.style.display = 'none'; 
		}, 3000); 
	}
});
