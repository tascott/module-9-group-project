// Inital variables
let newsQueryUrl = `https://newsapi.org/v2/everything?q=keyword&apiKey=${news_api_key}`
let geoLocationApi 
let use_location = $('#use-location').val()
let lat, lon, start
let end
let cityMapperUrl = `https://api.external.citymapper.com/api/1/traveltimes`


let searchButton = $('#suggestion-button');
let searchBox = $('#suggestion-text');

// Search button on click
$('#search-button').click(function(e){
    e.preventDefault();
    console.log('hello')

    let searchTime = $('#search-by-time-input').val()
    let destinationStart = $('#destination-start').val()
    let destinationEnd = $('#destination-end').val()
    let transportForm = $('#transport-form').find("input")
    let transportMethod
    if(searchTime && destinationStart)
    {
        destinationStart = null
    }
    transportForm.each(function(){
        let inputEl = $(this)
        if(inputEl.prop("checked")){
           transportMethod = inputEl.attr('id')
        }
        return transportMethod
    })

  
    if(use_location=='on'){
        $.ajax({
            url:`https://api.ipdata.co?api-key=${ip_data_api_key}`,
            method: "GET", 
            success: function(response){
                    lat = response.latitude
                    lon = response.longitude    
                 }})
    }
    $.ajax({
        url: newsQueryUrl,
        "X-Api-Key": news_api_key,
        method: "GET", 
        success:function(response){
            let articles = response.articles.slice(0,9)
            $(articles).each(function(){
                let url = $(this)[0].url
                $('#news-results').append(`<p>${url}</p>`)
            })
          
        },
        error: function(err){
            console.log(err)
        }
    })

 

    
    




})


let origins = "Washington%2C%20DC"
let destinations = "New%20York%20City%2C%20NY"
// $.ajax({
//     method: "GET",
//     url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&units=imperial&key=${google_maps_api_key}`,
//     headers: {},
//     success: function(response){
//         console.log(response)
//     }
// })
let maps_api = fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&units=imperial&key=${google_maps_api_key}`, {
    method: "GET",
    withCredentials: true,
    crossorigin: true,
    mode:'no-cors', 
}).then(function(response){
    console.log(JSON.stringify(response))
})
console.log(JSON.stringify($(maps_api)))



console.log(maps_api)
// TIME
// let timeTravelApi = " https://api.traveltimeapp.com/v4/time-filter"
// let locations
// $.ajax({
//     method: "GET",
//     url: timeTravelApi, 
//     "type": 'walking', 
//     "search_lat": parseFloat(51.5007), 
//     "search_lon": parseFloat(0.1246), 
//     "locations": "51.4995_0.1248",
//     "app_id": "87a122be",
//     "api_key": "ecf4dd6b0ede919a80eea9281fb1c1bf", 
//     success: function(response){
//         console.log(response)
//     }


    
// })


