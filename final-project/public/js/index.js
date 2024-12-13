/* eslint-disable */
import { signup, login, logout } from './login';
import { updateSettings } from './updateSettings';
import { addTour } from './addTour';
import { bookTour } from './bookTour';
import { fetchAllTours, fetchTourDataBySlug } from './fetchTours';
import { updatePluginOrder } from './updatePluginOrder';

//RENDER
import { renderAllTours } from './renderAllTours';
import { renderTourDetails } from './renderTourDetails';
import { displayMap } from './mapbox';
import { displayAlert } from './alert';
import { enableDragAndDrop } from './dragAndDrop';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const tourDataForm = document.querySelector('.form-add-tour-data');
const passwordForm = document.querySelector('.form-user-password');
const savePasswordBtn = document.querySelector('.btn--save-password');
const bookBtn = document.getElementById('book-tour');
const tourDetailsBtn = document.getElementById('tour-details');
const toursContainer = document.querySelector('.card-container');

if (loginForm) {
	loginForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		login(email, password);
		document.getElementById('email').value = '';
		document.getElementById('password').value = '';
	});
}

if (signupForm) {
	signupForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const name = document.getElementById('name').value;
		signup(name, email, password);
		document.getElementById('name').value = '';
		document.getElementById('email').value = '';
		document.getElementById('password').value = '';
	});
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (toursContainer) {
	fetchAllTours()
		.then((toursData) => renderAllTours(toursData))
		.catch((error) => displayAlert('error', error.message));
}

document.addEventListener('DOMContentLoaded', () => {
	const slug = document.body.dataset.slug;

	if (slug) {
		fetchTourDataBySlug(slug)
			.then((tourData) => renderTourDetails(tourData))
			.catch((error) => displayAlert('error', error.message));
	}
});

if (userDataForm) {
	userDataForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const formData = new FormData();
		const fields = {
			name: document.getElementById('name').value,
			email: document.getElementById('email').value,
			photo: document.getElementById('photo').files[0],
		};

		Object.entries(fields).forEach(([key, value]) =>
			formData.append(key, value),
		);

		updateSettings(formData, 'data');
	});
}

if (tourDataForm) {
	tourDataForm.addEventListener('submit', (event) => {
		event.preventDefault();

		const selectedImages = Array.from(
			document.getElementById('tourImages').selectedOptions,
		).map((option) => parseInt(option.value, 10));

		const selectedLocations = Array.from(
			document.getElementById('tourLocations').selectedOptions,
		).map((option) => parseInt(option.value, 10));

		const maxImages = 3;
		const minLocations = 2;

		if (selectedImages.length > maxImages) {
			alert(`Pls select only ${maxImages} images`);
			return;
		}

		if (selectedLocations.length < minLocations) {
			alert(`Pls select at least ${minLocations} locations.`);
			return;
		}

		const fields = {
			name: document.getElementById('tourName').value,
			duration: parseInt(document.getElementById('tourDuration').value, 10),
			maxGroupSize: parseInt(
				document.getElementById('tourGroupSize').value,
				10,
			),
			difficulty: document.getElementById('tourDifficulty').value,
			price: parseFloat(document.getElementById('tourPrice').value),
			priceDiscount: parseFloat(
				document.getElementById('tourPriceDiscount').value,
			),
			summary: document.getElementById('tourSummary').value,
			// description: document.getElementById('tourDescription').value,
			description: tinymce.get('tourDescription').getContent(),
			imageCover: 'default-cover.jpg',
			startDate: document.getElementById('tourStartDate').value,
			images: selectedImages.length === 3 ? selectedImages : [1, 2, 3],
			locations:
				selectedLocations.length === 3 ? selectedLocations : [11, 12, 13],
		};

		addTour(fields);
		tourDataForm.reset();
		document.getElementById('tourImages').selectedIndex = -1;
		document.getElementById('tourLocations').selectedIndex = -1;
	});
}

if (passwordForm) {
	passwordForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		savePasswordBtn.textContent = 'Updating...';
		const passwordCurrent = document.getElementById('password-current').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		await updateSettings(
			{ passwordCurrent, password, passwordConfirm },
			'password',
		);
		savePasswordBtn.textContent = 'Save password';
		document.getElementById('password-current').value = '';
		document.getElementById('password').value = '';
		document.getElementById('password-confirm').value = '';
	});
}

if (bookBtn) {
	bookBtn.addEventListener('click', async ({ currentTarget: button }) => {
		const setButtonState = (text) => (button.textContent = text);

		try {
			setButtonState('Processing...');
			await new Promise((resolve) => setTimeout(resolve, 3000));
			await bookTour();
		} catch (error) {
			console.error('Booking failed:', error);
		} finally {
			setButtonState('Book tour now!');
		}
	});
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) displayAlert('success', alertMessage, 10);

document.addEventListener('DOMContentLoaded', () => {
	const saveOrderBtn = document.querySelector('#saveOrder');
	if (saveOrderBtn) {
		enableDragAndDrop();
		saveOrderBtn.addEventListener('click', updatePluginOrder);
	}
});

// if (mapBox) {
// 	const locationsData = mapBox.dataset.locations;
// 	if (locationsData) {
// 		try {
// 			const locations = JSON.parse(locationsData);
// 			displayMap(locations);
// 		} catch (error) {
// 			console.error('Error parsing JSON data:', error);
// 		}
// 	} else {
// 		console.error('No locations data found.');
// 	}
// }
