//console.log(news_api_key)
let newsQueryUrl = `https://newsapi.org/v2/everything?q=keyword&apiKey=${news_api_key}`
let geoLocationApi 
let use_location = $('#use-location').val()
let lat, lon
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
                 let start = [lat,lon]
                 let cityQuery =  fetch(`https://api.external.citymapper.com/api/1/traveltimes/`,{
                    method:"GET",
                    mode: 'no-cors',
                    start: [lat, lon],
                    end: destinationEnd, 
                    traveltime_type: transportMethod
                
                 }).then(function(cityQuery){
                    console.log(cityQuery)
                 })
            }
        })
    }
 
   
 if(lat && lon){
  
  
 }




   


 
    // pass to city mapper
    //get time of journey 

     
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
        let articles = response.articles
    }
}).then(function(response){
    let articles = response.articles
    $(articles).each(function(){
       // console.log($(this)[0].url)
        let url = $(this)[0].url
        $('#results').append(`<p>${url}</p>`)
    })
    let website_to_scrape = "https://www.nytimes.com/2020/09/02/opinion/remote-learning-coronavirus.html?action=click&module=Opinion&pgtype=Homepage"
    articles[5].url.slice(0,-5)
    let scrapingUrl = `http://api.scraperapi.com?api_key=${scraping_api_key}&url=${website_to_scrape}`
    //console.log(website_to_scrape)
    
    $.ajax({
        url: scrapingUrl, 
        method: "GET"

    }).then(function(response){
        //console.log(response)
        //console.log(scrap(response))
    })
    })

