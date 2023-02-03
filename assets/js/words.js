let interests = [];
let interestContainer = $('#suggestion-results');
let searchButton = $('#suggestion-button');
let searchBox = $('#suggestion-text');

function getRelatedWords(searchValue) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': words_api_key,
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    };

    //other options: pertainsTo hasTypes similarTo synonyms
    //get synonyms for this word
    fetch('https://wordsapiv1.p.rapidapi.com/words/' + searchValue + '/hasTypes', options)
        .then(response => response.json())
        .then(function (response) {
            console.log(response)
            interests = response.hasTypes.sort(() => Math.random() - 0.5).slice(0, 5);
            localStorage.setItem('interests', JSON.stringify(interests));
            renderSuggestedResponses();
        })
        .catch(err => console.error(err));
}

function getRelatedWordsFromLocalStorage(searchValue) {
    interests = JSON.parse(localStorage.getItem('interests'));
    renderSuggestedResponses();
}

searchButton.on('click', function (e) {
    e.preventDefault();
    // get the value of the input field
    var searchValue = searchBox.val();
    console.log(searchValue);

    //uncomment after first result
    getRelatedWordsFromLocalStorage(searchValue);

    //comment out after first result
    // getRelatedWords(searchValue);
});

renderSuggestedResponses = function () {
    console.log(interests);
    interestContainer.empty();
    interests.forEach(function (interest) {
        interestContainer.append(`<div data-interest="${interest}"><span class="badge badge-pill badge-primary">${interest}</span></div>`);
    });
}