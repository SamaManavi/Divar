import {getFromLocalStorage} from "../function/utils.js";
import {getPosts, showPosts} from "../function/main.js";

const loader = document.querySelector("#loader");
const postsContainer = document.querySelector("#posts-container")


window.addEventListener("load", async () => {

    // root protection
    if (getFromLocalStorage("city")) {

        loader.classList.add("hidden");

        // get and show posts
        const posts = await getPosts();
        showPosts(posts.data.posts, postsContainer);



    } else {

        loader.classList.remove("hidden");
    }


});
