
var map;
var markers = []; // this should be probably somewhere in viewModel


var locations = [
    {title: "Naam Thai", location: {lat: 52.2305266, lng: 21.0609601}},
    {title: "Trattoria Rucola", location: {lat: 52.2322225, lng: 21.0557555}},
    {title: "National Stadium", location: {lat: 52.2394957, lng: 21.0457909}},
    {title: "Stairs by Vistula River", location: {lat: 52.2328449, lng: 21.040925}},
    {title: "Pikanteria", location: {lat: 52.2364695, lng: 21.0635283}}
];




var ViewModel = function () {
    var self = this;

    this.locationsList = ko.observableArray([]);

    map = new google.maps.Map(document.getElementById('map'),{
        center: {lat: 52.2299052, lng: 21.0509418},
        zoom: 14
    });

    locations.forEach(function (locationItem) {
        self.locationsList.push(new Location(locationItem));
    })
};

var Location = function (data) {
    this.locationName = data.title;
    this.infowindow = new google.maps.InfoWindow();

        this.marker = new google.maps.Marker({
            map: map,
            position: data.location,
            title: data.title,
            animation: google.maps.Animation.DROP
        });
        this.marker.addListener('click', function () {
            this.infowindow.setContent('<div>' + this.marker.title + '</div>');
            this.infowindow.open(map, this.marker);
        });



    function populateInfoWindow(marker, infoWindow) {
        // Chceck if infowindow is not already opened on this maker
        if(infoWindow.marker !== marker){
            infoWindow.marker = marker;
            infoWindow.setContent('<div>' + marker.title + '</div>');
            infoWindow.open(map, marker);
            // Clear the property if closed
            infoWindow.addListener('closeclick', function () {
                infoWindow.setMarker(null);
            })
        }
    }
};

function runApp() {
    ko.applyBindings(new ViewModel());
}
