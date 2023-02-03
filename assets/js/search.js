// THIS IS THE ONLY SCRIPT FOR SEARCHING.accordion
let interests = [];
let interestContainer = $('#suggestion-results');


// google maps 


$('#search-button').click(function(){
    let topicVal = $('#suggestion-text').val()
    let startVal = $('#destination-start').val()
    let endVal = $('#destination-end').val()
    let timeVal = $('#search-by-time-input').val()
    let transportVal = $('#transport-form').children('input:checked').attr('id')

    
    console.log(transportVal)
    console.log(timeVal)
    console.log(endVal)
    console.log(startVal)
    console.log(topicVal)

    //uncomment after first result
     getRelatedWordsFromLocalStorage(topicVal);

    //comment out after first result
    //getRelatedWords(topicVal);


    

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
    console.log(interests);
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