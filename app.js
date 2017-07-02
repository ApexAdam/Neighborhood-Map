var map;
var markers = [];
function initMap() {
    map = new google.maps.Map(document.getElementById('map'),{
        center: {lat: 52.2272052, lng: 21.0509418},
        zoom: 14
    });


    var locations = [
        {title: "Naam Thai", location: {lat: 52.2305266, lng: 21.0609601}}
    ];

    var infowindow = new google.maps.InfoWindow();

    for (var i = 0; i < locations.length; i++){
        var position = locations[i].location;
        var title = locations[i].title;

        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        markers.push(marker);
        marker.addListener('click', function () {
            populateInfoWindow(this, infowindow);
        });
    }

    function populateInfoWindow(marker, infoWindow) {
        // Chceck if infowindow is not already opened on this maker
        if(infoWindow.marker != marker){
            infoWindow.marker = marker;
            infoWindow.setContent('<div>' + marker.title + '</div>');
            infoWindow.open(map, marker);
            // Clear the property if closed
            infoWindow.addListener('closeclick', function () {
                infoWindow.setMarker(null);
            })
        }
    }
}