import {isLogin, loginModal} from "./auth.js";

const myDivarBtnDesk = document.querySelector("#myDivarBtn");
const myDivarModal = document.querySelector("#myDivarModal");

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

// open dropdown
myDivarBtnDesk.addEventListener("click", async (event) => {

    event.stopPropagation();
    myDivarModal.classList.remove("hidden");
    await renderModal(myDivarModal);
});

// close dropdown
document.addEventListener("click", () => {

    myDivarModal.classList.add("hidden");
})

myDivarModal.addEventListener("click", (event) => {

    const menuOption = event.target.closest(".menuOption");
    const menuOptionLogin = event.target.closest(".menuOptionLogin");

    if (menuOption) {
        loginModal();
    }

    if (menuOptionLogin) {

        location.href = `${menuOptionLogin.dataset.adrs}`
    }
});

export {renderModal}

