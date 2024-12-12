/* eslint-disable */
import { signup, login, logout } from './login';
import { updateSettings } from './updateSettings';
import { displayMap } from './mapbox';
import { bookTour } from './bookTour';
import { displayAlert } from './alert';
import { fetchAllTours, fetchTourDataBySlug } from './fetchTours';
import { renderAllTours } from './renderAllTours';
import { renderTourDetails } from './renderTourDetails';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
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
