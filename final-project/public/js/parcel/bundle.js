/* eslint-disable */ /* eslint-disable */ /*eslint-disable */ const $c67cb762f0198593$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};
const $c67cb762f0198593$export$5e5cfdaa6ca4292c = (type, msg)=>{
    $c67cb762f0198593$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout($c67cb762f0198593$export$516836c6a9dfc573, 5000);
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


/*eslint-disable */ const $f60945d37f8e594c$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = 'pk.eyJ1Ijoidml2YXZpa3RvcnlpYSIsImEiOiJjbHo4ZXczZ2cwMDUwMmtzYTByNmVqenJwIn0.Dl-Sgygd-puOem9UETCBjg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/navigation-day-v1',
        scrollZoom: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc)=>{
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';
        // add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);
        // add popup
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}  </p>`).addTo(map);
        // extend map bounds to include current location
        bounds.extend(loc.coordinates);
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


const $d0f7ce18c37ad6f6$var$mapBox = document.getElementById('map');
const $d0f7ce18c37ad6f6$var$loginForm = document.querySelector('.form--login');
const $d0f7ce18c37ad6f6$var$signupForm = document.querySelector('.form--signup');
const $d0f7ce18c37ad6f6$var$logOutBtn = document.querySelector('.nav__el--logout');
const $d0f7ce18c37ad6f6$var$userDataForm = document.querySelector('.form-user-data');
const $d0f7ce18c37ad6f6$var$passwordForm = document.querySelector('.form-user-password');
const $d0f7ce18c37ad6f6$var$savePasswordBtn = document.querySelector('.btn--save-password');
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


//# sourceMappingURL=bundle.js.map
