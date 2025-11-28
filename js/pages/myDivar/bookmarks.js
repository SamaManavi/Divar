import {deletePostBookmarked, getBookmarks, renderBookmarkedCard} from "../../function/myDivar.js";

const myBookmarksContainer = document.querySelector("#myBookmarksContainer");
const loader = document.querySelector("#loader");
const miniLoader = document.querySelector(".miniLoader");


let bookmarksInfo = await getBookmarks(1);
let posts = bookmarksInfo.posts;
let pagination = bookmarksInfo.pagination;

// show bookmarks
renderBookmarkedCard(posts, myBookmarksContainer);
loader.classList.add("hidden");

// delete bookmarks
myBookmarksContainer.addEventListener("click", (event) => {

    const deleteBtn = event.target.closest(".deleteBookmark");

    if (deleteBtn) {

        Swal.fire({
            title: "آیا از حذف این نشان مطمئن هستید؟",
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'خیر',
            showConfirmButton: true,
            confirmButtonText: 'بله',
            reverseButtons: true,
            customClass: {
                popup: '!bg-bgGray',
                title: '!text-xl !text-white',
                confirmButton: '!bg-red !text-white !px-8 !py-2.5',
                cancelButton: '!bg-transparent !border !border-secondary !text-secondary !px-8 !py-2'
            }
        }).then(async (result) => {

            if (result.isConfirmed) {

                loader.classList.remove("hidden");
                await deletePostBookmarked(deleteBtn.id);
                renderBookmarkedCard((await getBookmarks(1)).posts, myBookmarksContainer);
                location.reload();
                loader.classList.add("hidden");
            }
        });
    }
});


let currentPage = 2;
let totalPages = pagination.totalPages;
let isLoading = false;


const loadMore = async () => {

    if (isLoading || currentPage > totalPages) return;

    isLoading = true;
    miniLoader.classList.remove("hidden");

    try {

        const data = await getBookmarks(currentPage);

        currentPage = +data.pagination.page + 1;
        totalPages = data.pagination.totalPages;

        renderBookmarkedCard(data.posts, myBookmarksContainer);

    } catch (e) {
        console.log(e);
    }

    miniLoader.classList.add("hidden");
    isLoading = false;
}

window.addEventListener("scroll", async () => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
    if (bottom) {
        await loadMore();
    }
});
