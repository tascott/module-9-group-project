console.log(news_api_key)
let newsQueryUrl = `https://newsapi.org/v2/everything?q=keyword&apiKey=${news_api_key}`



$.ajax({
    url: newsQueryUrl,
    "X-Api-Key": news_api_key,
    method: "GET"
}).then(function(response){
    let articles = response.articles
   // console.log(articles)
    $(articles).each(function(){
        console.log($(this)[0].url)
    })
})


let scrapingUrl = "http://api.scraperapi.com?api_key=ee598a5176bcff8a001430785a2c2f13&url=http://httpbin.org/ip""
$.ajax({

})