const voteForm = document.getElementById('voteForm');
const statisticsList = document.getElementById('statisticsList');

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

// Load variants for voting
const loadVariants = async () => {
	try {
		const response = await fetch('/variants');
		const { status, data } = await response.json();

		if (status === 'success') {
			voteForm.innerHTML = '';

			data.data.forEach(({ code, option }) => {
				const variantHTML = `
					<div>
						<input type="radio" id="${code}" name="code" value="${code}">
						<label for="${code}">${option}</label>
					</div>`;
				voteForm.insertAdjacentHTML('beforeend', variantHTML);
			});

			voteForm.insertAdjacentHTML(
				'beforeend',
				'<button type="submit">Submit Vote</button>',
			);
		} else {
			console.error('Failed to load variants');
			displayPopup('error', 'Failed to load variants');
		}
	} catch (error) {
		console.error('Error loading variants:', error);
		displayPopup('error', 'Failed to load variants');
	}
};

// Handle voting form submission
const handleVoteSubmit = async (event) => {
	event.preventDefault();

	const selectedCode = document.querySelector(
		'input[name="code"]:checked',
	)?.value;
	if (!selectedCode) {
		return displayPopup('error', 'Please Choose a Language to Vote!😉');
	}

	try {
		const response = await fetch('/vote', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ code: selectedCode }),
		});
		const { status, message } = await response.json();

		displayPopup(status, message);
		if (status === 'success') {
			setTimeout(() => (window.location.href = '/statistics'), 3000);
		}
	} catch (error) {
		console.error('Error:', error);
		displayPopup('error', 'Something Went Wrong!💥 Please Try Again Later!');
	}
};

// Load statistics
const loadStatistics = async () => {
	try {
		const response = await fetch('/stat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});
		const { status, data } = await response.json();

		if (status === 'success') {
			statisticsList.innerHTML = '';
			data.data.forEach(({ option, votes }) => {
				const listItemHTML = `<li>${option}: ${votes} votes</li>`;
				statisticsList.insertAdjacentHTML('beforeend', listItemHTML);
			});
		} else {
			console.error('Failed to load statistics');
			displayPopup('error', 'Failed to load statistics');
		}
	} catch (error) {
		console.error('Error loading statistics:', error);
		displayPopup('error', 'Something Went Wrong!💥 Please Try Again Later!');
	}
};

// Initialize Event Listeners
if (voteForm) {
	document.addEventListener('DOMContentLoaded', loadVariants);
	voteForm.addEventListener('submit', handleVoteSubmit);
}

if (statisticsList) {
	document.addEventListener('DOMContentLoaded', loadStatistics);
}
