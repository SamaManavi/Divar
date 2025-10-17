import {baseUrl, getFromLocalStorage, calculateTimePassed} from "./utils.js";

const getPosts = async () => {

    const cityId = getFromLocalStorage("city")[0].id;

    const response = await fetch(`${baseUrl}/v1/post/?city=${cityId}&limit=100`);
    return await response.json();
}

const showPosts = (posts, postsContainer) => {

    if (posts.length) {

        posts.forEach((post) => {

            postsContainer.insertAdjacentHTML("beforeend", `
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
                `);

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

const showCategories = async (categories, categoriesContainer, isSubCat, isSubSubCat) => {

    if (isSubCat) {

        // insert html for all ads and title of category
        categoriesContainer.insertAdjacentHTML("beforeend", `
            <li class="group" id="allAdsLi">
                <a href="#" class="flex items-center gap-x-2 group-hover:text-primary duration-300">
                    <svg class="size-4 font-bold text-sm">
                        <use href="#arrow-right"></use>
                    </svg>
                    <span class="font-bold text-sm">همه آگهی ها</span>
                </a>
            </li>
            <li class="group categoryLi">
                <a href="#" class="flex items-center gap-x-2 text-primary">
                    <svg class="size-5 font-bold text-sm">
                        <use href="#chevron-down"></use>
                    </svg>
                    <span class="font-bold text-sm">${categories[0].title}</span>
                </a>
            </li> 
            <ul class="flex flex-col gap-y-2 pr-2 mt-3 mr-10 *:text-sm/7 *:font-bold *:hover:text-primary *:transition-colors *:duration-300 *:cursor-pointer">
                ${renderCategoryTemplate(categories[0].subCategories)}                   
            </ul> 
        `);

    } else if (isSubSubCat) {

        // insert html for all ads and title of category and title of subCategory
        categoriesContainer.insertAdjacentHTML("beforeend", `
            
            <li class="group" id="allAdsLi">
                <a href="#" class="flex items-center gap-x-2 group-hover:text-primary duration-300">
                    <svg class="size-4 font-bold text-sm">
                        <use href="#arrow-right"></use>
                    </svg>
                    <span class="font-bold text-sm">همه آگهی ها</span>
                </a>
            </li>  
            <li class="group">
                <a href="#" class="flex items-center gap-x-2 text-primary">
                    <svg class="size-4 font-bold text-sm">
                        <use href="#chevron-down"></use>
                    </svg>
                    <span class="font-bold text-sm">${await findCategoryParentById(categories[0].parent)}</span>
                </a>
            </li>  
            <li class="group">
                <span class="font-bold text-sm text-primary cursor-pointer pr-10">${categories[0].title}</span>
            </li>  
            <ul class="flex flex-col gap-y-2 pr-2 mt-3 mr-14 border-r border-secondary/30 *:text-secondary *:text-sm/7 *:font-bold *:hover:text-primary *:transition-colors *:duration-300 *:cursor-pointer">
                ${renderCategoryTemplate(categories[0].subCategories)}
            </ul>
        `);

    } else {

        // just show category
        categories.forEach((category) => {

            categoriesContainer.insertAdjacentHTML("beforeend", `
            
            <li class="group categoryLi" id="${category._id}">
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
}

const findCategoryParentById = async (id) => {

    const categories = await getCategories();

    const categoryInfo = categories.data.categories.find((category) => category._id === id);
    return categoryInfo.title;
}

const renderCategoryTemplate = (categories) => {

    return categories.map((category) => {

        return `   
                <li class="group categoryLi" id="${category._id}">
                    <span>${category.title}</span>
                </li>
            `
    }).join("");

}


export {getPosts, showPosts, getCategories, showCategories}