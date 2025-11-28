import {deletePostBookmarked, getBookmarks, renderBookmarkedCard} from "../../function/myDivar.js";

const myBookmarksContainer = document.querySelector("#myBookmarksContainer");
const loader = document.querySelector("#loader");


let posts = (await getBookmarks()).posts;
const pagination = (await getBookmarks()).pagination;


// console.log(pagination)

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
                renderBookmarkedCard((await getBookmarks()).posts, myBookmarksContainer);
                loader.classList.add("hidden");
            }
        });
    }
});



