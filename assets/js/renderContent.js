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
            title: "Example title 1",
            url: "https://www.example.com"
        },
        {
            title: "Example title 2",
            url: "https://www.example.com"
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

function renderNews(data) {
    console.log(data)
    let time = 45;
    $('.results-row').prepend(`<h2>Your results for ${time} minute journey</h2>`);
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
        html += `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${video.title}</h5>
                <a href="${video.url}" class="btn btn-primary">Watch</a>
            </div>
        </div>
        `
    });
    videoDiv.html(html);
    videoDiv.prepend(`<h2>Videos</h2>`);
    //render blogs
    html = '';
    data.blogs.forEach(function (blog) {
        blog.content = JSON.parse(localStorage.getItem('86e6818a050d')).content;
        console.log(blog.content);
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

renderNews(exampleData);

var articleModal = document.getElementById('article-modal')
articleModal.addEventListener('show.bs.modal', function (event) {
    document.body.style.overflow = 'hidden';
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
    modalBodyInput.textContent = content
    modalAuthor.textContent = author
})

$(articleModal).on("hidden.bs.modal", function () {
    document.body.style.overflow = 'auto';
});