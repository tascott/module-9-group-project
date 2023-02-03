// Show an indicator that the user is online or offline

window.addEventListener("load", () => {
    hasNetwork(navigator.onLine);

    window.addEventListener("online", () => {
        // Set hasNetwork to online when they change to online.
        hasNetwork(true);
    });

    window.addEventListener("offline", () => {
        // Set hasNetwork to offline when they change to offline.
        hasNetwork(false);
    });
});


function hasNetwork(online) {
    const element = $(".status");
    // Update the DOM to reflect the current status
    if (online) {
        let html = `<i class="bi bi-circle-fill"></i> Online`;
        element.removeClass("offline");
        element.addClass("online");
        element.html(html);
        $('.results-row').removeClass('offline');
    } else {
        let html = `<i class="bi bi-circle-fill"></i> Offline`;
        element.removeClass("online");
        element.addClass("offline");
        element.html(html);
         $('.results-row').addClass('offline');
    }
}


// Get content from Medium API and save to local storage
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': mediumAPIKey,
        'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
    }
};

// fetch('https://medium2.p.rapidapi.com/topfeeds/technology/hot', options)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));

// let examplePosts = [
//             "2ae39662391b",
//             "86e6818a050d",
//             "3fb1cb3c2b5e",
//             "55db62c1ae66",
//             "f706555bf3d0",
//             "32518b8143bd",
//             "2656c726104f",
//             "92a3ab9d39",
//             "9f2a1cfab0e9",
//             "4f3618876a2c",
//             "a31a3d39b93e",
//             "8e6c2746774d",
//             "af9d33998240",
//             "55bbe8379003",
//             "40440c35cbf3",
//             "476a67f53a59",
//             "e846014e9fc0",
//             "f7ca3ac3c28",
//             "f26acc2a5841",
//             "a7bf565db2a0",
//             "7b38166b7708",
//             "1bc57ad3dd07",
//             "317c992c2a30",
//             "6a36b5ab4d4a"
// ];

let examplePosts2 = [
    "2ae39662391b",
    "86e6818a050d",
]

// for each post, get the content
// examplePosts2.forEach(function (post) {
//     fetch(`https://medium2.p.rapidapi.com/article/${post}/content`, options)
//         .then(response => response.json())
//         .then(function (response) {
//             localStorage.setItem(post, JSON.stringify(response));
//         })
//         .catch(err => console.error(err));
// });

// Get an articles content
// fetch(`https://medium2.p.rapidapi.com/article/${articleID}/content`, options)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));


let newsDiv = $('#news-results');
let videoDiv = $('#video-results');
let blogDiv = $('#blog-results');
let exampleData = {
    "journeyTime": 45,
    "tags": [
        "technology",
        "science",
        "health"
    ],
    "articles": [
        {
            title: "Example title 1",
            description: "Example description 1",
            url: "https://www.example.com"
        },
        {
            title: "Example title 2",
            description: "Example description 2",
            url: "https://www.example.com"
        },
        {
            title: "Example title 3",
            description: "Example description 3",
            url: "https://www.example.com"
        },
    ],
    "videos": [
        {
            title: "Example title",
            id: "bMLbnsKGRfo"
        },
        {
            title: "Example title 2",
            id: "yi-h5hNzTVw"
        },
    ],
    "blogs": [
        {
            title: "Example title 1",
            author: "Example author 1",
            url: "https://www.example.com",
            content: "Example content 1"
        },
        {
            title: "Example title 2",
            author: "Example author 2",
            url: "https://www.example.com",
            content: "Example content 2"
        },
    ]
}
let searchTerm = 'iphone'; // this will be the user's search term which is saved to local storage and the object above

// fetch from youtube api
// fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${searchTerm}&type=video&key=${gmaps_api_key}`)
//     .then(response => response.json())
//     .then(function (response) {
//         console.log(response);
//     });

//this embeds the youtube video, no api needed for this part

let embeddedYouTubeHTML = function (id) {
    return `<iframe width="360" height="" src="https://www.youtube.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
};


function renderContent(data) {
    // Below variable will change to the time the user selects (from local storage)
    $('.results-row').prepend(`<h2 class="journey-time">Your results for a ${exampleData.journeyTime} minute journey</h2><h6 class="tags">Your tags:</h6><h5 class="status"></h5><br>`);
    // make pill tags for each tag
    exampleData.tags.forEach(function (tag) {
         $('.tags').append(`<span class="badge bg-primary-dark" style="width: fit-content">${tag}</span>`)
     });
    let html = '';
    data.articles.forEach(function (article) {
        html += `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description}</p>
                <a href="${article.url}" class="btn btn-primary">Read More</a>
            </div>
        </div>
        `
    });
    newsDiv.html(html);
    newsDiv.prepend(`<h2>News</h2>`);

    // render videos
    html = '';
    data.videos.forEach(function (video) {
        html += embeddedYouTubeHTML(video.id);
    });
    videoDiv.html(html);
    videoDiv.prepend(`<h2>Videos</h2>`);
    //render blogs
    html = '';
    data.blogs.forEach(function (blog) {
        blog.content = JSON.parse(localStorage.getItem('86e6818a050d')).content;
        html += `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${blog.title}</h5>
                <p class="card-text">By ${blog.author}</p>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#article-modal" data-bs-title="${blog.title}" data-bs-author="${blog.author}" data-bs-url="${blog.url}" data-bs-content="${blog.content}">Read Article</button>
            </div>
        </div>
        `
    });
    blogDiv.html(html);
    blogDiv.prepend(`<h2>Blogs</h2><h6>Available offline</h6>`);
}

renderContent(exampleData);

var articleModal = document.getElementById('article-modal')
articleModal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = event.relatedTarget
    // Extract info from data-bs-* attributes
    var title = button.getAttribute('data-bs-title')
    var content = button.getAttribute('data-bs-content')
    var author = button.getAttribute('data-bs-author')
    var url = button.getAttribute('data-bs-url')
    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.

    var modalTitle = articleModal.querySelector('.modal-title')
    var modalBodyInput = articleModal.querySelector('.modal-text')
    var modalUrl = articleModal.querySelector('.url')
    var modalAuthor = articleModal.querySelector('.author')

    modalUrl.attributes.href.value = url;
    modalTitle.textContent = title;
    $(modalBodyInput).html(content.replace(/(?:\r\n|\r|\n)/g, '<br>'));
    modalAuthor.textContent = author
})