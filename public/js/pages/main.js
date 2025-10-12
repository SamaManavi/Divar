import {getFromLocalStorage} from "../function/utils.js";
import {getCategories, getPosts, showCategories, showPosts} from "../function/main.js";

const loader = document.querySelector("#loader");
const categoriesContainer = document.querySelector("#categories-container");
const postsContainer = document.querySelector("#posts-container")


window.addEventListener("load", async () => {

    // root protection
    if (getFromLocalStorage("city")) {

        loader.classList.add("hidden");

        // get and show posts
        const posts = await getPosts();
        showPosts(posts.data.posts, postsContainer);

        //get and show categories
        const categories = await getCategories();
        await showCategories(categories, categoriesContainer);

    } else {

        loader.classList.remove("hidden");
    }


});
