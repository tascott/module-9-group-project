



searchButton.on('click', function (e) {
    // get the value of the input field
    var searchValue = searchBox.val();
    console.log(searchValue);

    //uncomment after first result
    getRelatedWordsFromLocalStorage(searchValue);

    //comment out after first result
    // getRelatedWords(searchValue);
});

