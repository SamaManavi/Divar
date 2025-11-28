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
            <li data-adrs="my-divar/note.html" class="menuOptionLogin">
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
            <li class="menuOptionLogin">
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

    const response = await fetch(`${baseUrl}/v1/user/bookmarks?page=${page}&limit=8`, {

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
                    <div class="image"> 
                    ${post.pics.length ? `
                        <img src="${baseUrl}/${post.pics[0].path}" alt="">
                    ` : `
                        <div class="w-full flex items-center justify-center bg-stone-900/40">
                            <img src="../images/no-camera.png" alt="">
                        </div>
                    `}  
                              
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
const getNotes = async () => {

    const response = await fetch(`${baseUrl}/v1/user/notes`, {

        headers: {Authorization: `Bearer ${getToken()}`},
    });
    return (await response.json()).data;
}

const renderNoteCard = (posts, myNotesContainer) => {

    const noNote = document.querySelector("#noNote");

    if (posts.length) {

        myNotesContainer.innerHTML = "";

        noNote.classList.add("hidden")

        posts.forEach((note) => {

            myNotesContainer.insertAdjacentHTML("beforeend", `
                
        `)
        });

    } else {

        noNote.classList.remove("hidden")
    }
}

export {renderModal, getBookmarks, deletePostBookmarked, renderBookmarkedCard, renderNoteCard, getNotes}

