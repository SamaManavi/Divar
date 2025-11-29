import {getAllUsersPosts, getNotes, renderPostsCard} from "../../function/myDivar.js";


const myPostsContainer = document.querySelector("#myPostsContainer");
const loader = document.querySelector("#loader");
const postSortContainer = document.querySelector("#postSortContainer");
const postSorts = document.querySelectorAll(".postSort");


let notesInfo = await getAllUsersPosts();
let posts = notesInfo.posts;


renderPostsCard(posts, myPostsContainer);
loader.classList.add("hidden");


postSortContainer.addEventListener("click", (event) => {

    const postSort = event.target.closest(".postSort");

    if (!postSort) return;

    const filterType = postSort.dataset.sort;

    if (filterType === 'all') {

        renderPostsCard(posts, myPostsContainer)
    } else {

        const filteredPost = posts.filter((post) => post.status === filterType);
        renderPostsCard(filteredPost, myPostsContainer);
    }

    postSorts.forEach((sort) => sort.classList.remove("border-b-3", "text-red"));
    postSort.classList.add("border-b-3", "text-red");
});
