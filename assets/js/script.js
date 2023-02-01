console.log(news_api_key)
let newsQueryUrl = `https://newsapi.org/v2/everything?q=keyword&apiKey=${news_api_key}`



$.ajax({
    url: newsQueryUrl,
    "X-Api-Key": news_api_key,
    method: "GET"
}).then(function(response){
    let articles = response.articles
    $(articles).each(function(){
        console.log($(this)[0].url)
        let url = $(this)[0].url
        $('#results').append(`<p>${url}</p>`)
    })
    let website_to_scrape = articles[5].url.slice(0,-5)
    let scrapingUrl = `http://api.scraperapi.com?api_key=${scraping_api_key}&url=${website_to_scrape}`
    //console.log(website_to_scrape)
    
    $.ajax({
        url: scrapingUrl, 
        method: "GET"

    }).then(function(response){
        //console.log(response)
    })
    })



