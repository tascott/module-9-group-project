// THIS IS THE ONLY SCRIPT FOR SEARCHING.accordion
let interests = [];
let interestContainer = $('#suggestion-results');
let stored_news =JSON.parse(localStorage.getItem('stored_news'))
//console.log(stored_news)
let stored_sports = JSON.parse(localStorage.getItem('stored_sports'))
let interest_results = JSON.parse(localStorage.getItem('interest_results'))


// google maps 


$('#search-button').click(function(){
    $('#news-results').empty()
    $('#sports-results').empty()
    if(stored_news == null){
        stored_news = []
        console.log('new stored_news')
        console.log(stored_news)
    }

    if(stored_sports == null){
        stored_sports = []
        console.log('new stored sports')
        console.log(stored_sports)
    }

    if(interest_results == null){
        interest_results = []
        console.log('new interest results') // done because the api can only be caled 100 times
        console.log(interest_results)
    }
    
    let topicVal = $('#suggestion-text').val()
    let startVal = $('#destination-start').val()
    let endVal = $('#destination-end').val()
    let timeVal = $('#search-by-time-input').val()
    let transportVal = $('#transport-form').children('input:checked').attr('id')

    
    // console.log(transportVal)
    // console.log(timeVal)
    // console.log(endVal)
    // console.log(startVal)
    // console.log(topicVal)

    //uncomment after first result
     getRelatedWordsFromLocalStorage(topicVal);

    //comment out after first result
    //getRelatedWords(topicVal);


    if(stored_news.length == 0 ){
        console.log('hello')
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://real-time-news-data.p.rapidapi.com/top-headlines?country=US&lang=en",
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": "289a29c09emsh67b645d76a420f4p19e2ffjsn3ff56d782897",
                "X-RapidAPI-Host": "real-time-news-data.p.rapidapi.com"
            }
        };
        
        $.ajax(settings).done(function (response) {
            let data = [response.data]
            //console.log(data)
            if(stored_news.length == 0){
                stored_news = [...data]
            }else{
                stored_news = [...stored_news, ...data]
            }
            stored_news = [JSON.stringify(stored_news)]
        
            localStorage.setItem('stored_news', stored_news)

        });


    }

   

        let newsTemp = `
        <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
      
        `
        let temp =  ``

       let tempEnd =`
       </div>
       <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-bs-slide="prev">
       <span class="carousel-control-prev-icon" aria-hidden="true"></span>
       <span class="sr-only">Previous</span>
       </a>
       <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-bs-slide="next">
       <span class="carousel-control-next-icon" aria-hidden="true"></span>
       <span class="sr-only">Next</span>
       </a>
       </div>
       `
       let count = 0
        $(stored_news[0]).each(function(){
            //console.log($(this))
            count++
            let title = $(this)[0].title
            let link = $(this)[0].link
            let photo_url = $(this)[0].photo_url
            let source_logo_url = $(this)[0].source_logo_url
            if(count == 1){
                temp =  temp +  `<div class="carousel-item active">
                <img class="d-block w-100" src="${source_logo_url}" alt="First slide">
                <p>${title}</p>
                <p><a href="${link}">${link}</a></p>
                </div>`

            }else{
                temp = temp +    `<div class="carousel-item">
                <img class="d-block w-100" src="${source_logo_url}" alt="Second slide">
                <p>${title}</p>
                <p><a href="${link}">${link}</a></p>
                </div>`
            }
          
            //console.log(title)
            
        
        })
        temp = newsTemp + temp + tempEnd

        $('#news-results').append(temp)
        if(stored_sports.length == 0)
        {
            settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://api-football-v1.p.rapidapi.com/v3/fixtures?league=39&season=2020",
                "method": "GET",
                "headers": {
                    "X-RapidAPI-Key": "289a29c09emsh67b645d76a420f4p19e2ffjsn3ff56d782897",
                    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
                }
            };
            
            $.ajax(settings).done(function (sportsResponse) {
                
                let results = sportsResponse.response.slice(0,70)
                console.log(results);
                if(stored_sports.length == 0)
                {
                    stored_sports = [...results]
                }else{
                    stored_sports = [...stored_sports, ...results]
                }
                stored_sports = JSON.stringify(stored_sports)
                localStorage.setItem('stored_sports', stored_sports)


            });
        }

        let sportsTemp = `
        <div id="carouselExampleControls2" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
      
        `
        temp =  ``

        tempEnd =`
       </div>
       <a class="carousel-control-prev" href="#carouselExampleControls2" role="button" data-bs-slide="prev">
       <span class="carousel-control-prev-icon" aria-hidden="true"></span>
       <span class="sr-only">Previous</span>
       </a>
       <a class="carousel-control-next" href="#carouselExampleControls2" role="button" data-bs-slide="next">
       <span class="carousel-control-next-icon" aria-hidden="true"></span>
       <span class="sr-only">Next</span>
       </a>
       </div>
       `

        count = 0
        //console.log(stored_sports)
        //$(stored_sports).each(function(){
          for(let i = 0; i < stored_sports.length; i++)
            {
            count++
            let homeTeam = stored_sports[i].teams.home.name
            let homeLogo = stored_sports[i].teams.home.logo
            let awayTeam = stored_sports[i].teams.away.name
            let awayLogo = stored_sports[i].teams.away.logo
            let league = stored_sports[i].league.name 
            let round = stored_sports[i].league.round 
            let halftimeHomeScore = stored_sports[i].score.halftime.home
            let halftimeAwayScore = stored_sports[i].score.halftime.away 
            let fulltimeHomeScore = stored_sports[i].score.fulltime.home 
            let fulltimeAwayScore = stored_sports[i].score.fulltime.away 
            let extratimeHomeScore
            let extratimeAwayScore
            if(stored_sports[i].score.extratime.home && stored_sports[i].score.extratime.away)
            {
                 extratimeHomeScore = stored_sports[i].score.extratime.home
                 extratimeAwayScore = stored_sports[i].score.extratime.away
            }
            if(count == 1){
                temp =  temp +  `<div class="carousel-item active">
                <div class="row">
                <img class="d-block w-50" width="50px" height="200px" src="${homeLogo}" alt="First slide">
                </div>
                <p>${homeTeam} vs ${awayTeam}</p>
                <p>${league}</p>
                <p>${round}</p>
                <p>Halftime: ${homeTeam}: ${halftimeHomeScore} . ${awayTeam} : ${halftimeAwayScore}</p>
                <p>Fulltime: ${homeTeam}: ${fulltimeHomeScore} . ${awayTeam} : ${fulltimeAwayScore}</p>`
                if(extratimeHomeScore){
                    temp = temp + `Extratime: <p> ${homeTeam}: ${extratimeHomeScore} . ${awayTeam} : ${extratimeAwayScore}</p>` 
                }

                temp = temp +`</div>`

            }else{
                temp = temp +  `<div class="carousel-item">
                <img class="d-block w-25" width="50px" height="100px" src="${homeLogo}" alt="First slide">
                <p>${homeTeam} vs ${awayTeam}</p>
                <p>${league}</p>
                <p>${round}</p>
                <p>Halftime: ${homeTeam}: ${halftimeHomeScore} . ${awayTeam} : ${halftimeAwayScore}</p>
                <p>Fulltime: ${homeTeam}: ${fulltimeHomeScore} . ${awayTeam} : ${fulltimeAwayScore}</p>`
                if(extratimeHomeScore){
                    temp = temp + `Extratime: <p> ${homeTeam}: ${extratimeHomeScore} . ${awayTeam} : ${extratimeAwayScore}</p>` 
                }

                temp = temp +`</div>`
            }
        }
            temp = sportsTemp + temp + tempEnd
            //console.log(temp)
            $('#sports-results').append(temp)
            let interestEls = interestContainer.children().children()
            //console.log($(interestEls[0]).text())
            $(interestEls).click(function(){
                let query = ($(this).text())
                const settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q=${query}&pageNumber=1&pageSize=10&autoCorrect=true`,
                    "method": "GET",
                    "headers": {
                        "X-RapidAPI-Key": "289a29c09emsh67b645d76a420f4p19e2ffjsn3ff56d782897",
                        "X-RapidAPI-Host": "contextualwebsearch-websearch-v1.p.rapidapi.com"
                    }
                };
                
                $.ajax(settings).done(function (response) {
                    console.log(response)
                     interest_results = response.value
                     console.log(interest_results)
                     localStorage.setItem('interest_results', JSON.stringify(interest_results))


                });


            })
            let interestsTemp = `
            <div id="carouselExampleControls3" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
                `
             temp =  ``

             tempEnd =`
                </div>
                <a class="carousel-control-prev" href="#carouselExampleControls3" role="button" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleControls3" role="button" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
                </a>
                </div>
                `
                count = 0
            $(interest_results).each(function(){
                count++
                let arr = $(this)[0]
                console.log(arr)
                let title = arr.title 
                let thumbnail = arr.thumbnail // these dont show the link is not a typical image 
                let url = arr.url 
                console.log(title)
                if(count == 1)
                {
                    temp = temp + `<div class="carousel-item active">
                   // <img class="d-block w-100" src="${thumbnail}" alt="First slide">
                    <p>${title}</p>
                    <p><a href="${url}">${url}</a></p>
                    </div>`
                }else{
                    temp = temp +    `<div class="carousel-item">
                    <img class="d-block w-100" src="${thumbnail}" alt="Next slide">
                    <p>${title}</p>
                    <p><a href="${url}">${url}</a></p>
                    </div>`
                }

            })
            temp = interestsTemp + temp + tempEnd
            console.log(temp)
            $('#interest-results').append(temp)
      

        
            








        
        
      

        // get news for each topic 
        // render topic news 

        //do css media queries -> finished mine 


      


       
       






        // let newsQueryUrl = `https://newsapi.org/v2/everything?q=keyword&apiKey=${news_api_key}`

        // $.ajax({
        //     url: newsQueryUrl,
        //     "X-Api-Key": news_api_key,
        //     method: "GET", 
        //     success:function(response){
        //         let articles = response.articles.slice(0,9)
        //         $(articles).each(function(){
        //             let url = $(this)[0].url
        //             $('#news-results').append(`<p>${url}</p>`)
        //         })
              
        //     },
        //     error: function(err){
        //         console.log(err)
        //     }
        // })

    
    

})

function getRelatedWords(topicVal) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': words_api_key,
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    };

    //other options: pertainsTo hasTypes similarTo synonyms
    //get synonyms for this word
    fetch('https://wordsapiv1.p.rapidapi.com/words/' + topicVal + '/hasTypes', options)
        .then(response => response.json())
        .then(function (response) {
            console.log(response)
            interests = response.hasTypes.sort(() => Math.random() - 0.5).slice(0, 5);
            localStorage.setItem('interests', JSON.stringify(interests));
            renderSuggestedResponses();
        })
        .catch(err => console.error(err));
}

function getRelatedWordsFromLocalStorage(topicVal) {
    interests = JSON.parse(localStorage.getItem('interests'));
    renderSuggestedResponses();
}

function renderSuggestedResponses() {
    //console.log(interests);
    interestContainer.empty();
    interests.forEach(function (interest) {
        interestContainer.append(`<div data-interest="${interest}"><span class=" interest badge badge-pill badge-primary">${interest}</span></div>`);
    });
}





function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;

    directionsDisplay.setPanel(document.getElementById('right-panel'));

    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}


function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.TRANSIT
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            console.log(response)
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });

}

google.maps.event.addDomListener(window, "load", initMap);



