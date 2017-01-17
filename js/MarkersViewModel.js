function MarkersViewModel() {
    // Handle Markers
    this.search = ko.observable("");
    this.markerItems = ko.observableArray([]);
    // Handle filtering markers
    this.filterMarkers = function() {
        this.markerItems([]);
        var url = 'https://ridb.recreation.gov/api/v1/recareas?state=IL&apikey=3601BC7452A74734BA745C617747CF75&limit=5';
        var searchVal = this.search().toLowerCase();
        markerData = {};
        $.ajax({
            url: url,
            async: false,
            dataType: 'json',
            success: function(data) {
                markerData = data['RECDATA'];
            }
        });
        var items = filterRec(map, searchVal, markerData);
        for (var i = 0; i < items.length; i++) {
            this.markerItems.push(items[i]);
        }
    };
}
