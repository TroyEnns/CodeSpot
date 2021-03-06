$(function() {
  function initialize() {
    var currentWindow;
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 12,
      center: {lat: 37.7749, lng: -122.4194}
    });
    $.get('/places/data').done(placesObj =>
      placesObj.places.forEach(place => {
      var latLng = {lat: Number(place.lat), lng: Number(place.lng)};
      var title=place.name
      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        animation: google.maps.Animation.DROP,
        title: place.name,
        visible: true
      });
      var contentString =`<h3>${place.name}</h3><a href="/places/${place.id}">Read Reviews</a>`
      var infowindow = new google.maps.InfoWindow({
        position: latLng,
        content: contentString
      });
      map.addListener('click', () => {
        if (currentWindow) {
          currentWindow.close();
        }
      })
      marker.addListener('click', () => {
        if (currentWindow) {
          currentWindow.close();
        }
        infowindow.open(map, marker);
        currentWindow = infowindow;
      });
      marker.setMap(map);
    }));
  }
  initialize();
});
