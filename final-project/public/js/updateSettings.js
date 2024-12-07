/* eslint-disable */
import { displayAlert } from './alert';

export const updateSettings = async (data, type) => {
	try {
		const dataType =
			type.trim().toLowerCase().charAt(0).toUpperCase() + type.slice(1);
		const url = `/api/v1/users/${
			dataType === 'Password' ? 'updateMyPassword' : 'updateMe'
		}`;

		if (dataType !== 'Password' && dataType !== 'Data') {
			return displayAlert('error', 'Invalid type provided!');
		}

		const res = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const responseData = await res.json();

		if (res.ok && responseData.status === 'success') {
			displayAlert('success', `${dataType} updated successfully!`);
			// location.reload(true);
		} else {
			throw new Error(responseData.message || 'Error updating data!');
		}
	} catch (err) {
		displayAlert('error', err.message);
	}
};
