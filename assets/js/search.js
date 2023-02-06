// THIS IS THE ONLY SCRIPT FOR SEARCHING.accordion
let interests = [];
let interestContainer = $('#suggestion-results');
let stored_news = JSON.parse(localStorage.getItem('stored_news'))
let stored_sports = JSON.parse(localStorage.getItem('stored_sports'))
let interest_results = JSON.parse(localStorage.getItem('interest_results'))
let final_words = $('#suggestions-list');

// Toggle between manual time entry and google search
$('#manually-enter').click(function () {
    $('.search-time').show();
    $('.search-time').css('display', 'flex');
    $('.search-google').hide();
})

$('#use-google').click(function () {
    $('.search-time').hide();
    $('.search-google').show();
    $('.search-google').css('display', 'flex');
})

// Add the time to the user object (google option handled in the g-maps api callback)
$('#add-time').click(function () {
    let time = $('#search-by-time-input').val();
    userData.time = time;
})

// Listener to add single typed topic for the interests list
$('#add-topic').click(function () {
    if ($('#suggestion-text').val() != '') {
        let term = $('#suggestion-text').val();
        getRelatedWords(term);
    }
})

// Event listener to add suggested topics to the interests list
$("#suggestions").on("click", ".addWord", function () {
    addWordToSearch($(this).data('interest'));
});

// Render the content after searching and getting parameters
$('#search-button').click(function () {
    localStorage.setItem('userData', JSON.stringify(userData));
    renderAllNews();
});


let renderAllNews = function () {
    let time;
    if (JSON.parse(localStorage.getItem('userData'))) {
        time = JSON.parse(localStorage.getItem('userData')).time;
        $('.your-results').replaceWith(`<h2>Your results for a ${time} minute journey</h2>`);
    }

    $('#news-results').empty().append(`<h4>Top Stories</h4>`);
    $('#sports-results').empty().append(`<h4>Sports</h4>`);
    $('#interest-results').empty().append(`<h4>Personalised Results</h4>`);
    if (stored_news == null) {
        stored_news = []
    }

    if (stored_sports == null) {
        stored_sports = []
    }

    if (interest_results == null) {
        interest_results = []
    }

    if (stored_news.length == 0) {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://real-time-news-data.p.rapidapi.com/top-headlines?country=US&lang=en",
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": news_api_key,
                "X-RapidAPI-Host": "real-time-news-data.p.rapidapi.com"
            }
        };

        $.ajax(settings).done(function (response) {
            console.log('called news API')
            let data = [response.data]
            if (stored_news.length == 0) {
                stored_news = [...data]
            } else {
                stored_news = [...stored_news, ...data]
            }
            stored_news = [JSON.stringify(stored_news)]

            localStorage.setItem('stored_news', stored_news)

        });
    }
    let newsTemp = `<div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">`

    let temp = ``
    let tempEnd = `</div>
       <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-bs-slide="prev">
       <span class="carousel-control-prev-icon" aria-hidden="true"></span>
       <span class="sr-only">Previous</span>
       </a>
       <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-bs-slide="next">
       <span class="carousel-control-next-icon" aria-hidden="true"></span>
       <span class="sr-only">Next</span>
       </a>
       </div>`

    let count = 0
    $(stored_news[0]).each(function () {
        count++
        let title = $(this)[0].title
        let link = $(this)[0].link
        let photo_url = $(this)[0].photo_url
        let source_logo_url = $(this)[0].source_logo_url
        if (count == 1) {
            temp = temp + `<div class="carousel-item active" style="background-image: url(${photo_url})"><div class="carousel-item-inner">
                <img class="logo" src="${source_logo_url}" alt="First slide">
                <p class="company-title">${title}</p>
                <p class="company-links"><a href="${link}" target="_blank">Go To Article</a></p>
                </div></div>`

        } else {
            temp = temp + `<div class="carousel-item" style="background-image: url(${photo_url})"><div class="carousel-item-inner">
                <img class="logo" src="${source_logo_url}" alt="Second slide">
                <p class="company-title">${title}</p>
                <p class="company-links"><a href="${link} target="_blank">Go To Article</a></p>
                </div></div>`
        }
    })
    temp = newsTemp + temp + tempEnd

    $('#news-results').append(temp)

    // Render some sports info if we don't have any already
    if (stored_sports.length == 0) {
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

            let results = sportsResponse.response.slice(0, 70)
            if (stored_sports.length == 0) {
                stored_sports = [...results]
            } else {
                stored_sports = [...stored_sports, ...results]
            }
            stored_sports = JSON.stringify(stored_sports)
            localStorage.setItem('stored_sports', stored_sports)
        });
    }

    let sportsTemp = `<div id="carouselExampleControls2" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">`

    temp = ``
    tempEnd = `</div>
            <a class="carousel-control-prev" href="#carouselExampleControls2" role="button" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleControls2" role="button" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
            </a>
       </div>`

    count = 0
    for (let i = 0; i < stored_sports.length; i++) {
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
        if (stored_sports[i].score.extratime.home && stored_sports[i].score.extratime.away) {
            extratimeHomeScore = stored_sports[i].score.extratime.home
            extratimeAwayScore = stored_sports[i].score.extratime.away
        }
        if (count == 1) {
            temp = temp + `<div class="carousel-item active"><div class="carousel-item-inner" style="background-image: url()">
                <div class="row">
                <img class="" src="${homeLogo}" alt="First slide">
                </div>
                <p>${homeTeam} vs ${awayTeam}</p>
                <p>${league}</p>
                <p>${round}</p>
                <p>Halftime: ${homeTeam}: ${halftimeHomeScore} : ${halftimeAwayScore} ${awayTeam} </p>
                <p>Fulltime: ${homeTeam}: ${fulltimeHomeScore} : ${fulltimeAwayScore} ${awayTeam}</p>`
            if (extratimeHomeScore) {
                temp = temp + `Extratime: <p> ${homeTeam} ${extratimeHomeScore} : ${extratimeAwayScore} ${awayTeam}</p>`
            }

            temp = temp + `</div></div>`
        } else {
            temp = temp + `<div class="carousel-item"><div class="carousel-item-inner" style="background-image: url()">
                <img class="" src="${homeLogo}" alt="First slide">
                <p>${homeTeam} vs ${awayTeam}</p>
                <p>${league}</p>
                <p>${round}</p>
                <p>Halftime: ${homeTeam}: ${halftimeHomeScore} : ${halftimeAwayScore} ${awayTeam} </p>
                <p>Fulltime: ${homeTeam}: ${fulltimeHomeScore} : ${fulltimeAwayScore} ${awayTeam}</p>`
            if (extratimeHomeScore) {
                temp = temp + `Extratime: <p> ${homeTeam} ${extratimeHomeScore} : ${extratimeAwayScore} ${awayTeam}</p>`
            }
            temp = temp + `</div></div>`
        }
    }
    temp = sportsTemp + temp + tempEnd
    $('#sports-results').append(temp)

    // Fetch some results for interests
    if (interest_results.length == 0) {
        console.log('no interest results, calling search API')
        let interests = JSON.parse(localStorage.getItem('interest_keywords'));
        interests.forEach((interest) => {
            queryString = new URLSearchParams(interest).toString();
            const settings = {
                "async": true,
                "crossDomain": true,
                "url": `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q=${queryString}&pageNumber=1&pageSize=10&autoCorrect=true`,
                "method": "GET",
                "headers": {
                    "X-RapidAPI-Key": contextual_web_api_key,
                    "X-RapidAPI-Host": "contextualwebsearch-websearch-v1.p.rapidapi.com"
                }
            };

            $.ajax(settings).done(function (response) {
                interest_results = response.value
                localStorage.setItem('interest_results', JSON.stringify(interest_results))
            });
        })
    } else {
        console.log('interest results already exist')
    }

    let interestsTemp = `<div id="carouselExampleControls3" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">`
    temp = ``

    tempEnd = `</div>
                <a class="carousel-control-prev" href="#carouselExampleControls3" role="button" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleControls3" role="button" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
                </a>
                </div>`

    count = 0
    $(interest_results).each(function () {
        count++
        let arr = $(this)[0]
        let title = arr.title
        let thumbnail = arr.thumbnail // these dont show the link is not a typical image
        let url = arr.url
        if (count == 1) {
            temp = temp + `<div class="carousel-item active"><div class="carousel-item-inner" style="background-image: url()">
                    <img class="" src="${thumbnail}" alt="First slide">
                    <p>${title}</p>
                    <p><a href="${url}" target="_blank">View image</a></p>
                    </div></div>`
        } else {
            temp = temp + `<div class="carousel-item"><div class="carousel-item-inner" style="background-image: url()">
                    <img class="" src="${thumbnail}" alt="Next slide">
                    <p>${title}</p>
                    <p><a href="${url}" target="_blank">View image</a></p>
                    </div></div>`
        }
    })
    temp = interestsTemp + temp + tempEnd
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
};

/*
-------
JS to get related words
-------
*/

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
            wordoptions = response.hasTypes.sort(() => Math.random() - 0.5).slice(0, 5);
            addWordToSearch(topicVal)
            renderSuggestedWords(wordoptions);
        })
        .catch(err => console.error(err));
}

function getRelatedWordsFromLocalStorage(topicVal) {
    interests = JSON.parse(localStorage.getItem('interest_keywords'));
    renderSuggestedWords(interests);
}

function renderSuggestedWords(wordoptions) {
    interestContainer.empty();
    $('#suggestion-results-container h6').removeClass('hidden')
    wordoptions.forEach(function (option) {
        interestContainer.append(`<div class="addWord" data-interest="${option}"><span class="interest badge badge-pill badge-primary">${option}</span></div>`);
    });
}

function addWordToSearch(topicVal) {
    $('#suggestions-list-container h6').removeClass('hidden')
    let interest;
    if (topicVal) {
        interest = topicVal;
    } else {
        interest = $(this).attr('data-interest');
    }

    userData.topics.indexOf(interest) === -1 ? userData.topics.push(interest) : console.log("This item already exists");
    final_words.empty();
    userData.topics.forEach(function (option) {
        final_words.append(`<span class="interest-done badge badge-pill badge-primary">${option}</span>`);
    });
    localStorage.setItem('interest_keywords', JSON.stringify(userData.topics));
};

/*
-------
JS to get journey time using Google maps API
-------
*/

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService);
    };
    document.getElementById('calculate-time').addEventListener('click', onChangeHandler);
}

function calculateAndDisplayRoute(directionsService) {
    var start = document.getElementById('destination-start').value;
    var end = document.getElementById('destination-end').value;
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.TRANSIT
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            let time = response.routes[0].legs[0].duration.text
            let minutes = response.routes[0].legs[0].duration.value / 60
            userData.time = minutes;
            $('#calculated-time').text(time);

        } else {
            console.log('Directions request failed due to ' + status);
        }
    });
};

/*
-------
Call the function to get the blog posts in renderBlogcontent.js
-------
*/

// callMediumAPI();


// Render the content on page load (if we have any)
renderAllNews();