/* eslint-disable */
import { displayAlert } from './alert';

export const bookTour = async () => {
	try {
		const response = await fetch('/api/v1/bookings', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});

		const responseData = await response.json();

		if (response.ok && responseData.status === 'success') {
			displayAlert('success', 'Booking is successful!');
			setTimeout(() => location.assign('/'), 1500);
		} else if (response.status === 409) {
			throw new Error('No spots available for booking at the moment!');
		} else {
			throw new Error(responseData.message || 'Booking failed');
		}
	} catch (error) {
		console.error('Error during booking:', error);

		displayAlert(
			'error',
			error.message || 'Something went wrong, please try again.',
		);

		throw error;
	}
};
