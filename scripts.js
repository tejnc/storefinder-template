mapboxgl.accessToken = 'pk.eyJ1IjoidGVqbmMiLCJhIjoiY2w0cDV0aDJtMDcxcDNjbnNvMXNkbzc5cSJ9.bTmQJ99FYl1DEfdqqtIlew';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [85.3279300, 27.687666],
    zoom: 14,
    scrollZoom: true
});

// const api_url = "http://0.0.0.0:8005/api/mapdata/get/";

// async function getData() {

//     // fetching data after making request call
//     const response = await fetch(api_url, {});

//     // parsing data to json format
//     const data = await response.json();
//     console.log(data);
// }
// getData()


const stores = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            85.327930096041,  //longitude
            27.687666388299   //latitude
          ]
        },
        "properties": {
          "phoneFormatted": "(977) 9823416855",
          "phone": "977982341685",
          "address": "Buddhanagar",
          "city": "Kathmandu",
          "country": "Nepal",
          "crossStreet": "at 19th St",
          "postalCode": "44600",
          "state": "Bagmati"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            85.32270515318186,
            27.685253281241227
          ]
        },
        "properties": {
          "phoneFormatted": "(977) 9823416855",
          "phone": "977982341685",
          "address": "UN Park Area",
          "city": "Kathmandu",
          "country": "Nepal",
          "crossStreet": "at 19th St",
          "postalCode": "44600",
          "state": "Bagmati"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            85.327930096041,
            27.687666388299
          ]
        },
        "properties": {
          "phoneFormatted": "(977) 9823416855",
          "phone": "977982341685",
          "address": "Buddhanagar",
          "city": "Kathmandu",
          "country": "Nepal",
          "crossStreet": "at 19th St",
          "postalCode": "44600",
          "state": "Bagmati"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            85.33083761070152,
            27.683856694966174
          ]
        },
        "properties": {
          "phoneFormatted": "(977) 9823416855",
          "phone": "977982341685",
          "address": "Shankamul",
          "city": "Kathmandu",
          "country": "Nepal",
          "crossStreet": "at 19th St",
          "postalCode": "44600",
          "state": "Bagmati"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            85.327930096041,
            27.687666388299
          ]
        },
        "properties": {
          "phoneFormatted": "(977) 9823416855",
          "phone": "977982341685",
          "address": "Buddhanagar",
          "city": "Kathmandu",
          "country": "Nepal",
          "crossStreet": "at 19th St",
          "postalCode": "44600",
          "state": "Bagmati"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            85.33813321908119,
            27.684882760101985
          ]
        },
        "properties": {
          "phoneFormatted": "(977) 9823416855",
          "phone": "977982341685",
          "address": "Minbhawan",
          "city": "Kathmandu",
          "country": "Nepal",
          "crossStreet": "at 19th St",
          "postalCode": "44600",
          "state": "Bagmati"
        }
      },
    ]
  };


stores.features.forEach(function (store, i) {
    store.properties.id = i;
  });

map.on('load', () => {
    /* Add the data to your map as a layer */
    // map.addLayer({
    //   id: 'locations',
    //   type: 'circle',
    //   /* Add a GeoJSON source containing place coordinates and information. */
    //   source: {
    //     type: 'geojson',
    //     data: stores
    //   }
    // });
    // map.on('click', (event) => {
    //     /* Determine if a feature in the "locations" layer exists at that point. */
    //     const features = map.queryRenderedFeatures(event.point, {
    //       layers: ['locations']
    //     });
      
    //     /* If it does not exist, return */
    //     if (!features.length) return;
      
    //     const clickedPoint = features[0];
      
    //     /* Fly to the point */
    //     flyToStore(clickedPoint);
      
    //     /* Close all other popups and display popup for clicked store */
    //     createPopUp(clickedPoint);
      
    //     /* Highlight listing in sidebar (and remove highlight for all other listings) */
    //     const activeItem = document.getElementsByClassName('active');
    //     if (activeItem[0]) {
    //       activeItem[0].classList.remove('active');
    //     }
    //     const listing = document.getElementById(
    //       `listing-${clickedPoint.properties.id}`
    //     );
    //     listing.classList.add('active');
    //   });

    map.addSource('places', {
        type: 'geojson',
        data: stores
    });
    
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: true, // Use the geocoder's default marker style
        bbox: [79.200439, 22.187405, 89.582520, 31.700130] // Set the bounding box coordinates
    });

    map.addControl(geocoder, 'top-left');
    addMarkers();
    buildLocationList(stores)

    geocoder.on('result', (event) => {
        const searchResult = event.result.geometry;
        const options = { units: 'miles' };
    for (const store of stores.features) {
    store.properties.distance = turf.distance(
        searchResult,
        store.geometry,
        options
    );
    }
    stores.features.sort((a, b) => {
        if (a.properties.distance > b.properties.distance) {
          return 1;
        }
        if (a.properties.distance < b.properties.distance) {
          return -1;
        }
        return 0; // a must be equal to b
      });
      const listings = document.getElementById('listings');
    while (listings.firstChild) {
    listings.removeChild(listings.firstChild);
    }
    buildLocationList(stores);
    const activeListing = document.getElementById(
        `listing-${stores.features[0].properties.id}`
    );
    activeListing.classList.add('active');

    const bbox = getBbox(stores, 0, searchResult);
    map.fitBounds(bbox, {
    padding: 100
    });

    createPopUp(stores.features[0]);
    });
});

function buildLocationList(stores) {
for (const store of stores.features) {
    /* Add a new listing section to the sidebar. */
    const listings = document.getElementById('listings');
    const listing = listings.appendChild(document.createElement('div'));
    /* Assign a unique `id` to the listing. */
    listing.id = `listing-${store.properties.id}`;
    /* Assign the `item` class to each listing for styling. */
    listing.className = 'item';

    /* Add the link to the individual listing created above. */
    const link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.id = `link-${store.properties.id}`;
    link.innerHTML = `${store.properties.address}`;

    /* Add details to the individual listing. */
    const details = listing.appendChild(document.createElement('div'));
    details.innerHTML = `${store.properties.city}`;
    if (store.properties.phone) {
    details.innerHTML += ` · ${store.properties.phoneFormatted}`;
    }
    if (store.properties.distance) {
    const roundedDistance = Math.round(store.properties.distance * 100) / 100;
    details.innerHTML += `<div><strong>${roundedDistance} miles away</strong></div>`;
    }

    // Adding event listener
    link.addEventListener('click', function () {
        for (const feature of stores.features) {
          if (this.id === `link-${feature.properties.id}`) {
            flyToStore(feature);
            createPopUp(feature);
          }
        }
        const activeItem = document.getElementsByClassName('active');
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        this.parentNode.classList.add('active');
      });
}
}

// for interactivity

function flyToStore(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15
    });
    }
  
function createPopUp(currentFeature) {
const popUps = document.getElementsByClassName('mapboxgl-popup');
/** Check if there is already a popup on the map and if so, remove it */
if (popUps[0]) popUps[0].remove();

const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(`<h3>Cagtu</h3><h4>${currentFeature.properties.address}</h4>`)
    .addTo(map);
  }




// Adding marker

function addMarkers() {
    /* For each feature in the GeoJSON object above: */
    for (const marker of stores.features) {
        /* Create a div element for the marker. */
        const el = document.createElement('div');
        /* Assign a unique `id` to the marker. */
        el.id = `marker-${marker.properties.id}`;
        /* Assign the `marker` class to each marker for styling. */
        el.className = 'marker';

        /**
         * Create a marker using the div element
         * defined above and add it to the map.
         **/
        new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

        /*adding event listener for marker*/
        el.addEventListener('click', (e) => {
            /* Fly to the point */
            flyToStore(marker);
            /* Close all other popups and display popup for clicked store */
            createPopUp(marker);
            /* Highlight listing in sidebar */
            const activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            const listing = document.getElementById(`listing-${marker.properties.id}`);
            listing.classList.add('active');
          });
    }
}


function getBbox(sortedStores, storeIdentifier, searchResult) {
const lats = [
    sortedStores.features[storeIdentifier].geometry.coordinates[1],
    searchResult.coordinates[1]
];
const lons = [
    sortedStores.features[storeIdentifier].geometry.coordinates[0],
    searchResult.coordinates[0]
];
const sortedLons = lons.sort((a, b) => {
    if (a > b) {
    return 1;
    }
    if (a.distance < b.distance) {
    return -1;
    }
    return 0;
});
const sortedLats = lats.sort((a, b) => {
    if (a > b) {
    return 1;
    }
    if (a.distance < b.distance) {
    return -1;
    }
    return 0;
});
return [
    [sortedLons[0], sortedLats[0]],
    [sortedLons[1], sortedLats[1]]
];
}
