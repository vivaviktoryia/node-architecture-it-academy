import { displayAlert } from './alert';
import { renderTours } from './renderTours';

export const fetchAndRenderTours = async () => {
	try {
		const response = await fetch('/api/v1/tours');

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const responseData = await response.json();

		renderTours(responseData.data);
	} catch (error) {
		displayAlert('error', error.message);
	}
};
