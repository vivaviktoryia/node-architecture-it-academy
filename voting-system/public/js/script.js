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

// Load variants for the voting page
async function loadVariants() {
	try {
		const response = await fetch('/variants');
		const result = await response.json();

		if (result.status === 'success') {
			const voteForm = document.getElementById('voteForm');
			voteForm.innerHTML = '';

			result.data.data.forEach((variant) => {
				const div = document.createElement('div');
				const input = document.createElement('input');
				input.type = 'radio';
				input.name = 'code';
				input.value = variant.code;
				input.id = variant.code;

				const label = document.createElement('label');
				label.htmlFor = variant.code;
				label.textContent = variant.option;

				div.appendChild(input);
				div.appendChild(label);
				voteForm.appendChild(div);
			});

			const submitButton = document.createElement('button');
			submitButton.type = 'submit';
			submitButton.textContent = 'Submit Vote';
			voteForm.appendChild(submitButton);
		} else {
			console.error('Failed to load variants');
		}
	} catch (error) {
		console.error('Error loading variants:', error);
	}
}

// Voting form submission handling
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
				setTimeout(() => (window.location.href = '/statistics'), 3000);
			}
		} catch (error) {
			displayPopup('error', 'Something Went Wrong!💥 Please Try Again Later!');
		}
	});

// Load statistics for the statistics page
async function loadStatistics() {
	try {
		const response = await fetch('/stat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await response.json();

		if (result.status === 'success') {
			const statisticsList = document.getElementById('statisticsList');
			statisticsList.innerHTML = '';

			result.data.data.forEach((stat) => {
				const listItem = document.createElement('li');
				listItem.textContent = `${stat.option}: ${stat.votes} votes`;
				statisticsList.appendChild(listItem);
			});
		} else {
			console.error('Failed to load statistics');
		}
	} catch (error) {
		console.error('Error loading statistics:', error);
	}
}

// Only load the variants on the voting page
if (document.getElementById('voteForm')) {
	document.addEventListener('DOMContentLoaded', loadVariants);
}

// Only load the statistics on the statistics page
if (document.getElementById('statisticsList')) {
	document.addEventListener('DOMContentLoaded', loadStatistics);
}
