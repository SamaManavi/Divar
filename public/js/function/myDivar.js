import {isLogin} from "./auth.js";
import {baseUrl, calculateTimePassed, getToken} from "./utils.js";


const renderModal = async (container) => {

    const userInfo = await isLogin();

    container.innerHTML = "";

    if (await isLogin()) {

        container.insertAdjacentHTML("beforeend", `
    
        <ul class="divide-y divide-secondary/10 *:flex *:gap-x-3 *:items-center *:p-2 *:text-sm *:font-bold *:pr-4 *:py-2">
        
            <li class="menuOptionLogin">
                            <svg class="size-4">
                                <use href="#user"></use>
                            </svg>
                            <div class="text-xs">
                                <p>کاربر دیوار</p>
                                <p class="pt-2" id="phoneNumberNavbar">${userInfo.phone}</p>
                            </div>     
                        </li>            
            <li data-adrs="my-divar/verify.html" class="menuOptionLogin">
                            <svg class="size-4">
                                <use href="#shield-check"></use>
                            </svg>
                            <span class="text-xs">تایید حساب کابری</span>
                        </li>
            <li data-adrs="my-divar/posts.html" class="menuOptionLogin">
                <svg class="size-4">
                                <use href="#folder"></use>
                            </svg>
                <span>آگهی های من</span>
            </li>      
            <li data-adrs="my-divar/bookmarks.html" class="menuOptionLogin">
                            <svg class="size-4">
                                <use href="#bookmark"></use>
                            </svg>
                            <span>نشان ها</span>
                        </li>
            <li data-adrs="my-divar/notes.html" class="menuOptionLogin">
                            <svg class="size-4">
                                <use href="#paper"></use>
                            </svg>
                            <span>یادداشت ها</span>
                        </li>
            <li data-adrs="my-divar/recent.html" class="menuOptionLogin">
                <svg class="size-4">
                                <use href="#history"></use>
                            </svg>
                <span>بازدید های اخیر</span>
            </li>
            <li class="menuOptionLogin">
                <svg class="size-4">
                                <use href="#setting"></use>
                            </svg>
                <span>تنظیمات</span>
            </li>
            <li class="Exit">
                <svg class="size-4">
                                <use href="#logout"></use>
                            </svg>
                <div class="text-xs">خروج</div>
            </li>
        </ul>
    `);

    } else {

        container.insertAdjacentHTML("beforeend", `
    
        <ul class="divide-y divide-secondary/10 *:flex *:gap-x-3 *:items-center *:p-2 *:text-sm *:font-bold *:pr-4 *:py-2">
            <li class="menuOption">
                            <svg class="size-4">
                                <use href="#login"></use>
                            </svg>
                            <span>ورود</span>
                        </li>
            <li class="menuOption">
                            <svg class="size-4">
                                <use href="#folder"></use>
                            </svg>
                            <span>آگهی های من</span>
                        </li>
            <li class="menuOption">
                            <svg class="size-4">
                                <use href="#bookmark"></use>
                            </svg>
                            <span>نشان ها</span>
                        </li>
            <li class="menuOption">
                            <svg class="size-4">
                                <use href="#paper"></use>
                            </svg>
                            <span>یادداشت ها</span>
                        </li>
            <li class="menuOption">
                            <svg class="size-4">
                                <use href="#history"></use>
                            </svg>
                            <span>بازدید های اخیر</span>
                        </li>
            <li class="menuOption">
                            <svg class="size-4">
                                <use href="#setting"></use>
                            </svg>
                            <span>تنظیمات</span>
                        </li>
        </ul>
    `);
    }
}
const getBookmarks = async (page) => {

    const response = await fetch(`${baseUrl}/v1/user/bookmarks?page=${page}`, {

        headers: {Authorization: `Bearer ${getToken()}`},
    });
    return (await response.json()).data;
}
const deletePostBookmarked = async (postId) => {

    const response = await fetch(`${baseUrl}/v1/bookmark/${postId}`, {
        method: "DELETE", headers: {Authorization: `Bearer ${getToken()}`},
    });

    if (response.ok) {
        return (await response.json()).data;
    }
}
const renderBookmarkedCard = (posts, myBookmarksContainer) => {

    const noBookmark = document.querySelector("#noBookmark");

    if (posts.length) {

        noBookmark.classList.add("hidden")

        posts.forEach((post) => {

            myBookmarksContainer.insertAdjacentHTML("beforeend", `

            <div class="ad-card">
            <article>
                <a href="../post.html?id=${post._id}" class="content">
                    <div class="info">
                        <h3 class="title">${post.title}</h3>
                        <div class="card-footer">
                            <div class="details">
                                <p>${post.dynamicFields[0].data}</p>
                                <p>${post.price === 0 ? 'توافقی' : `${post.price.toLocaleString()}تومان`}</p>
                            </div>
                            <div class="time-location">
                                <span class="red-text">${calculateTimePassed(post.createdAt)}</span>
                                <span>${post.city.name}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                                        <div class="relative w-34 h-34 flex justify-center"> 
                    ${post.pics.length ? `
                        <img class="shrink-0 size-full" src="${baseUrl}/${post.pics[0].path}" alt="">
                    ` : `
                        <div class="w-full flex items-center justify-center bg-stone-900/40">
                            <img class="shrink-0" src="../images/no-camera.png" alt="">
                        </div>
                    `}  
                              
                    </div>

                </div>
                </a>
                <div class="w-full p-4">
                    <button id="${post._id}" class="deleteBookmark w-full flex items-center justify-center gap-x-2 border border-secondary/50 text-secondary py-2 cursor-pointer hover:bg-secondary/5">
                        <svg class="size-5">
                                    <use href="#trash"></use>
                                </svg>
                        <span class="text-sm">حذف نشان</span>
                    </button>
                </div>
            </article>
        </div>
        `)
        });

    } else {

        noBookmark.classList.remove("hidden")
    }
}
const getNotes = async (page) => {

    const response = await fetch(`${baseUrl}/v1/user/notes?page=${page}`, {

        headers: {Authorization: `Bearer ${getToken()}`},
    });
    return (await response.json()).data;
}
const renderNoteCard = (posts, myNotesContainer) => {

    const noNote = document.querySelector("#noNote");

    if (posts.length) {

        noNote.classList.add("hidden")

        posts.forEach((post) => {

            myNotesContainer.insertAdjacentHTML("beforeend", `
                <article>
                    <div class="relative">
                        <a href="#" class="flex gap-x-4 border border-secondary/20 p-4">
                            <div class="">
                                        <div class="relative w-34 h-34 flex justify-center"> 
                    ${post.pics.length ? `
                        <img class="shrink-0 size-full" src="${baseUrl}/${post.pics[0].path}" alt="">
                    ` : `
                        <div class="w-full flex items-center justify-center bg-stone-900/40">
                            <img class="shrink-0" src="../images/no-camera.png" alt="">
                        </div>
                    `}  
                              
                    </div>

                </div>
                            <div class="flex-1">
                                <h2 class="text-secondary text-xl py-3">${post.title}</h2>
                                <span class="line-clamp-3 leading-[20px] overflow-hidden text-secondary/80 text-xs">
                                ${post.note.content}
                                </span>
                            </div>
                        </a>
                        <div id="${post.note._id}" class="postNoteDelete absolute bottom-4 left-4 cursor-pointer text-secondary hover:text-primary">
                            <svg class="size-5">
                                <use href="#trash"></use>
                            </svg>
                        </div>
                    </div>
                </article>
            `)
        });

    } else {

        noNote.classList.remove("hidden")
    }
}
const deleteNote = async (noteId) => {

    const response = await fetch(`${baseUrl}/v1/note/${noteId}`, {
        method: "DELETE", headers: {Authorization: `Bearer ${getToken()}`},
    });

    if (response.ok) {
        return (await response.json()).data;
    }
}
const getAllUsersPosts = async () => {

    const response = await fetch(`${baseUrl}/v1/user/posts?limit=1000`, {

        headers: {Authorization: `Bearer ${getToken()}`},
    });
    return (await response.json()).data;
}
const renderPostsCard = (posts, myPostsContainer) => {

    const noPost = document.querySelector("#noPost");

    myPostsContainer.innerHTML = "";
    
    if (posts.length) {

        noPost.classList.add("hidden");

        posts.forEach((post) => {
            myPostsContainer.insertAdjacentHTML("beforeend", `
                    <article class="border-b border-secondary/20 p-4">
                        <a href="${post.status === 'published' ? `../post.html?id=${post._id}` : `#`}" class="flex justify-between flex-col lg:flex-row gap-2">
                            <div class="flex items-start gap-x-4">
                                <div class="size-25">
                                    ${post.pics.length ? `
                                            <img class="size-full rounded" src="${baseUrl}/${post.pics[0].path}" alt="">
                                    ` : `
                                            <div class="size-full flex items-center justify-center bg-stone-900/40 rounded">
                                               <img src="../images/no-camera.png" alt="">
                                            </div> 
                                    `}
                                </div>
                                <div class="text-secondary overflow-hidden">
                                    <h1 class="text-ls font-bold py-1">${post.title}</h1>
                                    <p class="text-xs pt-6">${post.price === 0 ? 'توافقی' : post.price.toLocaleString() + ' تومان '}</p>
                                    <span class="text-xs pt-2">${calculateTimePassed(post.createdAt)}</span>
                                    <span class="text-secondary"> در ${post.city.name}, ${post.neighborhood?.name}</span>
                                </div>
                            </div>
                            <div class="flex lg:flex-col justify-between">
                                <div class="flex items-start gap-x-2 pt-1">
                                    <h3 class="text-secondary text-base font-bold">وضعیت آگهی:</h3>
                                    ${post.status === 'published' ? '<span class="text-sm text-green-500 font-bold pt-px">تایید شده</span>' : ''}
                                    ${post.status === 'rejected' ? '<span class="text-sm text-red font-bold pt-px">رد شده</span>' : ''}
                                    ${post.status === 'pending' ? '<span class="text-sm text-orange-400 font-bold pt-px">در صف انتظار</span>' : ''}
                                </div>
                                <div class="flex justify-end">
                                    <button class="h-10 border border-red text-red px-4 rounded cursor-pointer hover:bg-red hover:text-white transition-colors">حذف آگهی</button>
                                </div>
                            </div>
                        </a>
                    </article>
                `)
        })

    } else {

        noPost.classList.remove("hidden")
    }
}


export {
    renderModal,
    getBookmarks,
    deletePostBookmarked,
    renderBookmarkedCard,
    renderNoteCard,
    getNotes,
    deleteNote,
    getAllUsersPosts,
    renderPostsCard
}

