/*eslint-disable */

export  const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoidml2YXZpa3RvcnlpYSIsImEiOiJjbHo4ZXczZ2cwMDUwMmtzYTByNmVqenJwIn0.Dl-Sgygd-puOem9UETCBjg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/navigation-day-v1',
    scrollZoom: false,
    //   center: [-118.11349, 34.111745], // starting position [lng, lat]
    //   zoom: 5,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}  </p>`)
      .addTo(map);

    // extend map bounds to include current location
    bounds.extend(loc.coordinates);
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
