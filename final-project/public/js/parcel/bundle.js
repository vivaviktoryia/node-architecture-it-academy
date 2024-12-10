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
            (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('success', 'Logged in successfully!');
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
        if (res.ok && data.status === 'success') window.setTimeout(()=>{
            location.assign('/');
        }, 1500);
        else throw new Error('Error during logout');
    } catch (err) {
        console.log(err);
        (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', 'Error Logged Out! Try Again!');
    }
};


/* eslint-disable */ 
const $936fcc27ffb6bbb1$export$f558026a994b6051 = async (data, type)=>{
    try {
        const dataType = type.trim().toLowerCase().charAt(0).toUpperCase() + type.slice(1);
        const url = `/api/v1/users/${dataType === 'Password' ? 'updateMyPassword' : 'updateMe'}`;
        if (dataType !== 'Password' && dataType !== 'Data') return (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', 'Invalid type provided!');
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await res.json();
        if (res.ok && responseData.status === 'success') (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('success', `${dataType} updated successfully!`);
        else throw new Error(responseData.message || 'Error updating data!');
    } catch (err) {
        (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', err.message);
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
            new mapboxgl.Marker({
                element: el,
                anchor: 'bottom'
            }).setLngLat(coordinates).addTo(map);
            // Add popup
            new mapboxgl.Popup({
                offset: 30
            }).setLngLat(coordinates).setHTML(`<p>Day ${dayNumber}: ${loc.description}  </p>`).addTo(map);
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




const $c7a0accfc35e5a18$export$c75d4cf74fa48403 = (tours)=>{
    const cardContainer = document.querySelector('.card-container');
    tours.forEach((tour)=>{
        const tourElement = document.createElement('div');
        tourElement.classList.add('card');
        tourElement.innerHTML = `
            <div class="card__header">
                <div class="card__picture">
                    <div class="card__picture-overlay">&nbsp;</div>
                    <img class="card__picture-img" src="/img/tours/${tour.imageCover || 'default-cover.jpg'}" alt="${tour.name}" />
                </div>
                <h3 class="heading-tertirary">
                    <span>${tour.name}</span>
                </h3>
            </div>

            <div class="card__details">
                <h4 class="card__sub-heading">${tour.difficulty} ${tour.duration}-day tour</h4>
                <p class="card__text">${tour.summary}</p>
                <div class="card__data">
                    <svg class="card__icon">
                        <use xlink:href="/img/icons.svg#icon-map-pin"></use>
                    </svg>
                    <span>${tour.locations && tour.locations[0] ? tour.locations[0].description : 'No location available'}</span>
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
            </div>

            <div class="card__footer">
                <p>
                    <span class="card__footer-value">$${tour.price}</span> 
                    <span class="card__footer-text"> per person</span>
                </p>
                <p class="card__ratings">
                    <span class="card__footer-value">${tour.ratingsAverage}</span> 
                    <span class="card__footer-text">rating (${tour.ratingsQuantity})</span>
                </p>
                <a class="btn btn--green btn--small" href="/tour/${tour.slug}">Details</a>
            </div>
        `;
        cardContainer.appendChild(tourElement);
    });
};


const $7298424caa41a876$export$11765089634545e1 = async ()=>{
    try {
        const response = await fetch('/api/v1/tours');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const responseData = await response.json();
        (0, $c7a0accfc35e5a18$export$c75d4cf74fa48403)(responseData.data);
    } catch (error) {
        (0, $c67cb762f0198593$export$5e5cfdaa6ca4292c)('error', error.message);
    }
};


const $d0f7ce18c37ad6f6$var$mapBox = document.getElementById('map');
const $d0f7ce18c37ad6f6$var$loginForm = document.querySelector('.form--login');
const $d0f7ce18c37ad6f6$var$signupForm = document.querySelector('.form--signup');
const $d0f7ce18c37ad6f6$var$logOutBtn = document.querySelector('.nav__el--logout');
const $d0f7ce18c37ad6f6$var$userDataForm = document.querySelector('.form-user-data');
const $d0f7ce18c37ad6f6$var$passwordForm = document.querySelector('.form-user-password');
const $d0f7ce18c37ad6f6$var$savePasswordBtn = document.querySelector('.btn--save-password');
const $d0f7ce18c37ad6f6$var$bookBtn = document.getElementById('book-tour');
const $d0f7ce18c37ad6f6$var$toursContainer = document.querySelector('.card-container');
if ($d0f7ce18c37ad6f6$var$mapBox) {
    const locations = JSON.parse($d0f7ce18c37ad6f6$var$mapBox.dataset.locations);
    (0, $f60945d37f8e594c$export$4c5dd147b21b9176)(locations);
}
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
if ($d0f7ce18c37ad6f6$var$userDataForm) $d0f7ce18c37ad6f6$var$userDataForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    (0, $936fcc27ffb6bbb1$export$f558026a994b6051)({
        name: name,
        email: email
    }, 'data');
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
if ($d0f7ce18c37ad6f6$var$toursContainer) (0, $7298424caa41a876$export$11765089634545e1)();


//# sourceMappingURL=bundle.js.map
