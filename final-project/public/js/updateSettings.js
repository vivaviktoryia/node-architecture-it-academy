/* eslint-disable */
import { displayAlert } from './alert';

export const updateSettings = async (data, type) => {
	try {
		const dataType =
			type.trim().toLowerCase().charAt(0).toUpperCase() + type.slice(1);
		if (!['Data', 'Password'].includes(dataType)) {
			throw new Error('Invalid type was provided!');
		}
		const url = `/api/v1/users/${
			dataType === 'Password' ? 'updateMyPassword' : 'updateMe'
		}`;

		const res = await fetch(url, {
			method: 'PATCH',
			body: data,
		});

		const responseData = await res.json();

		if (res.ok && responseData.status === 'success') {
			displayAlert('success', `${dataType} updated successfully!`);
			location.reload(true);
		} else {
			throw new Error(responseData.message || 'Error updating data!');
		}
	} catch (error) {
		displayAlert('error', error.message);
	}
};
