function initMap() {

    var illinois = {
        lat: 39.7177196,
        lng: -91.7473942
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: illinois
    });
    get_info();
}


var Location = function(title, lng, lat, content) {
    var self = this;
    this.title = title;
    this.lng = lng;
    this.lat = lat;
    this.content = content;

    this.infowindow = new google.maps.InfoWindow();

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(self.lng, self.lat),
        map: map,
        title: self.title,
    });

    this.bounceit = function() {
        //self.openInfowindow;
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 2000);
        this.bounce = function(place) {
            google.maps.event.trigger(self.marker, 'click');
        };
    }

    // Opens the info window for the location marker.
    this.openInfowindow = function() {
        for (var i = 0; i < locationsModel.locations.length; i++) {
            locationsModel.locations[i].infowindow.close();
        }
        map.panTo(self.marker.getPosition())
        self.bounceit();
        self.infowindow.setContent(self.content);
        self.infowindow.open(map, self.marker);
    };

    // Assigns a click event listener to the marker to open the info window.
    this.addListener = google.maps.event.addListener(self.marker, 'click', (this.openInfowindow));
    this.addListener = google.maps.event.addListener(self.marker, 'click', function() {
        self.bounceit();
    });
    //self.search;

};

// Contains all the locations and search function.
var locationsModel = {
    locations: [],
    query: ko.observable(' '),
};



function get_info() {
    var url = 'https://ridb.recreation.gov/api/v1/recareas?state=IL&apikey=3601BC7452A74734BA745C617747CF75&limit=5';

    $.getJSON(url).done(
        function(data) {
            for (var i = 0; i < data['RECDATA'].length; i++) {
                var site = data['RECDATA'][i];
                var siteLoc = site['GEOJSON']['COORDINATES'];
                var contentString = '<h6>' + site['RecAreaName'] + '</h6> \
                                <br><blockquote>\
                                <strong>Description:</strong>\
                                <p>' + site['RecAreaDescription'] + '</p> <br>' +
                    '<strong>Phone:</strong>\
                                <p>' + site['RecAreaPhone'] + '</p>' +
                    '</blockquote>';
                locationsModel.locations.push(new Location(site['RecAreaName'], siteLoc[1], siteLoc[0], contentString));
            };
            console.log("ready!");
            locationsModel.query('');
            //trigger = 's';
            //locationsModel.query('');
            //ko.applyBindings(locationsModel);
            //eventFire(document.getElementById('search-box'), 'click');
        }).fail(function() {
        handleError('Sorry recreation data failed to load. Refresh?')
    });

};

$( document ).ready(function() {
    
    console.log( "ready! doc" );
    
});

// Search function for filtering through the list of locations based on the name of the location.
locationsModel.search = ko.computed(function() {
    var self = this;
    var filtered = ko.observable([]);
    var searched = this.query().toLowerCase();
    console.log(searched);
    
    if (searched) {
        console.log('filted');
        filtered = ko.utils.arrayFilter(self.locations, function(location) {
            location.marker.setVisible(true);
            console.log(location.title.toLowerCase().indexOf(searched));
            return location.title.toLowerCase().indexOf(searched) >= 0;
        });
        var nonfiltered = ko.utils.arrayFilter(self.locations, function(location) {
            return location.title.toLowerCase().indexOf(searched) < 0;
        });
        nonfiltered.forEach(function(place) {
            place.marker.setVisible(false);
        });

    }else{
        console.log('opening');
        filtered = ko.utils.arrayFilter(self.locations, function(location) {
            location.marker.setVisible(true);
            return true;
        });
        console.log(filtered);
    }
    console.log(filtered);
    return filtered;

}, locationsModel).extend({ async: true, notify: 'always', deferred: true });

ko.options.deferUpdates = true;
ko.applyBindings(locationsModel);
