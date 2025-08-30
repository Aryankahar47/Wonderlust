

  mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
        projection: 'globe', // display the map as a globe
        zoom: 8, // initial zoom level, 0 is the world view, higher values zoom in
        center: listing.geometry.coordinates, // center the map on this longitude and latitude
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });



     const marker1 = new mapboxgl.Marker({color: "red"})
        .setLngLat(listing.geometry.coordinates)  //listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25})
   
    .setHTML(`<h3>${listing.location}</h3>
      <p>Exact location </p>`))
        .addTo(map);