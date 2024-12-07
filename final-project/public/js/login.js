/* eslint-disable */
import { displayAlert } from './alert';

export const signup = async (name, email, password) => {
	try {
		const res = await fetch('/api/v1/users/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, email, password }),
		});

		const data = await res.json();

		if (res.ok && data.status === 'success') {
			displayAlert('success', 'Logged in successfully!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		} else {
			throw new Error(data.message);
		}
	} catch (err) {
		displayAlert('error', err.message);
	}
};

export const login = async (email, password) => {
	try {
		const res = await fetch('/api/v1/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await res.json();

		if (res.ok && data.status === 'success') {
			displayAlert('success', 'Logged in successfully!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		} else {
			throw new Error(data.message);
		}
	} catch (err) {
		displayAlert('error', err.message);
	}
};

export const logout = async () => {
	try {
		const res = await fetch('/api/v1/users/logout', {
			method: 'GET',
		});

		const data = await res.json();

		if (res.ok && data.status === 'success') {
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
			// location.reload(true);
		} else {
			throw new Error('Error during logout');
		}
	} catch (err) {
		console.log(err);
		displayAlert('error', 'Error Logged Out! Try Again!');
	}
};
