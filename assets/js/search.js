// THIS IS THE ONLY SCRIPT FOR SEARCHING.accordion
let userData;

// Update the user object with the data from local storage, if none, set params to null and we'll set it later
let userDataFromStorage = JSON.parse(localStorage.getItem('userData'));
if (userDataFromStorage == null) {
    userData = {
        "exampleContent": true,
        "time": "60 minutes (default)",
        "topics": [],
        "location": {
            "from": null,
            "to": null
        },
        "transport": "public",
        "stored_news": [],
        "stored_interests": [],
        "stored_sports": [],
        "stored_youtube_searches": [],
        "stored_blog_content": [],
        "stored_blog_post_ids": [],
    }
} else {
    userData = userDataFromStorage;
}
let interests = [];
let interestContainer = $('#suggestion-results');
let final_words = $('#suggestions-list');
let youtube_search = $('#youtube-text')
let stored_news = userData.stored_news;
let stored_sports = userData.stored_sports;
let stored_interests = userData.stored_interests;
let storedTopBlogPostIds = userData.stored_blog_post_ids;
let storedBlogPostContent = userData.stored_blog_content;
let topic = userData.topics[0] ? userData.topics[0] : null;
let stored_videos = userData.stored_videos
let blogDiv = $('#blog-results');
let articleModal = document.getElementById('article-modal');
let stored_youtube_searches = userData.stored_youtube_searches
let videoID
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

//Add the default time to the page to beging with
$('#calculated-time').text(userData.time);

// Add the time to the user object (google option handled in the g-maps api callback)
$('#add-time').click(function () {
    let time = $('#search-by-time-input').val();
    userData.time = time;
    localStorage.setItem('userData', JSON.stringify(userData));
    $('#calculated-time').text(time);
})

// Listener to add single typed topic for the interests list
$('#add-topic').click(function () {
    if ($('#suggestion-text').val() != '') {
        let term = $('#suggestion-text').val();
        getRelatedWords(term);
        $('#suggestion-text').val('');
    }
})

// Event listener to add suggested topics to the interests list
$("#suggestions").on("click", ".addWord", function () {
    addWordToSearch($(this).data('interest'));
});

// Event listener to add suggested topics to the interests list
$("#suggestions").on("click", ".delete", function () {
    let option = $(this).data('option');
    deleteWord(option);
});

// Render the content after searching and getting parameters
$('#search-button').click(function () {
    if ($('#suggestion-text').val() != '') {
        addWordToSearch($('#suggestion-text').val());
    }
    renderAllNews();
});

$('#search-youtube').click(searchYoutube)


function videoChoice(){
    let selection = $('#youtube-search').val()
    let selectionEl = `<button></button>`

}

let renderAllNews = function () {
    let time;
    if (userData.time) {
        time = userData.time;
        $('.your-results').replaceWith(`<h2>Your results for a ${time} journey</h2>`);
    }

    $('#news-results').empty().append(`<h4>Top Stories</h4>`);
    $('#sports-results').empty().append(`<h4>Sports</h4>`);
    $('#interest-results').empty().append(`<h4>Personalised Results</h4>`);
    $('#video-results').empty().append(`<h4>Video Results</h4>`)
    if (stored_news == null) {
        stored_news = []
    }

    if (stored_sports == null) {
        stored_sports = []
    }

    if (stored_interests == null) {
        stored_interests = []
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

            userData.stored_news = stored_news;
            localStorage.setItem('userData', JSON.stringify(userData));
            renderNews();
        });
    } else {
        renderNews();
    }

    function renderNews() {
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
        let articles = JSON.parse(stored_news[0]);
        $(articles[0]).each(function () {
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
    }

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
            console.log('called sports API', stored_sports)
            userData.stored_sports = stored_sports;
            localStorage.setItem('userData', JSON.stringify(userData));
            renderAllSports();
        });
    } else {
        renderAllSports();
    }

    function renderAllSports() {
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

        stored_sports = userData.stored_sports;

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
    }

    // If we have a topic but no data yet, fetch some data
    if (stored_interests.length < 1 && userData.topics.length > 0) {
    // Fetch some results for interests
        let interests = userData.topics;
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
                stored_interests = response.value
                userData.stored_interests = stored_interests;
                localStorage.setItem('userData', JSON.stringify(userData));
                renderCustomInterests(userData.stored_interests);
            }).then(() => {
                // Get blog content with the first interest
                console.log('call medium API from search.js')
                callMediumAPI(userData.topics[0]);
            });
        })
    } else if (stored_interests.length > 0) {
        renderCustomInterests(userData.stored_interests);
        callMediumAPI(userData.topics[0]);
    }

    function renderCustomInterests() {
        let stored_interests = userData.stored_interests;
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
        $(stored_interests).each(function () {
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
    }

    

   
};



function searchYoutube(){
    if(youtube_search){
        youtube_search = youtube_search.val()
        youtube_search = encodeURIComponent(youtube_search)
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": `https://youtube-search6.p.rapidapi.com/search/?query=${youtube_search}&number=10&country=us&lang=en`,
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": "289a29c09emsh67b645d76a420f4p19e2ffjsn3ff56d782897",
                "X-RapidAPI-Host": "youtube-search6.p.rapidapi.com"
            }
        };
        
        $.ajax(settings).done(function (response) {
        
            stored_youtube_searches = response.videos
            userData.stored_youtube_searches = stored_youtube_searches
            localStorage.setItem('userData', JSON.stringify(userData))
            renderAllVideoResults(stored_youtube_searches)
            
        });
    }
}

function renderAllVideoResults(stored_youtube_searches){
    let videoEl
    let videoMid = ``
    let videoTop = `<div id="carouselExampleControls4" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">`
    let videoEnd = `</div>
            <a class="carousel-control-prev" href="#carouselExampleControls4" role="button" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleControls4" role="button" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
            </a>
            </div>`
    let count = 0
    if(stored_youtube_searches){
        $(stored_youtube_searches).each(function () {
            count++
            let channel_id = $(this)[0].channel_id 
            let description = $(this)[0].description
            let number_of_views = $(this)[0].number_of_views
            let published_time = $(this)[0].published_time
            let thumbnail = $(this)[0].thumbnails[0].url
         
            let title = $(this)[0].title 
            let videoID = $(this)[0].video_id 
            let video_length = $(this)[0].video_length
            if (count == 1) {
                videoMid = videoMid + `<div class="carousel-item active"><div class="carousel-item-inner video-result" style="background-image: url(); ">
                    <img class=""  src="${thumbnail}" alt="First slide">
                    <h5 class="video-title">${title}</h5>
                    <p class=video-description">Description: ${description}</p>
                    <p class="video-views">Number of Views: ${number_of_views}</p>
                    <p class="video-published">Date Uploaded: ${published_time}</p>
                    <p class="video-length">Video Length: ${video_length}</p>
                    <button data-source="${videoID}" id="video-button"class="video-button btn btn-primary">Watch Video</button>
                    </div></div>`
            } else {
                videoMid = videoMid + `<div class="carousel-item"><div class="carousel-item-inner video-result" style="background-image: url()">
                     <img class="" onclick="getVideo()"src="${thumbnail}" alt="Next slide">
                    <h5 class="video-title">${title}</h5>
                    <p class=video-description">Description: ${description}</p>
                    <p class="video-views">Number of Views: ${number_of_views}</p>
                    <p class="video-published">Date Uploaded: ${published_time}</p>
                    <p class="video-length">Video Length: ${video_length}</p>
                    <button data-source="${videoID}" id="video-button" class="video-button btn btn-primary" >Watch Video</button>
                    </div></div>`
            }
        })
        let videoHeader = `<h4>Video Results</h4>`
    videoEl = videoHeader + videoTop + videoMid + videoEnd
    $('#video-results').append(videoEl)
    
    }


}

$('')


$(".results").on("click", "#video-button", function () {
    let id = $(this).attr('data-source')
    let src = `https://www.youtube.com/embed/${id}`
    $('#video-element').attr('src', src)
    $('#video-results').hide()
    $('#video-container').css('display','block')

})





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

    userData.topics.indexOf(interest) === -1 ? userData.topics.push(interest) : null;
    final_words.empty();
    userData.topics.forEach(function (option) {
        final_words.append(`<span class="interest-done badge badge-pill badge-primary">${option}</span><i class="bi bi-x-circle delete" data-option="${option}"></i>`);
    });
    localStorage.setItem('userData', JSON.stringify(userData));
};

function deleteWord(option) {
    let index = userData.topics.indexOf(option);
    if (index > -1) {
        userData.topics.splice(index, 1);
    }
    final_words.empty();
    userData.topics.forEach(function (option) {
        addWordToSearch(option)
    });
    localStorage.setItem('userData', JSON.stringify(userData));
}

userData.topics.forEach(function (option) {
    addWordToSearch(option)
});

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
            userData.time = Math.round(minutes);
            userData.location.from = start;
            userData.location.to = end;
            localStorage.setItem('userData', JSON.stringify(userData));
            $('#calculated-time').text(time);
        } else {
            console.log('Directions request failed due to ' + status);
        }
    });
};

// Render the content on page load (if we have any)
renderAllNews();

/*
-------
Get offline-readable content from Medium API
-------
*/

function callMediumAPI(topicToSearch, refresh = false) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': mediumAPIKey,
            'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
        }
    };

    //If we have content just render it
    if (storedBlogPostContent.length) {
        // We have some content, render the divs
        renderBlogItems(storedBlogPostContent);
    } else {
        // If we don't have any content, get it from the API
        let tempData = [];
        if (topicToSearch) {
            fetch(`https://medium2.p.rapidapi.com/topfeeds/${topicToSearch}/hot`, options)
                .then(response => response.json())
                .then(response => {
                    userData.stored_blog_post_ids = response.topfeeds;
                    localStorage.setItem('userData', JSON.stringify(userData));

                    if (userData.stored_blog_post_ids.length > 0) {
                        userData.stored_blog_post_ids = userData.stored_blog_post_ids.slice(0, 1);
                        userData.stored_blog_post_ids.forEach(function (id, index) {
                            console.log('api call medium2, ', index)
                            //This API only gets the metadata
                            fetch(`https://medium2.p.rapidapi.com/article/${id}`, options)
                                .then(response => response.json())
                                .then(function (response) {
                                    tempData.push(response);
                                    fetch(`https://medium2.p.rapidapi.com/article/${id}/content`, options)
                                        .then(response => response.json())
                                        .then(function (response) {
                                            // Push the content to the tempData array
                                            tempData[index].content = response;
                                            console.log('tempData', tempData)
                                        }).then(function () {
                                            userData.stored_blog_content = tempData;
                                            renderBlogItems(tempData);
                                            localStorage.setItem('userData', JSON.stringify(userData))
                                        })
                                        .catch(err => console.error(err));
                                })
                                .catch(err => console.error(err));
                        })
                    }
                })
                .catch(err => console.error(err));
        }
    }
}

function renderBlogItems(list) {
    list.forEach(function (item, i) {
        let title = item.title;
        let subtitle = item.subtitle;
        let wordcount = item.wordcount;
        let content = item.content.content;
        // replace all the new lines with a line break and all the double and single quotes with html entities
        content = content.replace(/(\r\n|\n|\r)/gm, "<br>").replace(/'/g, "&#39;").replace(/"/g, "&#34;");
        let url = item.url;

        html = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#article-modal" data-bs-title="${title}" data-bs-url="${url}" data-bs-content="${content}">Read Article</button>
            </div>
        </div>
        `

        blogDiv.html(html);
        blogDiv.prepend(`<h2>Blogs</h2><h6>Available offline</h6>`);
    })
};


// Put blog content in a modal for offline reading

articleModal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = event.relatedTarget
    // Extract info from data-bs-* attributes
    var title = button.getAttribute('data-bs-title')
    var content = button.getAttribute('data-bs-content')
    var url = button.getAttribute('data-bs-url')
    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.

    var modalTitle = articleModal.querySelector('.modal-title')
    var modalBodyInput = articleModal.querySelector('.modal-text')
    var modalUrl = articleModal.querySelector('.url')

    modalUrl.attributes.href.value = url;
    modalTitle.textContent = title;
    $(modalBodyInput).html(content)
});