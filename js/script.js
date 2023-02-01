console.log(news_api_key)
let newsQueryUrl = `https://newsapi.org/v2/everything?q=keyword&apiKey=${news_api_key}`



$.ajax({
    url: newsQueryUrl,
    "X-Api-Key": news_api_key,
    method: "GET"
}).then(function(response){
    console.log(response)
})

$.ajax({
    
})