console.log(news_api_key)
let newsQueryUrl = `https://newsapi.org/v2/everything?q=keyword&apiKey=${news_api_key}`

$('#search-button').click(function(){
    let timeVal = $('#search-by-time').val()
    let startVal = $('#search-by-destination-start').val()
    let endVal = $('#search-by-destination-end').val()
    console.log(timeVal)
    console.log(startVal)
    console.log(endVal)
})

$.ajax({
    url: newsQueryUrl,
    "X-Api-Key": news_api_key,
    method: "GET"
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

