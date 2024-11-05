const hidePopup = () => {
	const el = document.querySelector('.popup');
	if (el) el.parentElement.removeChild(el);
};

const displayPopup = (type, msg) => {
	hidePopup();
	const markup = `<div class="popup popup--${type}">${msg}</div>`;
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
	window.setTimeout(hidePopup, 5000);
};
