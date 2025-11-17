import {getSinglePost} from "../function/posts.js";


window.addEventListener("load", async () => {

    const loader = document.querySelector("#loader");



    const singlePost = await getSinglePost();
    const post = singlePost.data.post;

    if (post) {

        loader.classList.add("hidden");



    }
});