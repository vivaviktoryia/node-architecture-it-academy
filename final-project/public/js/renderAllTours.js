export const renderAllTours = (tours) => {
	const cardContainer = document.querySelector('.card-container');
	const existingCards = cardContainer.querySelectorAll('.card');

	// Clear card container if no existing cards
	if (existingCards.length === 0) {
		cardContainer.innerHTML = '';
	}

	tours.forEach((tour, index) => {
		let cardElement;

		// Reuse existing cards or create new ones
		if (index < existingCards.length) {
			cardElement = existingCards[index];
		} else {
			cardElement = createCardElement();
			cardContainer.appendChild(cardElement);
		}

		// Fill card content
		fillCardContent(cardElement, tour);
	});
};

const createCardElement = () => {
	const cardElement = document.createElement('div');
	cardElement.classList.add('card');
	cardElement.innerHTML = `
    <div class="card__header"></div>
    <div class="card__details"></div>
    <div class="card__footer"></div>
  `;
	return cardElement;
};

const fillCardContent = (cardElement, tour) => {
	const header = cardElement.querySelector('.card__header');
	const details = cardElement.querySelector('.card__details');
	const footer = cardElement.querySelector('.card__footer');

	// Fill header content
	fillCardHeader(header, tour);

	// Fill details content
	fillCardDetails(details, tour);

	// Fill footer content
	fillCardFooter(footer, tour);
};

const fillCardHeader = (header, tour) => {
	header.innerHTML = `
    <div class="card__picture">
      <div class="card__picture-overlay">&nbsp;</div>
      <img class="card__picture-img" src="/img/tours/${
				tour.imageCover || 'default-cover.jpg'
			}" alt="${tour.name}" />
    </div>
    <h3 class="heading-tertirary">
      <span>${tour.name}</span>
    </h3>
  `;
};

const fillCardDetails = (details, tour) => {
	details.innerHTML = `
    <h4 class="card__sub-heading">${tour.difficulty} ${
		tour.duration
	}-day tour</h4>
    <p class="card__text">${tour.summary}</p>
    <div class="card__data">
      <svg class="card__icon">
        <use xlink:href="/img/icons.svg#icon-map-pin"></use>
      </svg>
      <span>${
				tour.locations?.[0]?.description || 'No location available'
			}</span>
    </div>
    <div class="card__data">
      <svg class="card__icon">
        <use xlink:href="/img/icons.svg#icon-calendar"></use>
      </svg>
      <span>${new Date(tour.startDate).toLocaleString('en-us', {
				month: 'long',
				year: 'numeric',
			})}</span>
    </div>
    <div class="card__data">
      <svg class="card__icon">
        <use xlink:href="/img/icons.svg#icon-flag"></use>
      </svg>
      <span>${tour.locations.length} ${
		tour.locations.length === 1 ? 'stop' : 'stops'
	}</span>
    </div>
    <div class="card__data">
      <svg class="card__icon">
        <use xlink:href="/img/icons.svg#icon-user"></use>
      </svg>
      <span>${tour.maxGroupSize} people</span>
    </div>
  `;
};

const fillCardFooter = (footer, tour) => {
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
};

// export const renderTours = (tours) => {
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
