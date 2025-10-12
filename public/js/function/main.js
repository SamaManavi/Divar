import {baseUrl, getFromLocalStorage, calculateTimePassed} from "./utils.js";

const getPosts = async () => {

    const cityId = getFromLocalStorage("city")[0].id;

    const response = await fetch(`${baseUrl}/v1/post/?city=${cityId}&limit=100`);
    return await response.json();
}

const showPosts = (posts, postsContainer) => {

    if (posts.length) {

        posts.forEach((post) => {

            postsContainer.insertAdjacentHTML("beforeend",
                `
                    <div id="${post._id}" class="flex justify-between gap-x-4 h-42 rounded border border-secondary/50 p-3">
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
                `
            );

        });

    } else {

        postsContainer.insertAdjacentHTML("beforeend", `
            <h3 class="text-red text-xl lg:text-2xl">آگهی یافت نشد</h3>
        `)
    }
}

const getCategories = async () => {

    const response = await fetch(`${baseUrl}/v1/category/`);
    return await response.json();

}

const showCategories = async (categories, categoriesContainer) => {

    categories.data.categories.forEach((category) => {

        categoriesContainer.insertAdjacentHTML("beforeend", `
            
            <li class="group" id="${category._id}">
                <a href="#" class="flex gap-x-2 group-hover:text-primary">
                    <svg class="size-5 font-bold text-sm rotate-90">
                        <use href="#chevron-down"></use>
                    </svg>
                    <span class="font-bold text-sm">${category.title}</span>
                </a>
            </li>

        `);
    });
}

export {getPosts, showPosts, getCategories, showCategories}