import { displayMap } from './mapbox';

export const renderTourDetails = (tour) => {
	// SECTION HEADER
	renderTourHeader(tour);

	// SECTION DESCRIPTION
	renderTourDescription(tour);

	// SECTION PICTURES
	renderTourPictures(tour);

	// SECTION MAP
	renderTourMap(tour);

	// SECTION REVIEWS
	renderTourReviews(tour);

	// SECTION CTA
	renderTourCTA(tour);
};

function renderTourHeader(tour) {
	document.getElementById('tour-image').src = `/img/tours/${
		tour.imageCover || 'default-cover.jpg'
	}`;
	document.getElementById('tour-name').textContent = tour.name;
	document.getElementById(
		'tour-duration',
	).textContent = `${tour.duration}-days`;
	document.getElementById('tour-location').textContent =
		tour.locations && tour.locations[0]
			? tour.locations[0].description
			: 'No location available';
}

function renderTourDescription(tour) {
	document.getElementById('tour-description').innerHTML = tour.description;

	const date = new Date(tour.startDate).toLocaleString('en-us', {
		month: 'long',
		year: 'numeric',
	});
	const groupSize = `${tour.maxGroupSize} people`;
	const rating = `${tour.ratingsAverage} / 5`;

	const overviewData = [
		{ label: 'Next date', text: date, icon: 'calendar' },
		{ label: 'Difficulty', text: tour.difficulty, icon: 'trending-up' },
		{ label: 'Participants', text: groupSize, icon: 'user' },
		{ label: 'Rating', text: rating, icon: 'star' },
	];

	overviewData.forEach((item, index) => {
		document
			.querySelectorAll('.overview-box__detail')
			[index].querySelector('span.overview-box__text').textContent = item.text;
	});
}

function renderTourPictures(tour) {
	const images = tour.images || [];
	const imageElements = document.querySelectorAll('.picture-box__img');
	images.forEach((img, index) => {
		imageElements[index].src = `/img/tours/${
			img.fileName || `default-${index + 1}.jpg`
		}`;
		imageElements[index].alt = `${tour.name || 'Default Tour'} ${index + 1}`;
	});
}

function renderTourMap(tour) {
	if (
		tour.locations &&
		Array.isArray(tour.locations) &&
		tour.locations.length > 0
	) {
		displayMap(tour.locations);
	} else {
		console.error('tour.locations not ready, waiting...');
		const intervalId = setInterval(() => {
			if (
				tour.locations &&
				Array.isArray(tour.locations) &&
				tour.locations.length > 0
			) {
				console.log('tour.locations now available:', tour.locations);
				displayMap(tour.locations);
				clearInterval(intervalId);
			}
		}, 1000);
	}
}

function renderTourReviews(tour) {
	const reviewsContainer = document.getElementById('tour-reviews');
	reviewsContainer.innerHTML = '';
	tour.reviews.forEach((review) => {
		reviewsContainer.innerHTML += renderReviewCard(review);
	});
}

function renderTourCTA(tour) {
	const ctaText = document.getElementById('cta-text');
	if (ctaText) {
		ctaText.textContent = `${tour.duration} days. 1 adventure. Infinite memories. Make it yours today!`;
	}

	const ctaContent = document.querySelector('.cta__content');
	if (ctaContent) {
		const existingImages = ctaContent.querySelectorAll('img.cta__img');
		existingImages.forEach((img) => img.remove());

		const img1 = document.createElement('img');
		img1.classList.add('cta__img', 'cta__img--1');
		img1.src = `/img/tours/${
			tour.images[1] && tour.images[1].fileName
				? tour.images[1].fileName
				: 'default-2.jpg'
		}`;
		img1.alt = `${tour.name || 'Default Tour'} Image 1`;

		const img2 = document.createElement('img');
		img2.classList.add('cta__img', 'cta__img--2');
		img2.src = `/img/tours/${
			tour.images[0] && tour.images[0].fileName
				? tour.images[0].fileName
				: 'default-1.jpg'
		}`;
		img2.alt = `${tour.name || 'Default Tour'} Image 2`;

		ctaContent.appendChild(img1);
		ctaContent.appendChild(img2);
	}
}

function renderReviewCard(review) {
	return `
        <div class="reviews__card">
            <div class="reviews__avatar">
                <img class="reviews__avatar-img" src="/img/users/${
									review.user.photo || 'default.jpg'
								}" alt="${review.user.name}">
                <h6 class="reviews__user">${review.user.name}</h6>
            </div>
            <p class="reviews__text">${review.review}</p>
            <div class="reviews__rating">
                ${[1, 2, 3, 4, 5]
									.map((star) => {
										return `
                        <svg class="reviews__star reviews__star--${
													review.rating >= star ? 'active' : 'inactive'
												}">
                            <use xlink:href="/img/icons.svg#icon-star"></use>
                        </svg>
                    `;
									})
									.join('')}
            </div>
        </div>
    `;
}

// export function renderTourDetails(tour) {
// 	// SECTION HEADER
// 	document.getElementById('tour-image').src = `/img/tours/${
// 		tour.imageCover || 'default-cover.jpg'
// 	}`;
// 	document.getElementById('tour-name').textContent = tour.name;
// 	document.getElementById(
// 		'tour-duration',
// 	).textContent = `${tour.duration}-days`;
// 	document.getElementById('tour-location').textContent =
// 		tour.locations && tour.locations[0]
// 			? tour.locations[0].description
// 			: 'No location available';

// 	//  SECTION DESCRIPTION
// 	document.getElementById('tour-description').textContent = tour.description;

// 	const date = new Date(tour.startDate).toLocaleString('en-us', {
// 		month: 'long',
// 		year: 'numeric',
// 	});
// 	const groupSize = `${tour.maxGroupSize} people`;
// 	const rating = `${tour.ratingsAverage} / 5`;

// 	const overviewData = [
// 		{ label: 'Next date', text: date, icon: 'calendar' },
// 		{ label: 'Difficulty', text: tour.difficulty, icon: 'trending-up' },
// 		{ label: 'Participants', text: groupSize, icon: 'user' },
// 		{ label: 'Rating', text: rating, icon: 'star' },
// 	];

// 	overviewData.forEach((item, index) => {
// 		document
// 			.querySelectorAll('.overview-box__detail')
// 			[index].querySelector('span.overview-box__text').textContent = item.text;
// 	});

// 	//  SECTION PICTURES
// 	const images = tour.images || [];
// 	const imageElements = document.querySelectorAll('.picture-box__img');
// 	images.forEach((img, index) => {
// 		imageElements[index].src = `/img/tours/${
// 			img.fileName || `default-${index + 1}.jpg`
// 		}`;
// 		imageElements[index].alt = `${tour.name || 'Default Tour'} ${index + 1}`;
// 	});

// 	//  SECTION MAP
// 	if (
// 		tour.locations &&
// 		Array.isArray(tour.locations) &&
// 		tour.locations.length > 0
// 	) {
// 		displayMap(tour.locations);
// 	} else {
// 		console.error('tour.locations not ready, waiting...');
// 		const intervalId = setInterval(() => {
// 			if (
// 				tour.locations &&
// 				Array.isArray(tour.locations) &&
// 				tour.locations.length > 0
// 			) {
// 				console.log('tour.locations now available:', tour.locations);
// 				displayMap(tour.locations);
// 				clearInterval(intervalId);
// 			}
// 		}, 1000);
// 	}
// 	// const mapBox = document.getElementById('map');
// 	// mapBox.setAttribute('data-locations', JSON.stringify(tour.locations));

// 	//  SECTION REVIEWS
// 	const reviewsContainer = document.getElementById('tour-reviews');
// 	reviewsContainer.innerHTML = '';
// 	tour.reviews.forEach((review) => {
// 		reviewsContainer.innerHTML += renderReviewCard(review);
// 	});

// 	//  SECTION CTA
// 	const ctaText = document.getElementById('cta-text');
// 	if (ctaText) {
// 		ctaText.textContent = `${tour.duration} days. 1 adventure. Infinite memories. Make it yours today!`;
// 	}
// 	const ctaContent = document.querySelector('.cta__content');
// 	if (ctaContent) {
// 		const existingImages = ctaContent.querySelectorAll('img.cta__img');
// 		existingImages.forEach((img) => img.remove());

// 		const img1 = document.createElement('img');
// 		img1.classList.add('cta__img', 'cta__img--1');
// 		img1.src = `/img/tours/${
// 			tour.images[1] && tour.images[1].fileName
// 				? tour.images[1].fileName
// 				: 'default-2.jpg'
// 		}`;
// 		img1.alt = `${tour.name || 'Default Tour'} Image 1`;

// 		const img2 = document.createElement('img');
// 		img2.classList.add('cta__img', 'cta__img--2');
// 		img2.src = `/img/tours/${
// 			tour.images[0] && tour.images[0].fileName
// 				? tour.images[0].fileName
// 				: 'default-1.jpg'
// 		}`;
// 		img2.alt = `${tour.name || 'Default Tour'} Image 2`;

// 		ctaContent.appendChild(img1);
// 		ctaContent.appendChild(img2);
// 	}
// }
