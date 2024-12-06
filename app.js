const form = document.getElementById("form");
const laneWrapper = document.getElementById("laneWrapper");
const addSubreddit = document.getElementById("addSubreddit");
const addSubredditBtn = document.getElementById("addSubredditButton");
const closePopup = document.getElementById("closeButton");
const addLane = document.getElementById("addSubredditButton");
const userInput = document.getElementById("input");
const deleteAll = document.querySelector(".delete");
const refresh = document.querySelector(".refresh");

//display pop-up box to input and add subreddit
addSubreddit.addEventListener("click", () => {
    form.style.display = "grid"
});
closePopup.addEventListener("click", () => {
    form.style.display = "none"
});

addLane.addEventListener("click", () => {
    form.style.display = "none"
} );

//get input from user
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const subreddit = event.target.elements.subreddit.value.trim();
    if(subreddit) {
        createLane(subreddit);
        userInput.value = "";
    }
});

// create lane from user input
function createLane(subreddit) {
    const lane = document.createElement("div");
    lane.classList.add("lane");
    lane.dataset.subreddit = subreddit;
    lane.innerHTML = `<div>${subreddit}</div><button class="reddit-close-btn" id="closeLaneBtn">X</button><div class="loading">Loading...</div>`;    
    laneWrapper.appendChild(lane);

    lane.addEventListener("click", (e) => {
        if(e.target.className === "reddit-close-btn") {
            e.target.parentElement.remove();
        }
    });

    fetchPosts(subreddit, lane);
}

//get data from reddit url via fetch API call
async function fetchPosts(subreddit, lane) {
    try {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
        if(!response.ok) {
            const errorLane = document.createElement("div");
            errorLane.classList.add("lane");
            errorLane.dataset.subreddit = subreddit;
            errorLane.innerHTML = `<div>${subreddit}</div><button class="reddit-close-btn" id="closeLaneBtn">X</button><div style="color: red;"> Sorry, this subreddit could not be found.</div>`;   
            laneWrapper.removeChild(lane);
            laneWrapper.appendChild(errorLane);

            errorLane.addEventListener("click", (e) => {
                if(e.target.className === "reddit-close-btn") {
                    e.target.parentElement.remove();
                }
            });
        }
        laneWrapper.removeChild(lane);
        const data = await response.json();
        const posts = data.data.children;

        for(let post of posts ) {
            const postLane = document.createElement("div");
            postLane.classList.add("lane");
            postLane.id = "lane";
            postLane.dataset.subreddit = subreddit;
            postLane.innerHTML = `<div class="title">${post.data.title}</div><button class="reddit-close-btn" id="closeLaneBtn">X</button><div>${post.data.author}</div><div>likes:${post.data.ups}</div>`;              
            laneWrapper.appendChild(postLane); 
            
            postLane.addEventListener("click", (e) => {
                if(e.target.className === "reddit-close-btn") {
                    e.target.parentElement.remove();
                }
            });
        }
    } catch (error) {
        // alert("Error loading page!");
        return [];
    }   
}

deleteAll.addEventListener("click", () => {
    laneWrapper.innerHTML = "";
});

refresh.addEventListener("click", () => {
        const refresh = [];
        const lanePost = laneWrapper.querySelectorAll(".lane");
        lanePost.forEach(lanePost => {
            refresh.push(lanePost?.dataset.subreddit);
            laneWrapper.innerHTML = "";

            let refreshNew = new Set(refresh);
            let updated = [...refreshNew]
            console.log(updated);
        
            updated.forEach(subreddit => {
                createLane(subreddit);
             });
        });

    });