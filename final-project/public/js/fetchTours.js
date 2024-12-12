export const fetchAllTours = async () => {
	const response = await fetch('/api/v1/tours');

	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}

	const responseData = await response.json();

	return responseData.data;
};

export const fetchTourDataBySlug = async (slug) => {
	const response = await fetch(`/api/v1/tours/slug/${slug}`);

	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}

	const responseData = await response.json();
	return responseData.data.tour;
};

export const fetchTourDataById = async (tourId) => {
	const response = await fetch(`/api/v1/tours/${tourId}`);

	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}

	const responseData = await response.json();
	return responseData.data.tour;
};
