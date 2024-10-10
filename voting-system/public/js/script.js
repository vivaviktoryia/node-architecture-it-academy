const voteForm = document.getElementById('voteForm');
const statisticsList = document.getElementById('statisticsList');
const jsonBtn = document.getElementById('jsonBtn');
const xmlBtn = document.getElementById('xmlBtn');
const htmlBtn = document.getElementById('htmlBtn');

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

// Load variants for voting - use GET '/api/v1/variants'
const loadVariants = async () => {
	try {
		const response = await fetch('/api/v1/variants');
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

// Handle voting form submission - use POST '/api/v1/vote'
const handleVoteSubmit = async (event) => {
	event.preventDefault();

	const selectedCode = document.querySelector(
		'input[name="code"]:checked',
	)?.value;
	if (!selectedCode) {
		return displayPopup('error', 'Please Choose a Language to Vote!😉');
	}

	try {
		const response = await fetch('/api/v1/vote', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ code: selectedCode }),
		});
		const { status, message, data } = await response.json();

		displayPopup(status, message);
		if (status === 'success') {
			setTimeout(
				() =>
					(window.location.href = `/results?votedOption=${data.votedData.option}`),
				3000,
			);
		}
	} catch (error) {
		console.error('Error:', error);
		displayPopup('error', 'Something Went Wrong!💥 Please Try Again Later!');
	}
};

// Load statistics - use POST '/api/v1/stat'
// const loadStatistics = async () => {
// 	try {
// 		const response = await fetch('/api/v1/stat', {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 		});
// 		const { status, data } = await response.json();

// 		if (status === 'success') {
// 			statisticsList.innerHTML = '';
// 			data.data.forEach(({ option, votes }) => {
// 				const listItemHTML = `<li>${option}: ${votes} votes</li>`;
// 				statisticsList.insertAdjacentHTML('beforeend', listItemHTML);
// 			});
// 		} else {
// 			console.error('Failed to load statistics');
// 			displayPopup('error', 'Failed to load statistics');
// 		}
// 	} catch (error) {
// 		console.error('Error loading statistics:', error);
// 		displayPopup('error', 'Something Went Wrong!💥 Please Try Again Later!');
// 	}
// };

// Fetch results in JSON format
const fetchJSONResults = async () => {
	try {
		const response = await fetch('/api/v1/stat', {
			method: 'POST',
			headers: { Accept: 'application/json' },
		});

		const { status, data } = await response.json();
		if (status === 'success') {
			displayPopup('success', 'Check console for JSON results.');
			console.log(data);
		} else {
			console.error('Failed to load statistics');
			displayPopup('error', 'Failed to load statistics');
		}
	} catch (error) {
		console.error('Error loading statistics:', error);
		displayPopup('error', 'Something Went Wrong!💥 Please Try Again Later!');
	}
};

// Fetch results in XML format
const fetchXMLResults = async () => {
	try {
		const response = await fetch('/api/v1/stat', {
			method: 'POST',
			headers: { Accept: 'application/xml' },
		});
		const textResponse = await response.text();
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(textResponse, 'application/xml');
		console.log(xmlDoc);
		displayPopup('success', 'Check console for XML results.');
	} catch (error) {
		console.error('Error fetching XML results:', error);
		displayPopup('error', 'Failed to fetch XML results!');
	}
};

// Fetch results in HTML format
const fetchHTMLResults = async () => {
	try {
		const response = await fetch('/api/v1/stat', {
			method: 'POST',
			headers: { Accept: 'text/html' },
		});
		const htmlResponse = await response.text();

		statisticsList.innerHTML = '';

		statisticsList.insertAdjacentHTML('beforeend', htmlResponse);
		displayPopup('success', 'HTML results added to the list.');
	} catch (error) {
		console.error('Error fetching HTML results:', error);
		displayPopup('error', 'Failed to fetch HTML results!');
	}
};

// Function to trigger download of results in JSON format
const downloadJSONResults = async () => {
	try {
		const response = await fetch('/api/v1/stat', {
			method: 'POST',
			headers: { Accept: 'application/json' },
		});
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = 'statistics.json';
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		displayPopup('success', 'Downloading JSON results...');
	} catch (error) {
		console.error('Error downloading JSON results:', error);
		displayPopup('error', 'Failed to download JSON results!');
	}
};

// Function to trigger download of results in XML format
const downloadXMLResults = async () => {
	try {
		const response = await fetch('/api/v1/stat', {
			method: 'POST',
			headers: { Accept: 'application/xml' },
		});
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = 'statistics.xml';
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		displayPopup('success', 'Downloading XML results...');
	} catch (error) {
		console.error('Error downloading XML results:', error);
		displayPopup('error', 'Failed to download XML results!');
	}
};


// Initialize Event Listeners
if (voteForm) {
	document.addEventListener('DOMContentLoaded', loadVariants);
	voteForm.addEventListener('submit', handleVoteSubmit);
}

// if (statisticsList) {
// 	document.addEventListener('DOMContentLoaded', loadStatistics);
// }

if (jsonBtn) jsonBtn.addEventListener('click', downloadJSONResults);
if (xmlBtn) xmlBtn.addEventListener('click', downloadXMLResults);
if (htmlBtn) htmlBtn.addEventListener('click', fetchHTMLResults);
