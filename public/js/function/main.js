import {baseUrl, getFromLocalStorage, calculateTimePassed, getFromSearchParam} from "./utils.js";

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

const showCategories = async (categories, categoriesContainer, isSubCat, isSubSubCat, isSubSubCatSelected) => {

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
                    <span class="font-bold text-sm">${categories.title}</span>
                </a>
            </li>
            <ul class="flex flex-col gap-y-2 pr-2 mt-3 mr-10 *:text-sm/7 *:font-bold *:hover:text-primary *:transition-colors *:duration-300 *:cursor-pointer">
                ${renderCategoryTemplate(categories.subCategories)}
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
            <li class="group categoryLi" id="${categories.parent}">
                <a href="#" class="flex items-center gap-x-2 text-primary">
                    <svg class="size-4 font-bold text-sm">
                        <use href="#chevron-down"></use>
                    </svg>
                    <span class="font-bold text-sm">${await findCategoryParentNameById(categories.parent, true)}</span>
                </a>
            </li>
            <li class="group categoryLi" id="${categories.parent}">
                <span class="font-bold text-sm text-primary cursor-pointer pr-10">${categories.title}</span>
            </li>
            <ul class="flex flex-col gap-y-2 pr-2 mt-3 mr-14 border-r border-secondary/30 *:text-secondary *:text-sm/7 *:font-bold *:hover:text-primary *:transition-colors *:duration-300 *:cursor-pointer">
                ${renderCategoryTemplate(categories.subCategories)}
            </ul>
        `);

    } else if (isSubSubCatSelected) {

        categoriesContainer.insertAdjacentHTML("beforeend", `

            <li class="group" id="allAdsLi">
                <a href="#" class="flex items-center gap-x-2 group-hover:text-primary duration-300">
                    <svg class="size-4 font-bold text-sm">
                        <use href="#arrow-right"></use>
                    </svg>
                    <span class="font-bold text-sm">همه آگهی ها</span>
                </a>
            </li>
            <li class="group categoryLi" id="${await findCategoryParentNameById(categories.parent, false)}">
                <a href="#" class="flex items-center gap-x-2 text-primary">
                    <svg class="size-4 font-bold text-sm">
                        <use href="#chevron-down"></use>
                    </svg>
                    <span class="font-bold text-sm">${await findGrandparentSubSubCat(categories.parent)}</span>
                </a>
            </li>
            <li class="group categoryLi" id="${categories.parent}">
                <span class="font-bold text-sm text-primary cursor-pointer pr-10">${await findCategoryParentNameById(categories.parent, true)}</span>
            </li>
            <ul class="flex flex-col gap-y-2 mt-3 mr-14 border-r border-secondary/30 *:text-secondary *:text-sm/7 *:font-bold *:hover:text-primary *:transition-colors *:duration-300 *:cursor-pointer">
                     ${await renderSelectedSubSubCat(categories.parent)}
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

const findCategoryParentNameById = async (parentId, titleWanted) => {

    const categories = await getCategories();
    const categoryInfo = categories.data.categories.find((category) => category._id === parentId);
    const allSubCategories = categories.data.categories.flatMap((category) => category.subCategories);
    const subCategoriesInfo = allSubCategories.find((subCategory) => subCategory._id === parentId);

    if (titleWanted) {

        if (categoryInfo) {

            return categoryInfo.title;

        } else if (subCategoriesInfo) {

            return subCategoriesInfo.title;
        }

    } else {

        if (categoryInfo) {

            return categoryInfo.parent;

        } else if (subCategoriesInfo) {

            return subCategoriesInfo.parent;
        }
    }
}

const findGrandparentSubSubCat = async (parentId) => {

    const parent = await findCategoryParentNameById(parentId, false);
    return await findCategoryParentNameById(parent, true);
}

const renderCategoryTemplate = (categories) => {

    const categoryId = getFromSearchParam("categoryID");

    return categories.map((category) => {

        return `   
                <li class="group categoryLi pr-2 ${categoryId === category._id ? '*:text-red border-r-2 border-red' : ''}" id="${category._id}">
                    <span>${category.title}</span>
                </li>
            `
    }).join("");
}

const renderSelectedSubSubCat = async (parentID) => {

    const categories = await getCategories();
    const allSubCategories = categories.data.categories.flatMap((category) => category.subCategories);
    const subCategoriesInfo = allSubCategories.find((subCategory) => subCategory._id === parentID);

    return renderCategoryTemplate(subCategoriesInfo.subCategories)
}

const renderFilterOptions = (filterOptions) => {

    return filterOptions.map((filter) => {
        return `
                <option value="">${filter}</option>
        `
    }).join("");
}

const renderFiltering = (categoryFilter, selectBoxContainer, checkBoxContainer) => {

    categoryFilter.forEach((filter) => {

        selectBoxContainer.insertAdjacentHTML("beforeend", `
        
            ${filter.type === "selectbox" ? `
            
                <!--selectBox-->
                <div class="flex flex-col py-4 border-b border-secondary/20">
                    <span class="text-primary text-sm font-bold pb-5">${filter.name}</span>

                    <div class="flex items-center gap-x-4 pb-2">
                    <select class="bg-bgGray border rounded border-secondary/50 py-1 p-2 w-65 hover:border-secondary outline-none focus:border-red" name="" id="">
                        ${renderFilterOptions(filter.options)}
                    </select>
                </div>
                </div>
            ` : ""}
        `);

        checkBoxContainer.insertAdjacentHTML("beforeend", `
        
            ${filter.type === "checkbox" ? `
            
                <!--checkBox-->
            <div class="flex justify-between py-4 border-b border-secondary/20">
                <span class="text-primary text-sm font-bold">${filter.name}</span>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider"></span>
                </label>
            </div>
            ` : ""}        
        `);
    });
}

const showFamousSearch = (mostSearchedContainer) => {

    const mostSearchedName = ['تلوزیون', 'لپ تاپ', 'موبایل', 'ساعت', 'ماشین'];

    mostSearchedName.forEach((search) => {

        mostSearchedContainer.insertAdjacentHTML("beforeend", `
        
            <li data-search="${search}" class="searchValue h-7 flex items-center text-secondary cursor-pointer text-sm border border-secondary/50 px-3 py-1 rounded-full">${search}</li>
        `);
    });
}

const priceFormater = (value) => {

    value = value.replace(/[^0-9]/g, "");

    if (value === "") {

        return "";
    }

    return Number(value).toLocaleString();
}


export {getPosts, showPosts, getCategories, showCategories, renderFiltering, showFamousSearch, priceFormater}