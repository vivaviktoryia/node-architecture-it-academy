/* eslint-disable */
import { displayAlert } from './alert';

export const addTour = async (data) => {
	try {
		const res = await fetch('/api/v1/tours', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const responseData = await res.json();

		if (res.ok && responseData.status === 'success') {
			displayAlert('success', `Tour added successfully!`, 10);
			// location.reload(true);
		} else {
			throw new Error(responseData.message || 'Error updating data!');
		}
	} catch (error) {
		displayAlert('error', error.message);
	}
};
