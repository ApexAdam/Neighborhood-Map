var map;

var locations = [{
    title: "Naam Thai",
    location: {
        lat: 52.2274183,
        lng: 21.0623226
    },
    venueID: "5219002711d29ec039fe3dc4"
},
    {
        title: "Trattoria Rucola",
        location: {
            lat: 52.2322225,
            lng: 21.0557555
        },
        venueID: "4c2890d99fb5d13aa9b09957"
    },
    {
        title: "Akwarium",
        location: {
            lat: 52.236168,
            lng: 21.054287
        },
        venueID: "4db70bb14df05e5aab135a60"
    },
    {
        title: "Efes Kebab",
        location: {
            lat: 52.2313592,
            lng: 21.0550328
        },
        venueID: "4b6a7debf964a520bdd62be3"
    },
    {
        title: "Pikanteria",
        location: {
            lat: 52.2364695,
            lng: 21.0635283
        },
        venueID: "4bfd5530b68d0f47239ce857"
    },
    {
        title: "Towarzyska",
        location: {
            lat: 52.2329434,
            lng: 21.0628921
        },
        venueID: "4f12ec2be4b067f6711a9db6"
    }
];


var ViewModel = function() {
    var self = this;

    this.locationsList = ko.observableArray([]);
    this.filterInput = ko.observable("");
    this.visible = ko.observable(true);

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 52.230433,
            lng: 21.062702
        },
        zoom: 15
    });

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var toggleControlDiv = document.createElement('div');
    var centerControl = new CenterControl(toggleControlDiv, map);

    toggleControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(toggleControlDiv);

    locations.forEach(function(locationItem) {
        self.locationsList.push(new Location(locationItem));
    });

    this.filteredList = ko.computed(function() {
        var filterText = self.filterInput().toLowerCase();
        if (!filterText) {
            self.locationsList().forEach(function(location) {
                location.visible(true);
            });
            return self.locationsList();
        } else {
            return ko.utils.arrayFilter(self.locationsList(), function(location) {
                var name = location.locationName.toLowerCase();
                var result = (name.search(filterText) >= 0);
                location.visible(result);
                return result;
            });
        }
    });

};

var Location = function(data) {
    var self = this;

    this.locationName = data.title;
    this.infowindow = new google.maps.InfoWindow();
    this.visible = ko.observable(true);
    this.address = "";
    this.phone = "";
    this.URL = "";

    var foursquareLink = 'https://api.foursquare.com/v2/venues/' + data.venueID + '?oauth_token=VXWOS4YBG121YPFHG22WXHQXNGWM5YR1N2KRTBLIKAETBWLT&v=20170719';


    $.getJSON(foursquareLink).done(function(data) {
        var result = data.response;
        self.address = result.venue.location.address;
        self.phone = result.venue.contact.formattedPhone;
        if (typeof self.address === 'undefined') {
            self.address = "";
        }
        self.URL = result.venue.url;
        if (typeof self.URL === 'undefined') {
            self.URL = "";
        }
    }).fail(function() {
        alert("There was an error talking to the API, please try again later");
    });


    this.marker = new google.maps.Marker({
        map: map,
        position: data.location,
        title: data.title,
        animation: google.maps.Animation.DROP
    });
    this.marker.addListener('click', function() {
        if (self.infowindow !== self.marker) {
            self.infowindow.marker = self.marker;
            self.infowindow.setContent(
                '<div><strong>' + self.locationName + '</strong><br></div>' +
                '<div>' + self.address + ' <br></div>' +
                '<div>' + self.phone + ' <br></div>' +
                '<div>' + self.URL + ' <br></div>');
            self.infowindow.open(map, this);
        }
    });

    this.showLocation = ko.computed(function() {
        if (this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;

    }, this);

    this.focusOnMarker = function(marker) {
        google.maps.event.trigger(self.marker, 'click');
    };
};

// function partly copied from google developer documentation
function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.id = 'toggleSidebar';
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = '&#9776';
    controlUI.appendChild(controlText);

    // toggle sidebar

    $(window).on('load', function() {

        var toggle = false;

        $('#toggleSidebar').click(function() {
            toggle = !toggle;

            if (toggle) {
                $('#map').animate({
                    left: 0
                });
            } else {
                $('#map').animate({
                    left: 242
                });
            }

        });
    });


}


function runApp() {
    ko.applyBindings(new ViewModel());
}