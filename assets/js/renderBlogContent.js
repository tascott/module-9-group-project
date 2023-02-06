let userData = {
    "exampleContent": true,
    "time": null,
    "topics": [],
    "location": {
        "from": null,
        "to": null
    },
    "transport": "public",
    "stored_news": [],
    "stored_sports": [],
    "stored_videos": [],
    "stored_blogs": []
}

let newsDiv = $('#news-results');
let videoDiv = $('#video-results');
let blogDiv = $('#blog-results');
let articleModal = document.getElementById('article-modal');
let storedBlogPostIds = JSON.parse(localStorage.getItem('stored_blog_feed_ids')).topfeeds;
let storedBlogPostContent = localStorage.getItem('stored_blog_feed_content');
let topic = JSON.parse(localStorage.getItem('interest_keywords'))[0];

// Get content from Medium API and save to local storage, use the first word of the users search query as the topic

// If stored blogposts is empty, get content from Medium API
let callMediumAPI = function () {
    if (!storedBlogPostIds) {
        console.log('no stored blog posts')
        let getMediumFeedList = function (topic) {
            console.log('topic:', topic)
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': mediumAPIKey,
                    'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
                }
            };

            fetch(`https://medium2.p.rapidapi.com/topfeeds/${topic}/hot`, options)
                .then(response => response.json())
                .then(response => {
                    localStorage.setItem('stored_blog_feed_ids', JSON.stringify(response));
                    getMediumArticleContent();
                })
                .catch(err => console.error(err));
        }
        getMediumFeedList(topic);
    } else {
        console.log('got stored blog posts IDs')
    }

    if (storedBlogPostIds && !storedBlogPostContent) {
        console.log('IDs but no stored blog post content')

        // shortern storedBlogPostIds to 3
        storedBlogPostIds = storedBlogPostIds.slice(0, 3);
        let tempData = [];

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': mediumAPIKey,
                'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
            }
        };

        storedBlogPostIds.forEach(function (id, i) {
            fetch(`https://medium2.p.rapidapi.com/article/${id}`, options)
                .then(response => response.json())
                .then(function (response) {
                    let allData = {};
                    allData['article'] = response;

                    fetch(`https://medium2.p.rapidapi.com/article/${id}/content`, options)
                        .then(response => response.json())
                        .then(function (response) {
                            allData['content'] = response;
                            tempData.push(allData);
                            renderBlogItem(allData);
                        })
                        .catch(err => console.error(err));
                })
                .catch(err => console.error(err));
            });
        }
}
 function renderBlogItem(data) {
     console.log(data)
    //  let time = userData.time;
     html = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${blog.title}</h5>
                <p class="card-text">By ${blog.author}</p>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#article-modal" data-bs-title="${blog.title}" data-bs-author="${blog.author}" data-bs-url="${blog.url}" data-bs-content="${blog.content}">Read Article</button>
            </div>
        </div>
        `

      blogDiv.html(html);
      blogDiv.prepend(`<h2>Blogs</h2><h6>Available offline</h6>`);
 };


// Put blog content in a modal for offline reading

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
    modalBodyInput.textContent = content
    modalAuthor.textContent = author
});