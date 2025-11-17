import {baseUrl, calculateTimePassed, getFromLocalStorage, getFromSearchParam} from "./utils.js";


const postId = getFromSearchParam("id");
const getPosts = async () => {

    const citiesLocalStorage = getFromLocalStorage("city");
    const cityId = citiesLocalStorage.map((city) => city.id).join("|");

    const categoryId = getFromSearchParam("categoryID");
    const searchValue = getFromSearchParam("search");
    const exchange = getFromSearchParam("exchange");
    const maxPrice = getFromSearchParam("maxPrice");
    const minPrice = getFromSearchParam("minPrice");

    let url = `${baseUrl}/v1/post/?city=${cityId}&limit=100`;

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

        postsContainer.innerHTML = "";

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
                        <svg class="absolute size-5 top-1 left-1 text-black">
                            <use href="#bookmark"></use>
                        </svg>
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
const getSinglePost = async () => {

    const response = await fetch(`${baseUrl}/v1/post/${postId}`);
    return await response.json();
}



export {getPosts, showPosts, getSinglePost}