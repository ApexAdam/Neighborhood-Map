var map;
var CLIENT_ID;
var CLIENT_SECRET;
var locations = [
    {title: "Naam Thai", location: {lat: 52.2305266, lng: 21.0609601}, venueID: "5219002711d29ec039fe3dc4" },
    {title: "Trattoria Rucola", location: {lat: 52.2322225, lng: 21.0557555}, venueID: "4c2890d99fb5d13aa9b09957"},
    {title: "Renesans", location: {lat: 52.2353773, lng: 21.053194}, venueID: "4ba4d321f964a52065b838e3"},
    {title: "Efes Kebab", location: {lat: 52.2313592, lng: 21.0550328}, venueID: "4b6a7debf964a520bdd62be3"},
    {title: "Pikanteria", location: {lat: 52.2364695, lng: 21.0635283}, venueID: "4bfd5530b68d0f47239ce857"}
];


var ViewModel = function () {
    var self = this;

    this.locationsList = ko.observableArray([]);
    this.filterInput = ko.observable("");
    this.visible = ko.observable(true);

    CLIENT_ID='2KCT3BRAWRFBGOHY3VUH3NPE0DYUTCMVAOZIJ1LXAMTNVQIR';
    CLIENT_SECRET='1DXYJ0DVIGWKQMZVKRJWI0GBJMJN21C5CYLYPFPCD4QQ3QK1';

    map = new google.maps.Map(document.getElementById('map'),{
        center: {lat: 52.2299052, lng: 21.0509418},
        zoom: 14
    });

    locations.forEach(function (locationItem) {
        self.locationsList.push(new Location(locationItem));
    });

    this.filteredList = ko.computed(function () {
           var filterText = self.filterInput().toLowerCase();
           if(!filterText){
               self.locationsList().forEach(function (location) {
                   location.visible(true);
               });
               return self.locationsList();
           }else{
                return ko.utils.arrayFilter(self.locationsList(), function (location) {
                    var name = location.locationName.toLowerCase();
                    var result = (name.search(filterText) >= 0);
                    location.visible(result);
                    return result;
                })
       }
    })




};

var Location = function (data) {
    var self = this;

    this.locationName = data.title;
    this.infowindow = new google.maps.InfoWindow();
    this.visible = ko.observable(true);
    this.address = "";
    this.phone = "";
    this.URL = "";

    var foursquareLink = 'https://api.foursquare.com/v2/venues/' + data.venueID + '?oauth_token=VXWOS4YBG121YPFHG22WXHQXNGWM5YR1N2KRTBLIKAETBWLT&v=20170719';


    $.getJSON(foursquareLink).done(function (data) {
        var result = data.response;
        self.address = result.venue.location.address;
        self.phone = result.venue.contact.formattedPhone;
        self.URL = result.venue.url;

    });



        this.marker = new google.maps.Marker({
            map: map,
            position: data.location,
            title: data.title,
            animation: google.maps.Animation.DROP
        });
        this.marker.addListener('click', function () {
            if(self.infowindow !== self.marker) {
                self.infowindow.marker = self.marker;
                self.infowindow.setContent(
                    '<div>' + self.locationName + ' <br></div>' +
                    '<div>' + self.address + ' <br></div>' +
                    '<div>' + self.phone + ' <br></div>' +
                    '<div>' + self.URL + ' <br></div>');
                self.infowindow.open(map, this);
            }
        });

        this.showLocation = ko.computed(function () {
            if(this.visible() === true){
                this.marker.setMap(map);
            }else{
                this.marker.setMap(null);
            }
           return true;
            
        }, this);

    this.focusOnMarker = function (marker) {
        google.maps.event.trigger(self.marker, 'click');
    }
};

function runApp() {
    ko.applyBindings(new ViewModel());
}

$('#toggleButton').toggle(
    function () {
    $('#map').css('left', '0')
}, function () {
        $('#map').css('left', '280')
    })