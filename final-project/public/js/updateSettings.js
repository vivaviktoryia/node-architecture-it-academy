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

		const fetchOptions = {
			method: 'PATCH',
			headers: {},
		};

		if (dataType === 'Password') {
			fetchOptions.headers['Content-Type'] = 'application/json';
			fetchOptions.body = JSON.stringify(data);
		} else {
			fetchOptions.body = data; // FormData for `updateMe`
		}

		const res = await fetch(url, fetchOptions);
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
