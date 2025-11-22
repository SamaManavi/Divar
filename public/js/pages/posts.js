import {getNote, getSinglePost, renderBreadcrumb} from "../function/posts.js";
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

    const postId = getFromSearchParam("id");

    const singlePost = await getSinglePost(postId);
    const post = singlePost.data.post;
    let noteId = post?.note._id;

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
                <span class="text-primary">${field.data}</span>
            </li>
            `);

    });

    //call info
    callInfoBtn.addEventListener("click", () => {

        if (isLogin()) {

            renderSwalCallInfo();

        } else {

            loginModal();
        }
    });

    // note
    noteTextArea.addEventListener("click", () => {

        if (isLogin()) {

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
    if (post.note.content) {

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
});


