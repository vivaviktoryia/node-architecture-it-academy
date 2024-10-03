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

document
	.getElementById('voteForm')
	?.addEventListener('submit', async (event) => {
		event.preventDefault();

		const code = document.querySelector('input[name="code"]:checked')?.value;
		if (!code)
			return displayPopup('error', 'Please Choose a Language to Vote!😉');

		try {
			const response = await fetch('/vote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code }),
			});

			const { status, message } = await response.json();
			displayPopup(status, message);

			if (status === 'success') {
				setTimeout(() => (window.location.href = '/statistics'), 1000);
			}
		} catch (error) {
			displayPopup('error', 'Something Went Wrong!💥 Please Try Again Later!');
		}
	});
