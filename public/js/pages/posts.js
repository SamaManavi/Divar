import {bookmarkHandler, getNote, getSinglePost, renderBreadcrumb} from "../function/posts.js";
import {baseUrl, calculateTimePassed, getFromSearchParam, getToken} from "../function/utils.js";
import {renderSwalCallInfo} from "../function/shared.js";
import {isLogin, loginModal} from "../function/auth.js";


window.addEventListener("load", async () => {

    const loader = document.querySelector("#loader");
    const postTitle = document.querySelector("#postTitle");
    const postTimeLocation = document.querySelector("#postTimeLocation");
    const description = document.querySelector("#description");
    const breadcrumbContainer = document.querySelector("#breadcrumbContainer");
    const shareIcon = document.querySelector("#shareIcon");
    const postFieldContainer = document.querySelector("#postFieldContainer");
    const noteTextArea = document.querySelector("#noteTextArea");
    const callInfoBtn = document.querySelector("#callInfo");
    const trashIcon = document.querySelector("#trashIcon");
    const bookmarkContainerMobi = document.querySelector("#bookmarkContainerMobi");
    const bookmarkContainerDesk = document.querySelector("#bookmarkContainerDesk");
    const postPhotosContainerLaptop = document.querySelector("#postPhotosContainerLaptop");
    const postPhotosContainerThumbs = document.querySelector(".postPhotosContainerThumbs");
    const postPhotosContainerMain = document.querySelector(".postPhotosContainerMain");

    const postId = getFromSearchParam("id");

    const singlePost = await getSinglePost(postId);
    const post = singlePost.data.post;
    let noteId = post?.note?._id;
    let isBookmarked = post?.bookmarked;

    if (!post) return;

    loader.classList.add("hidden");

    const data = calculateTimePassed(post.createdAt);

    postTitle.innerHTML = `${post.title}`;
    description.innerHTML = `${post.description}`;
    postTimeLocation.innerHTML = `${data} در ${post.city.name} . ${post?.neighborhood?.name}`

    //breadcrumb
    renderBreadcrumb(post.breadcrumbs, post.title, breadcrumbContainer);

    //share
    shareIcon.addEventListener("click", async () => {
        await navigator.share(location.href);
    });

    //dynamicPostFields
    post.dynamicFields.forEach((field) => {

        postFieldContainer.insertAdjacentHTML("beforeend", `
            <li>
                <span class="text-sm font-bold">${field.name}</span>
                <span class="text-primary">${typeof field.data === 'boolean' ? field.data === true ? 'دارد' : 'ندارد' : field.data}</span>
            </li>
        `);

    });

    //call info
    callInfoBtn.addEventListener("click", async () => {

        if (await isLogin()) {

            renderSwalCallInfo();

        } else {

            loginModal();
        }
    });

    // note
    noteTextArea.addEventListener("click", async () => {

        if (await isLogin()) {

            // handle trash
            noteTextArea.addEventListener("keyup", () => {

                if (noteTextArea.value.trim().length) {

                    trashIcon.classList.remove("hidden");

                } else {

                    trashIcon.classList.add("hidden");
                }
            });

            noteTextArea.addEventListener("blur", async (event) => {

                if (noteId) {

                    const response = await fetch(`${baseUrl}/v1/note/${noteId}`, {

                        method: "PUT", headers: {
                            "Content-Type": "application/json", Authorization: `Bearer ${getToken()}`

                        }, body: JSON.stringify({

                            content: noteTextArea.value.trim(),
                        })
                    });

                } else {

                    if (noteTextArea.value.trim() === "") return;
                    const response = await fetch(`${baseUrl}/v1/note/`, {

                        method: "POST", headers: {
                            "Content-Type": "application/json", Authorization: `Bearer ${getToken()}`

                        }, body: JSON.stringify({

                            postId: postId, content: noteTextArea.value.trim(),
                        })
                    });
                    noteId = (await response.json()).data.note._id;
                }
            });

        } else {

            loginModal();
        }
    });

    // show note if exist
    if (post.note?.content) {

        noteTextArea.innerHTML = post.note.content
        trashIcon.classList.remove("hidden");
    }

    //delete note
    trashIcon.addEventListener("mousedown", async (event) => {

        event.preventDefault();
        if (noteId) {

            const response = await fetch(`${baseUrl}/v1/note/${noteId}`, {

                method: "DELETE", headers: {
                    Authorization: `Bearer ${getToken()}`
                },
            });
            noteId = null;
        }

        noteTextArea.value = "";
        trashIcon.classList.add("hidden");
    });

    //bookmark

    // desk
    if (isBookmarked) {

        bookmarkContainerDesk.innerHTML = `<svg class="size-5">
                        <use href="#bookmark-solid"></use>
                    </svg>`
        bookmarkContainerMobi.innerHTML = `<svg class="size-5">
                        <use href="#bookmark-solid"></use>
                    </svg>`

    } else {

        bookmarkContainerDesk.innerHTML = `<svg class="size-5">
                        <use href="#bookmark"></use>
                    </svg>`
        bookmarkContainerMobi.innerHTML = `<svg class="size-5">
                        <use href="#bookmark"></use>
                    </svg>`
    }

    bookmarkContainerDesk.addEventListener("click", () => {

        if (isLogin()) {

            if (isBookmarked) {

                const response = bookmarkHandler(postId, "remove");
                if (response) {

                    isBookmarked = false;
                    bookmarkContainerDesk.innerHTML = `<svg class="size-5">
                        <use href="#bookmark"></use>
                    </svg>`
                }

            } else {

                const response = bookmarkHandler(postId, "add");
                if (response) {

                    isBookmarked = true;
                    bookmarkContainerDesk.innerHTML = `<svg class="size-5">
                        <use href="#bookmark-solid"></use>
                    </svg>`
                }
            }
        }
    });

    bookmarkContainerMobi.addEventListener("click", () => {

        if (isLogin()) {

            if (isBookmarked) {

                const response = bookmarkHandler(postId, "remove");
                if (response) {

                    isBookmarked = false;
                    bookmarkContainerMobi.innerHTML = `<svg class="size-5">
                        <use href="#bookmark"></use>
                    </svg>`

                }

            } else {

                const response = bookmarkHandler(postId, "add");
                if (response) {

                    isBookmarked = true;
                    bookmarkContainerMobi.innerHTML = `<svg class="size-5">
                        <use href="#bookmark-solid"></use>
                    </svg>`
                }
            }
        }
    });

    //image slider

    if (post.pics.length) {

        post.pics.forEach((pic) => {

            postPhotosContainerThumbs.insertAdjacentHTML("beforeend", `
            
                <div class="swiper-slide !h-17 cursor-pointer swiper-slide-visible swiper-slide-fully-visible swiper-slide-active swiper-slide-thumb-active" role="group" aria-label="1 / 1" style="width: 67.6667px; margin-left: 10px;">
                    <img src="${baseUrl}/${pic.path}" class="w-full h-full object-cover rounded" alt="post pic">
                </div>
            `);

            postPhotosContainerMain.insertAdjacentHTML("beforeend", `
            
                 <div class="swiper-slide swiper-slide-active" role="group" aria-label="1 / 1"
                                 style="width: 456px; margin-left: 10px;">
                    <img src="${baseUrl}/${pic.path}"
                                     class="w-full h-full object-cover" alt="post pic">
                 </div>
            `);
        });


    } else {

        postPhotosContainerLaptop.classList.add("hidden");
    }

    // اسلایدر بندانگشتی (پایینی)
    const thumbsSwiper = new Swiper('.postPhotosThumbsSwiper', {
        spaceBetween: 10, slidesPerView: 'auto', freeMode: true, watchSlidesProgress: true, direction: 'horizontal',
    });

// اسلایدر اصلی (بالایی)
    const mainSwiper = new Swiper('.postPhotosMainSwiper', {
        spaceBetween: 10, direction: 'horizontal', navigation: {
            nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev',
        }, thumbs: {
            swiper: thumbsSwiper, // اتصال بندانگشتی‌ها به اسلایدر اصلی
        },
    });


});


