import {baseUrl, calculateTimePassed, getFromLocalStorage, getFromSearchParam, getToken} from "./utils.js";

const getPosts = async (page) => {

    const citiesLocalStorage = getFromLocalStorage("city");
    const cityId = citiesLocalStorage.map((city) => city.id).join("|");

    const categoryId = getFromSearchParam("categoryID");
    const searchValue = getFromSearchParam("search");
    const exchange = getFromSearchParam("exchange");
    const maxPrice = getFromSearchParam("maxPrice");
    const minPrice = getFromSearchParam("minPrice");

    let url = `${baseUrl}/v1/post/?city=${cityId}&page=${page}&limit=20`;

    if (categoryId) {

        url += `&categoryId=${categoryId}`;
    }

    if (searchValue) {

        url += `&search=${searchValue}`;
    }

    if (exchange) {

        url += `&exchange=${exchange}`;
    }

    if (minPrice || maxPrice) {

        url += `&price=${minPrice}-${maxPrice}`;
    }

    const response = await fetch(`${url}`);

    return await response.json();
}
const showPosts = (posts, postsContainer) => {

    if (posts.length) {

        posts.forEach((post) => {

            postsContainer.insertAdjacentHTML("beforeend", `
                    <div id="${post._id}" class="singlePost flex justify-between gap-x-4 h-42 rounded border border-secondary/50 p-3">
                        <div class="flex flex-col justify-between">
                        <span class="text-base text-primary line-clamp-2">${post.title}</span>
                        <div class="flex flex-col gap-y-2">
                            <span class="text-xs">${post.price === 0 ? 'توافقی' : post.price.toLocaleString()}</span>
                            <span class="text-xs line-clamp-1">${post.dynamicFields[0].data}</span>
                            <div class="flex gap-x-1">
                                <span class="text-xs text-red">${calculateTimePassed(post.createdAt.slice(0, 10))}</span>
                                <span class="text-xs">در${post.city.name}</span>
                                <span class="text-xs">,${post.neighborhood.name}</span>
                            </div>
                        </div>
                    </div>

                        <div class="relative size-34 shrink-0">
                        <img src="${post.pics.length === 0 ? './images/no-image.png' : `${baseUrl}/${post.pics[0].path}`}" class="rounded w-full h-full">
                       
                    </div>
                    </div>
                `);

        });

    } else {
        postsContainer.insertAdjacentHTML("beforeend", `
            <h3 class="text-red text-xl lg:text-2xl">آگهی یافت نشد</h3>
        `)
    }
}
const getSinglePost = async (postId) => {

    const headers = {};

    if (getToken()) {

        headers.Authorization = `Bearer ${getToken()}`;
    }
    const response = await fetch(`${baseUrl}/v1/post/${postId}`, {

        headers,
    });
    return await response.json();
}
const renderBreadcrumb = (breadcrumbs, title, breadcrumbContainer) => {

    breadcrumbContainer.innerHTML = "";

    breadcrumbContainer.insertAdjacentHTML("beforeend", `
        <li>
            <a class="flex items-center gap-x-1.5 group hover:text-primary cursor-pointer">
                ${breadcrumbs.category.title}
                <svg class="size-5 rotate-90 group-hover:rotate-270 transition-all duration-300">
                                    <use href="#chevron-down"></use>
                                </svg>
            </a>
        </li>
        <li>
            <a class="flex items-center gap-x-1.5 group hover:text-primary cursor-pointer">
                ${breadcrumbs.subCategory.title}
                <svg class="size-5 rotate-90 group-hover:rotate-270 transition-all duration-300">
                                    <use href="#chevron-down"></use>
                                </svg>
            </a>
        </li>
        <li class="">
            <a class="flex items-center gap-x-1.5 group hover:text-primary cursor-pointer">
                ${breadcrumbs.subSubCategory.title}
                <svg class="size-5 rotate-90 group-hover:rotate-270 transition-all duration-300">
                                    <use href="#chevron-down"></use>
                                </svg>
            </a>
        </li>
        <li class="max-md:hidden text-secondary/50">${title}</li>    
    `)
}
const getNote = async (noteId) => {

    const response = await fetch(`${baseUrl}/v1/note/${noteId}`, {
        headers: {Authorization: `Bearer ${getToken()}`}
    })
    return await response.json();
}
const bookmarkHandler = async (postId, action) => {

    let response = null;

    if (action === "add") {

        response = await fetch(`${baseUrl}/v1/bookmark/${postId}`, {
            method: "POST",
            headers: {Authorization: `Bearer ${getToken()}`}
        });

        return response.ok;

    } else if (action === "remove") {

        response = await fetch(`${baseUrl}/v1/bookmark/${postId}`, {
            method: "DELETE",
            headers: {Authorization: `Bearer ${getToken()}`}
        });

        return response.ok;
    }
}


export {getPosts, showPosts, getSinglePost, renderBreadcrumb, getNote, bookmarkHandler}

