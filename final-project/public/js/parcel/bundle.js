/* eslint-disable */ /* eslint-disable */ /*eslint-disable */ const $c67cb762f0198593$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};
const $c67cb762f0198593$export$5e5cfdaa6ca4292c = (type, msg, time = 7)=>{
    $c67cb762f0198593$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout($c67cb762f0198593$export$516836c6a9dfc573, time * 1000);
};


const $70af9284e599e604$export$7200a869094fec36 = async (name, email, password)=>{
    try {
        const res = await fetch('/api/v1/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
            (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('success', 'Logged in successfully!');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        } else throw new Error(data.message);
    } catch (err) {
        (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', err.message);
    }
};
const $70af9284e599e604$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await fetch('/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
            (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('success', "Logged In Successfully!\uD83D\uDE09");
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        } else throw new Error(data.message);
    } catch (err) {
        (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', err.message);
    }
};
const $70af9284e599e604$export$a0973bcfe11b05c9 = async ()=>{
    try {
        const res = await fetch('/api/v1/users/logout', {
            method: 'GET'
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
            (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('success', "Logged Out Successfully!\uD83D\uDC4B");
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        // location.reload(true);
        } else throw new Error('Error During Logout');
    } catch (err) {
        console.log(err);
        (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', 'Error Logged Out! Try Again!');
    }
};


/* eslint-disable */ 
const $936fcc27ffb6bbb1$export$f558026a994b6051 = async (data, type)=>{
    try {
        const dataType = type.trim().toLowerCase().charAt(0).toUpperCase() + type.slice(1);
        if (![
            'Data',
            'Password'
        ].includes(dataType)) throw new Error('Invalid type was provided!');
        const url = `/api/v1/users/${dataType === 'Password' ? 'updateMyPassword' : 'updateMe'}`;
        const res = await fetch(url, {
            method: 'PATCH',
            body: data
        });
        const responseData = await res.json();
        if (res.ok && responseData.status === 'success') {
            (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('success', `${dataType} updated successfully!`);
            location.reload(true);
        } else throw new Error(responseData.message || 'Error updating data!');
    } catch (error) {
        (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', error.message);
    }
};


/* eslint-disable */ 
const $c88b9e826f4b699d$export$a07e6cda5297cf4b = async (data)=>{
    try {
        const res = await fetch('/api/v1/tours', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await res.json();
        if (res.ok && responseData.status === 'success') (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('success', `Tour added successfully!`, 10);
        else throw new Error(responseData.message || 'Error updating data!');
    } catch (error) {
        (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', error.message);
    }
};


/*eslint-disable */ const $f60945d37f8e594c$var$MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoidml2YXZpa3RvcnlpYSIsImEiOiJjbHo4ZXczZ2cwMDUwMmtzYTByNmVqenJwIn0.Dl-Sgygd-puOem9UETCBjg';
const $f60945d37f8e594c$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = $f60945d37f8e594c$var$MAPBOX_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/navigation-day-v1',
        scrollZoom: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc, index)=>{
        const dayNumber = index + 1;
        // Extract coordinates if they're inside a GeoJSON Point object
        const coordinates = loc.coordinates && loc.coordinates.type === 'Point' ? loc.coordinates.coordinates : loc.coordinates;
        if (coordinates && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
            // Create marker
            const el = document.createElement('div');
            el.className = 'marker';
            // Add marker
            const marker = new mapboxgl.Marker({
                element: el,
                anchor: 'bottom'
            }).setLngLat(coordinates).addTo(map);
            // Add popup
            const popup = new mapboxgl.Popup({
                offset: 30
            }).setLngLat(coordinates).setHTML(`<p>Day ${dayNumber}: ${loc.description}</p>`);
            // Attach the popup to the marker
            marker.setPopup(popup);
            // Handle popup focus-related aria-hidden issue
            const closeButton = popup._closeButton;
            if (closeButton) {
                // Remove aria-hidden when focused
                closeButton.addEventListener('focus', ()=>{
                    closeButton.setAttribute('aria-hidden', 'false');
                });
                // Reapply aria-hidden when focus is lost
                closeButton.addEventListener('blur', ()=>{
                    closeButton.setAttribute('aria-hidden', 'true');
                });
            }
            bounds.extend(coordinates);
        } else console.error('Invalid coordinates:', coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 200,
            left: 100,
            right: 100
        }
    });
};


/* eslint-disable */ 
const $144e4d4c31c55431$export$8d5bdbf26681c0c2 = async ()=>{
    try {
        const response = await fetch('/api/v1/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseData = await response.json();
        if (response.ok && responseData.status === 'success') {
            (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('success', 'Booking is successful!');
            setTimeout(()=>location.assign('/'), 1500);
        } else if (response.status === 409) throw new Error("No spots available for booking at the moment!\uD83D\uDE43");
        else throw new Error(responseData.message || 'Booking failed');
    } catch (error) {
        console.error('Error during booking:', error);
        (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', error.message || 'Something went wrong, please try again.');
        throw error;
    }
};



const $7298424caa41a876$export$8d4bd62767c5e70c = async ()=>{
    const response = await fetch('/api/v1/tours');
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const responseData = await response.json();
    return responseData.data;
};
const $7298424caa41a876$export$8b533883f347e0c7 = async (slug)=>{
    const response = await fetch(`/api/v1/tours/slug/${slug}`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const responseData = await response.json();
    return responseData.data.tour;
};
const $7298424caa41a876$export$a12efcda0f81b035 = async (tourId)=>{
    const response = await fetch(`/api/v1/tours/${tourId}`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const responseData = await response.json();
    return responseData.data.tour;
};


const $ad6885a941318777$export$9829cf11df3bb7b9 = (tours)=>{
    const cardContainer = document.querySelector('.card-container');
    const existingCards = cardContainer.querySelectorAll('.card');
    // Clear card container if no existing cards
    if (existingCards.length === 0) cardContainer.innerHTML = '';
    tours.forEach((tour, index)=>{
        let cardElement;
        // Reuse existing cards or create new ones
        if (index < existingCards.length) cardElement = existingCards[index];
        else {
            cardElement = $ad6885a941318777$var$createCardElement();
            cardContainer.appendChild(cardElement);
        }
        // Fill card content
        $ad6885a941318777$var$fillCardContent(cardElement, tour);
    });
};
const $ad6885a941318777$var$createCardElement = ()=>{
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerHTML = `
    <div class="card__header"></div>
    <div class="card__details"></div>
    <div class="card__footer"></div>
  `;
    return cardElement;
};
const $ad6885a941318777$var$fillCardContent = (cardElement, tour)=>{
    const header = cardElement.querySelector('.card__header');
    const details = cardElement.querySelector('.card__details');
    const footer = cardElement.querySelector('.card__footer');
    // Fill header content
    $ad6885a941318777$var$fillCardHeader(header, tour);
    // Fill details content
    $ad6885a941318777$var$fillCardDetails(details, tour);
    // Fill footer content
    $ad6885a941318777$var$fillCardFooter(footer, tour);
};
const $ad6885a941318777$var$fillCardHeader = (header, tour)=>{
    header.innerHTML = `
    <div class="card__picture">
      <div class="card__picture-overlay">&nbsp;</div>
      <img class="card__picture-img" src="/img/tours/${tour.imageCover || 'default-cover.jpg'}" alt="${tour.name}" />
    </div>
    <h3 class="heading-tertirary">
      <span>${tour.name}</span>
    </h3>
  `;
};
const $ad6885a941318777$var$fillCardDetails = (details, tour)=>{
    details.innerHTML = `
    <h4 class="card__sub-heading">${tour.difficulty} ${tour.duration}-day tour</h4>
    <p class="card__text">${tour.summary}</p>
    <div class="card__data">
      <svg class="card__icon">
        <use xlink:href="/img/icons.svg#icon-map-pin"></use>
      </svg>
      <span>${tour.locations?.[0]?.description || 'No location available'}</span>
    </div>
    <div class="card__data">
      <svg class="card__icon">
        <use xlink:href="/img/icons.svg#icon-calendar"></use>
      </svg>
      <span>${new Date(tour.startDate).toLocaleString('en-us', {
        month: 'long',
        year: 'numeric'
    })}</span>
    </div>
    <div class="card__data">
      <svg class="card__icon">
        <use xlink:href="/img/icons.svg#icon-flag"></use>
      </svg>
      <span>${tour.locations.length} ${tour.locations.length === 1 ? 'stop' : 'stops'}</span>
    </div>
    <div class="card__data">
      <svg class="card__icon">
        <use xlink:href="/img/icons.svg#icon-user"></use>
      </svg>
      <span>${tour.maxGroupSize} people</span>
    </div>
  `;
};
const $ad6885a941318777$var$fillCardFooter = (footer, tour)=>{
    footer.innerHTML = `
    <p>
      <span class="card__footer-value">$${tour.price}</span>
      <span class="card__footer-text"> per person</span>
    </p>
    <p class="card__ratings">
      <span class="card__footer-value">${tour.ratingsAverage}</span>
      <span class="card__footer-text">rating (${tour.ratingsQuantity})</span>
    </p>
    <a class="btn btn--green btn--small" id="tour-details" href="/tour/${tour.slug}">Details</a>
  `;
}; // export const renderTours = (tours) => {
 // 	const cardContainer = document.querySelector('.card-container');
 // 	tours.forEach((tour) => {
 // 		const tourElement = document.createElement('div');
 // 		tourElement.classList.add('card');
 // 		tourElement.innerHTML = `
 //             <div class="card__header">
 //                 <div class="card__picture">
 //                     <div class="card__picture-overlay">&nbsp;</div>
 //                     <img class="card__picture-img" src="/img/tours/${
 // 											tour.imageCover || 'default-cover.jpg'
 // 										}" alt="${tour.name}" />
 //                 </div>
 //                 <h3 class="heading-tertirary">
 //                     <span>${tour.name}</span>
 //                 </h3>
 //             </div>
 //             <div class="card__details">
 //                 <h4 class="card__sub-heading">${tour.difficulty} ${
 // 			tour.duration
 // 		}-day tour</h4>
 //                 <p class="card__text">${tour.summary}</p>
 //                 <div class="card__data">
 //                     <svg class="card__icon">
 //                         <use xlink:href="/img/icons.svg#icon-map-pin"></use>
 //                     </svg>
 //                     <span>${
 // 											tour.locations && tour.locations[0]
 // 												? tour.locations[0].description
 // 												: 'No location available'
 // 										}</span>
 //                 </div>
 //                 <div class="card__data">
 //                     <svg class="card__icon">
 //                         <use xlink:href="/img/icons.svg#icon-calendar"></use>
 //                     </svg>
 //                     <span>${new Date(tour.startDate).toLocaleString('en-us', {
 // 											month: 'long',
 // 											year: 'numeric',
 // 										})}</span>
 //                 </div>
 //                 <div class="card__data">
 //                     <svg class="card__icon">
 //                         <use xlink:href="/img/icons.svg#icon-flag"></use>
 //                     </svg>
 //                     <span>${tour.locations.length} ${
 // 			tour.locations.length === 1 ? 'stop' : 'stops'
 // 		}</span>
 //                 </div>
 //                 <div class="card__data">
 //                     <svg class="card__icon">
 //                         <use xlink:href="/img/icons.svg#icon-user"></use>
 //                     </svg>
 //                     <span>${tour.maxGroupSize} people</span>
 //                 </div>
 //             </div>
 //             <div class="card__footer">
 //                 <p>
 //                     <span class="card__footer-value">$${tour.price}</span>
 //                     <span class="card__footer-text"> per person</span>
 //                 </p>
 //                 <p class="card__ratings">
 //                     <span class="card__footer-value">${
 // 											tour.ratingsAverage
 // 										}</span>
 //                     <span class="card__footer-text">rating (${
 // 											tour.ratingsQuantity
 // 										})</span>
 //                 </p>
 //                 <a class="btn btn--green btn--small" id="tour-details" href="/tour/${
 // 									tour.slug
 // 								}">Details</a>
 //             </div>
 //         `;
 // 		cardContainer.appendChild(tourElement);
 // 	});
 // };



const $3fa2a398896b9956$export$57685d4d62280076 = (tour)=>{
    // SECTION HEADER
    $3fa2a398896b9956$var$renderTourHeader(tour);
    // SECTION DESCRIPTION
    $3fa2a398896b9956$var$renderTourDescription(tour);
    // SECTION PICTURES
    $3fa2a398896b9956$var$renderTourPictures(tour);
    // SECTION MAP
    $3fa2a398896b9956$var$renderTourMap(tour);
    // SECTION REVIEWS
    $3fa2a398896b9956$var$renderTourReviews(tour);
    // SECTION CTA
    $3fa2a398896b9956$var$renderTourCTA(tour);
};
function $3fa2a398896b9956$var$renderTourHeader(tour) {
    document.getElementById('tour-image').src = `/img/tours/${tour.imageCover || 'default-cover.jpg'}`;
    document.getElementById('tour-name').textContent = tour.name;
    document.getElementById('tour-duration').textContent = `${tour.duration}-days`;
    document.getElementById('tour-location').textContent = tour.locations && tour.locations[0] ? tour.locations[0].description : 'No location available';
}
function $3fa2a398896b9956$var$renderTourDescription(tour) {
    document.getElementById('tour-description').innerHTML = tour.description;
    const date = new Date(tour.startDate).toLocaleString('en-us', {
        month: 'long',
        year: 'numeric'
    });
    const groupSize = `${tour.maxGroupSize} people`;
    const rating = `${tour.ratingsAverage} / 5`;
    const overviewData = [
        {
            label: 'Next date',
            text: date,
            icon: 'calendar'
        },
        {
            label: 'Difficulty',
            text: tour.difficulty,
            icon: 'trending-up'
        },
        {
            label: 'Participants',
            text: groupSize,
            icon: 'user'
        },
        {
            label: 'Rating',
            text: rating,
            icon: 'star'
        }
    ];
    overviewData.forEach((item, index)=>{
        document.querySelectorAll('.overview-box__detail')[index].querySelector('span.overview-box__text').textContent = item.text;
    });
}
function $3fa2a398896b9956$var$renderTourPictures(tour) {
    const images = tour.images || [];
    const imageElements = document.querySelectorAll('.picture-box__img');
    images.forEach((img, index)=>{
        imageElements[index].src = `/img/tours/${img.fileName || `default-${index + 1}.jpg`}`;
        imageElements[index].alt = `${tour.name || 'Default Tour'} ${index + 1}`;
    });
}
function $3fa2a398896b9956$var$renderTourMap(tour) {
    if (tour.locations && Array.isArray(tour.locations) && tour.locations.length > 0) (0, $f60945d37f8e594c$export$4c5dd147b21b9176)(tour.locations);
    else {
        console.error('tour.locations not ready, waiting...');
        const intervalId = setInterval(()=>{
            if (tour.locations && Array.isArray(tour.locations) && tour.locations.length > 0) {
                console.log('tour.locations now available:', tour.locations);
                (0, $f60945d37f8e594c$export$4c5dd147b21b9176)(tour.locations);
                clearInterval(intervalId);
            }
        }, 1000);
    }
}
function $3fa2a398896b9956$var$renderTourReviews(tour) {
    const reviewsContainer = document.getElementById('tour-reviews');
    reviewsContainer.innerHTML = '';
    tour.reviews.forEach((review)=>{
        reviewsContainer.innerHTML += $3fa2a398896b9956$var$renderReviewCard(review);
    });
}
function $3fa2a398896b9956$var$renderTourCTA(tour) {
    const ctaText = document.getElementById('cta-text');
    if (ctaText) ctaText.textContent = `${tour.duration} days. 1 adventure. Infinite memories. Make it yours today!`;
    const ctaContent = document.querySelector('.cta__content');
    if (ctaContent) {
        const existingImages = ctaContent.querySelectorAll('img.cta__img');
        existingImages.forEach((img)=>img.remove());
        const img1 = document.createElement('img');
        img1.classList.add('cta__img', 'cta__img--1');
        img1.src = `/img/tours/${tour.images[1] && tour.images[1].fileName ? tour.images[1].fileName : 'default-2.jpg'}`;
        img1.alt = `${tour.name || 'Default Tour'} Image 1`;
        const img2 = document.createElement('img');
        img2.classList.add('cta__img', 'cta__img--2');
        img2.src = `/img/tours/${tour.images[0] && tour.images[0].fileName ? tour.images[0].fileName : 'default-1.jpg'}`;
        img2.alt = `${tour.name || 'Default Tour'} Image 2`;
        ctaContent.appendChild(img1);
        ctaContent.appendChild(img2);
    }
}
function $3fa2a398896b9956$var$renderReviewCard(review) {
    return `
        <div class="reviews__card">
            <div class="reviews__avatar">
                <img class="reviews__avatar-img" src="/img/users/${review.user.photo || 'default.jpg'}" alt="${review.user.name}">
                <h6 class="reviews__user">${review.user.name}</h6>
            </div>
            <p class="reviews__text">${review.review}</p>
            <div class="reviews__rating">
                ${[
        1,
        2,
        3,
        4,
        5
    ].map((star)=>{
        return `
                        <svg class="reviews__star reviews__star--${review.rating >= star ? 'active' : 'inactive'}">
                            <use xlink:href="/img/icons.svg#icon-star"></use>
                        </svg>
                    `;
    }).join('')}
            </div>
        </div>
    `;
} // export function renderTourDetails(tour) {
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


const $d0f7ce18c37ad6f6$var$mapBox = document.getElementById('map');
const $d0f7ce18c37ad6f6$var$loginForm = document.querySelector('.form--login');
const $d0f7ce18c37ad6f6$var$signupForm = document.querySelector('.form--signup');
const $d0f7ce18c37ad6f6$var$logOutBtn = document.querySelector('.nav__el--logout');
const $d0f7ce18c37ad6f6$var$userDataForm = document.querySelector('.form-user-data');
const $d0f7ce18c37ad6f6$var$tourDataForm = document.querySelector('.form-add-tour-data');
const $d0f7ce18c37ad6f6$var$passwordForm = document.querySelector('.form-user-password');
const $d0f7ce18c37ad6f6$var$savePasswordBtn = document.querySelector('.btn--save-password');
const $d0f7ce18c37ad6f6$var$bookBtn = document.getElementById('book-tour');
const $d0f7ce18c37ad6f6$var$tourDetailsBtn = document.getElementById('tour-details');
const $d0f7ce18c37ad6f6$var$toursContainer = document.querySelector('.card-container');
if ($d0f7ce18c37ad6f6$var$loginForm) $d0f7ce18c37ad6f6$var$loginForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    (0, $70af9284e599e604$export$596d806903d1f59e)(email, password);
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
});
if ($d0f7ce18c37ad6f6$var$signupForm) $d0f7ce18c37ad6f6$var$signupForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    (0, $70af9284e599e604$export$7200a869094fec36)(name, email, password);
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
});
if ($d0f7ce18c37ad6f6$var$logOutBtn) $d0f7ce18c37ad6f6$var$logOutBtn.addEventListener('click', (0, $70af9284e599e604$export$a0973bcfe11b05c9));
if ($d0f7ce18c37ad6f6$var$toursContainer) (0, $7298424caa41a876$export$8d4bd62767c5e70c)().then((toursData)=>(0, $ad6885a941318777$export$9829cf11df3bb7b9)(toursData)).catch((error)=>(0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', error.message));
document.addEventListener('DOMContentLoaded', ()=>{
    const slug = document.body.dataset.slug;
    if (slug) (0, $7298424caa41a876$export$8b533883f347e0c7)(slug).then((tourData)=>(0, $3fa2a398896b9956$export$57685d4d62280076)(tourData)).catch((error)=>(0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', error.message));
});
if ($d0f7ce18c37ad6f6$var$userDataForm) $d0f7ce18c37ad6f6$var$userDataForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const formData = new FormData();
    const fields = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        photo: document.getElementById('photo').files[0]
    };
    Object.entries(fields).forEach(([key, value])=>formData.append(key, value));
    (0, $936fcc27ffb6bbb1$export$f558026a994b6051)(formData, 'data');
});
if ($d0f7ce18c37ad6f6$var$tourDataForm) $d0f7ce18c37ad6f6$var$tourDataForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const selectedImages = Array.from(document.getElementById('tourImages').selectedOptions).map((option)=>parseInt(option.value, 10));
    const selectedLocations = Array.from(document.getElementById('tourLocations').selectedOptions).map((option)=>parseInt(option.value, 10));
    const maxImages = 3;
    const minLocations = 2;
    if (selectedImages.length > maxImages) {
        alert(`Pls select only ${maxImages} images`);
        return;
    }
    if (selectedLocations.length < minLocations) {
        alert(`Pls select at least ${minLocations} locations.`);
        return;
    }
    const fields = {
        name: document.getElementById('tourName').value,
        duration: parseInt(document.getElementById('tourDuration').value, 10),
        maxGroupSize: parseInt(document.getElementById('tourGroupSize').value, 10),
        difficulty: document.getElementById('tourDifficulty').value,
        price: parseFloat(document.getElementById('tourPrice').value),
        priceDiscount: parseFloat(document.getElementById('tourPriceDiscount').value),
        summary: document.getElementById('tourSummary').value,
        // description: document.getElementById('tourDescription').value,
        description: tinymce.get('tourDescription').getContent(),
        imageCover: 'default-cover.jpg',
        startDate: document.getElementById('tourStartDate').value,
        images: selectedImages.length === 3 ? selectedImages : [
            1,
            2,
            3
        ],
        locations: selectedLocations.length === 3 ? selectedLocations : [
            11,
            12,
            13
        ]
    };
    (0, $c88b9e826f4b699d$export$a07e6cda5297cf4b)(fields);
    $d0f7ce18c37ad6f6$var$tourDataForm.reset();
    document.getElementById('tourImages').selectedIndex = -1;
    document.getElementById('tourLocations').selectedIndex = -1;
});
if ($d0f7ce18c37ad6f6$var$passwordForm) $d0f7ce18c37ad6f6$var$passwordForm.addEventListener('submit', async (event)=>{
    event.preventDefault();
    $d0f7ce18c37ad6f6$var$savePasswordBtn.textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await (0, $936fcc27ffb6bbb1$export$f558026a994b6051)({
        passwordCurrent: passwordCurrent,
        password: password,
        passwordConfirm: passwordConfirm
    }, 'password');
    $d0f7ce18c37ad6f6$var$savePasswordBtn.textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
});
if ($d0f7ce18c37ad6f6$var$bookBtn) $d0f7ce18c37ad6f6$var$bookBtn.addEventListener('click', async ({ currentTarget: button })=>{
    const setButtonState = (text)=>button.textContent = text;
    try {
        setButtonState('Processing...');
        await new Promise((resolve)=>setTimeout(resolve, 3000));
        await (0, $144e4d4c31c55431$export$8d5bdbf26681c0c2)();
    } catch (error) {
        console.error('Booking failed:', error);
    } finally{
        setButtonState('Book tour now!');
    }
});
const $d0f7ce18c37ad6f6$var$alertMessage = document.querySelector('body').dataset.alert;
if ($d0f7ce18c37ad6f6$var$alertMessage) (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('success', $d0f7ce18c37ad6f6$var$alertMessage, 10);
// if (mapBox) {
// 	const locationsData = mapBox.dataset.locations;
// 	if (locationsData) {
// 		try {
// 			const locations = JSON.parse(locationsData);
// 			displayMap(locations);
// 		} catch (error) {
// 			console.error('Error parsing JSON data:', error);
// 		}
// 	} else {
// 		console.error('No locations data found.');
// 	}
// }
document.addEventListener('DOMContentLoaded', ()=>{
    const pluginList = document.querySelector('.plugin-list');
    let draggedElement = null;
    pluginList.addEventListener('dragstart', (e)=>{
        if (e.target && e.target.matches('.plugin-item')) draggedElement = e.target;
    });
    pluginList.addEventListener('dragover', (e)=>{
        e.preventDefault();
        const target = e.target.closest('.plugin-item');
        if (target && target !== draggedElement) pluginList.insertBefore(draggedElement, target);
    });
    pluginList.addEventListener('dragend', ()=>{
        draggedElement = null;
    });
    document.querySelector('#saveOrder').addEventListener('click', async ()=>{
        const newOrder = [
            ...document.querySelectorAll('.plugin-item')
        ].map((item, index)=>({
                id: +item.dataset.id,
                order: index + 1
            }));
        console.log('Plugins order:', newOrder);
        try {
            const updatePromises = newOrder.map((plugin)=>fetch(`/api/v1/admin/plugins/${plugin.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        order: plugin.order
                    })
                }).then((response)=>{
                    if (!response.ok) throw new Error(`Failed to update plugin with ID: ${plugin.id}`);
                    return response.json();
                }));
            await Promise.all(updatePromises);
            (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('success', 'Plugins order saved successfully!');
        } catch (error) {
            console.error('Error saving plugin order:', error);
            (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', 'Failed to save plugin order.');
        }
    });
});


//# sourceMappingURL=bundle.js.map
