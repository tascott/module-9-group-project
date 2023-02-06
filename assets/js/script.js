// Inital variables
let newsQueryUrl = `https://newsapi.org/v2/everything?q=keyword&apiKey=${news_api_key}`
let geoLocationApi
let use_location = $('#use-location').val()
let lat, lon, start, end

let searchButton = $('#suggestion-button');
let searchBox = $('#suggestion-text');

// Search button on click
$('#search-button').click(function (e) {
    e.preventDefault();
    let searchTime = $('#search-by-time-input').val();
    let destinationStart = $('#destination-start').val();
    let destinationEnd = $('#destination-end').val();
    let transportForm = $('#transport-form').find("input");
    let transportMethod
    if (searchTime && destinationStart) {
        destinationStart = null
    }
    transportForm.each(function () {
        let inputEl = $(this)
        if (inputEl.prop("checked")) {
            transportMethod = inputEl.attr('id')
        }
        return transportMethod
    })

    if (use_location == 'on') {
        $.ajax({
            url: `https://api.ipdata.co?api-key=${ip_data_api_key}`,
            method: "GET",
            success: function (response) {
                lat = response.latitude
                lon = response.longitude
            }
        })
    }
})