import {getSinglePost} from "../function/posts.js";
import {calculateTimePassed} from "../function/utils.js";


window.addEventListener("load", async () => {

    const loader = document.querySelector("#loader");
    const postTitle = document.querySelector("#postTitle");
    const postTimeLocation = document.querySelector("#postTimeLocation");
    const description = document.querySelector("#description");


    const singlePost = await getSinglePost();
    const post = singlePost.data.post;

    if (post) {

        loader.classList.add("hidden");

        const data = calculateTimePassed(post.createdAt);

        postTitle.innerHTML = `${post.title}`;
        description.innerHTML = `${post.description}`;
        postTimeLocation.innerHTML = `${data} در ${post.city.name} . ${post?.neighborhood?.name}`


    }
});