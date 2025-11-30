import {getFromLocalStorage} from "../../function/utils.js";
import {getSinglePost, showPosts} from "../../function/posts.js";

const myRecentContainer = document.querySelector("#myRecentContainer");

let recent = getFromLocalStorage("recents");

async function loadRecentPosts() {
    const posts = await Promise.all(
        recent.map(async id => {
            const res = await getSinglePost(id);
            return res.data.post;
        })
    );

    showPosts(posts.reverse() ,myRecentContainer );
}

await loadRecentPosts();
