var map;

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
    this.filterInput = ko.observable("");
    this.visible = ko.observable(true);

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


        this.marker = new google.maps.Marker({
            map: map,
            position: data.location,
            title: data.title,
            animation: google.maps.Animation.DROP
        });
        this.marker.addListener('click', function () {
            if(self.infowindow !== self.marker) {
                self.infowindow.marker = self.marker;
                self.infowindow.setContent('<div>' + self.locationName + '</div>');
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
