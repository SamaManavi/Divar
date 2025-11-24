import {baseUrl, getFromSearchParam} from "./utils.js";


const getCategories = async () => {

    const response = await fetch(`${baseUrl}/v1/category/`);
    return await response.json();
}

const getAllSubSubCategory = async () => {

    const response = await fetch(`${baseUrl}/v1/category/sub`);
    return await response.json();
}

const categories = await getCategories();

const showCategories = (categories, categoriesContainer, isSubCat, isSubSubCat, isSubSubCatSelected) => {

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
                    <span class="font-bold text-sm">${findCategoryParentNameById(categories.parent, true)}</span>
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
            <li class="group categoryLi" id="${findCategoryParentNameById(categories.parent, false)}">
                <a href="#" class="flex items-center gap-x-2 text-primary">
                    <svg class="size-4 font-bold text-sm">
                        <use href="#chevron-down"></use>
                    </svg>
                    <span class="font-bold text-sm">${findGrandparentSubSubCat(categories.parent)}</span>
                </a>
            </li>
            <li class="group categoryLi" id="${categories.parent}">
                <span class="font-bold text-sm text-primary cursor-pointer pr-10">${findCategoryParentNameById(categories.parent, true)}</span>
            </li>
            <ul class="flex flex-col gap-y-2 mt-3 mr-14 border-r border-secondary/30 *:text-secondary *:text-sm/7 *:font-bold *:hover:text-primary *:transition-colors *:duration-300 *:cursor-pointer">
                     ${renderSelectedSubSubCat(categories.parent)}
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

const findCategoryParentNameById = (parentId, titleWanted) => {

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

const findGrandparentSubSubCat = (parentId) => {

    const parent = findCategoryParentNameById(parentId, false);
    return findCategoryParentNameById(parent, true);
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

const renderSelectedSubSubCat = (parentID) => {

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


export {
    getCategories,
    showCategories,
    renderFiltering,
    showFamousSearch,
    priceFormater,
    findCategoryParentNameById,
    getAllSubSubCategory
}