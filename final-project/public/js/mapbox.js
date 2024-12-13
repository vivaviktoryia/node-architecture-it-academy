/*eslint-disable */

const MAPBOX_ACCESS_TOKEN =
	'pk.eyJ1Ijoidml2YXZpa3RvcnlpYSIsImEiOiJjbHo4ZXczZ2cwMDUwMmtzYTByNmVqenJwIn0.Dl-Sgygd-puOem9UETCBjg';

export const displayMap = (locations) => {
	mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/navigation-day-v1',
		scrollZoom: false,
	});

	const bounds = new mapboxgl.LngLatBounds();

	locations.forEach((loc, index) => {
		const dayNumber = index + 1;
		// Extract coordinates if they're inside a GeoJSON Point object
		const coordinates =
			loc.coordinates && loc.coordinates.type === 'Point'
				? loc.coordinates.coordinates
				: loc.coordinates;

		if (coordinates && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
			// Create marker
			const el = document.createElement('div');
			el.className = 'marker';

			// Add marker
			const marker = new mapboxgl.Marker({
				element: el,
				anchor: 'bottom',
			})
				.setLngLat(coordinates)
				.addTo(map);

			// Add popup
			const popup = new mapboxgl.Popup({
				offset: 30,
			})
				.setLngLat(coordinates)
				.setHTML(`<p>Day ${dayNumber}: ${loc.description}</p>`);

			// Attach the popup to the marker
			marker.setPopup(popup);

			// Handle popup focus-related aria-hidden issue
			const closeButton = popup._closeButton;
			if (closeButton) {
				// Remove aria-hidden when focused
				closeButton.addEventListener('focus', () => {
					closeButton.setAttribute('aria-hidden', 'false');
				});

				// Reapply aria-hidden when focus is lost
				closeButton.addEventListener('blur', () => {
					closeButton.setAttribute('aria-hidden', 'true');
				});
			}

			bounds.extend(coordinates);
		} else {
			console.error('Invalid coordinates:', coordinates);
		}
	});

	map.fitBounds(bounds, {
		padding: {
			top: 200,
			bottom: 200,
			left: 100,
			right: 100,
		},
	});
};
