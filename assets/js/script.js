//console.log(news_api_key)
let newsQueryUrl = `https://newsapi.org/v2/everything?q=keyword&apiKey=${news_api_key}`
let geoLocationApi 
let use_location = $('#use-location').val()
let lat, lon, start
let end
let cityMapperUrl = `https://api.external.citymapper.com/api/1/traveltimes`
$('#search-button').click(function(){
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
                    start = [lat,lon]
                    console.log(start)
                    let cityQuery =  fetch(`https://api.external.citymapper.com/api/1/traveltimes/`,{
                    method:"GET",
                    mode: 'no-cors',
                    start: start,
                    end: [51.559098,0.074503], 
                    traveltime_type: transportMethod
                
                 })
                 .then(function(cityQuery){
                    console.log(cityQuery)
                 })
                 .catch(function(err){
                    console.log(err)
                 })
            }
        })
    }
 
   

     
})



// This is a call using the ip data api it's not that accurate
//But good for a small project



$('#search-button').click(function(){
    let timeVal = $('#search-by-time').val()
    let startVal = $('#search-by-destination-start').val()
    let endVal = $('#search-by-destination-end').val()
    console.log(timeVal)
    console.log(startVal)
    console.log(endVal)
})

//$.ajax({
  //  url: cityMapperUrl, 
   // method: "GET", 
  //  start: [lat.toFixed(6), lon.toFixed(6)],
   // crossDomain: true,
    //headers: {
     //   "Citymapper-Partner-Key": city_mapper_api_key
   // },
    //traveltime_type: transportMethod,
    //success: function(response){
     //   console.log(response)
   // }
// })


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
