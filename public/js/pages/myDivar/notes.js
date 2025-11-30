import {deleteNote, getBookmarks, getNotes, renderBookmarkedCard, renderNoteCard} from "../../function/myDivar.js";

const myNotesContainer = document.querySelector("#myNotesContainer");
const loader = document.querySelector("#loader");
const miniLoader = document.querySelector("#miniLoader");


let notesInfo = await getNotes(1);
let posts = notesInfo.posts;
let pagination = notesInfo.pagination;

// show bookmarks
renderNoteCard(posts, myNotesContainer);
loader.classList.add("hidden");

// delete bookmarks
myNotesContainer.addEventListener("click", (event) => {

    const deleteBtn = event.target.closest(".postNoteDelete ");

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
                await deleteNote(deleteBtn.id);
                location.reload();
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

        const data = await getNotes(currentPage);

        currentPage = +data.pagination.page + 1;
        totalPages = data.pagination.totalPages;

        renderNoteCard(data.posts, myNotesContainer);

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
