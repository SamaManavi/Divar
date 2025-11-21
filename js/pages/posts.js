import {getSinglePost, renderBreadcrumb} from "../function/posts.js";
import {calculateTimePassed, isLogin} from "../function/utils.js";
import {renderSwalCallInfo} from "../function/shared.js";
import {loginModal} from "../function/auth.js";


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

    const singlePost = await getSinglePost();
    const post = singlePost.data.post;


    if (post) {

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
                <span class="text-primary">${field.data}</span>
            </li>
            `);

        });

        //call info
        callInfoBtn.addEventListener("click", () => {

            if (isLogin) {

                renderSwalCallInfo();

            } else {

                loginModal();
            }
        });

        // note
        noteTextArea.addEventListener("click", () => {

            if (isLogin) {

                noteTextArea.addEventListener("keyup", () => {

                    if (noteTextArea.value.trim().length) {

                        trashIcon.classList.remove("hidden");

                    } else {

                        trashIcon.classList.add("hidden");
                    }
                });

            } else {

                loginModal();
            }
        });

    }
});


