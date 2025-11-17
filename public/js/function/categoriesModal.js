import {addToSearchParam, removeParamFromUrl} from "./utils.js";
import {getCategories} from "./main.js";

document.body.insertAdjacentHTML("beforeend", `

    <!--modal categories-->
    <div id="categoriesModal" class="flex items-center justify-center max-h-screen size-full fixed inset-0 bg-black/50 backdrop-blur-[2px] z-10 hidden">
        <!--modal-->
        <div class="absolute top-18 right-70 flex divide-x divide-secondary/30 max-w-300 w-full h-125 bg-bgGray shadow-box rounded-lg px-8 py-10">
        <!--right section-->
        <div class="w-50 pl-4 space-y-5">
            <button id="backToAllAdsBtn" class="flex items-center w-full gap-x-2 text-xs border border-secondary/20 rounded py-2 px-3 hover:bg-secondary/10 cursor-pointer">
                <svg class="size-3">
                    <use href="#arrow-right"></use>
                </svg>
                همه آگهی ها
            </button>
            <div>
                <ul id="categoriesListContainer" class="space-y-1 *:py-2 *:px-1 *:flex *:items-center *:justify-between *:hover:bg-secondary/10 *:cursor-pointer *:rounded *:duration-300 *:transition-colors">
                    <!--loaded from js-->
                </ul>
            </div>
        </div>
        <!--left section-->
        <div id="subCategoriesContainer" class="[column-width:300px] columns-auto">
            <!--loaded from js-->
        </div>
    </div>
    </div>
`);

const categoriesModal = document.querySelector("#categoriesModal");
const categoriesBtn = document.querySelector("#categoriesBtn");
const backToAllAdsBtn = document.querySelector("#backToAllAdsBtn");
const categoriesListContainer = document.querySelector("#categoriesListContainer");
const subCategoriesContainer = document.querySelector("#subCategoriesContainer");

const categoriesTaken = await getCategories();
const categories = categoriesTaken.data.categories;

const openModal = () => {

    categoriesModal.classList.remove("hidden");
    renderSubCat(categories[0].subCategories);
}
const closeModal = () => {

    categoriesModal.classList.add("hidden");
}
const showCategoriesLists = () => {

    categoriesListContainer.innerHTML = "";
    console.log(categories)
    categories.forEach((category) => {

        categoriesListContainer.insertAdjacentHTML("beforeend", `
    
            <li class="mainCategory" id="${category._id}">
                <span class="text-sm">${category.title}</span>
                <svg class="size-4 rotate-90">
                    <use href="#chevron-down"></use>
                </svg>
            </li>
        `);
    });
}
const findSubCategoriesById = (id) => {

    let singleCategory = categories.find((category) => category._id === id);
    return singleCategory.subCategories;
}
const renderSubSubCat = (subSubCategories) => {

    return subSubCategories.map((category) => {

        return `   
                <li class="subSubCts" id="${category._id}">${category.title}</li>
            `
    }).join("");
}
const renderSubCat = (subCategories) => {

    subCategoriesContainer.innerHTML = "";

    subCategories.forEach((subCat) => {

        subCategoriesContainer.insertAdjacentHTML("beforeend", `
        
             <div class="flex flex-col break-inside-avoid py-3 pr-4">
                <h3 class="text-primary text-sm hover:text-red">${subCat.title}</h3>
                <ul class="flex flex-col gap-y-2 pt-4 text-secondary/80 text-xs *:hover:text-red *:cursor-pointer">
                    ${renderSubSubCat(subCat.subCategories)}
                </ul>
            </div>
        `);
    });

}


//open modal
categoriesBtn.addEventListener("click", () => {

    openModal();
    showCategoriesLists();
});

// close modal
categoriesModal.addEventListener("click", (event) => {

    if (event.target === categoriesModal) {

        closeModal();
    }
});

// back to all ads
backToAllAdsBtn.addEventListener("click", () => {

    removeParamFromUrl("categoryID");
});

// show subSubCategories && show subCategories
let lastHovered = null;
categoriesListContainer.addEventListener('mouseover', (event) => {

    //avoid duplicated listener result
    if (event.target.className === 'mainCategory' && event.target !== lastHovered) {

        const subCategoriesOfSingleCat = findSubCategoriesById(event.target.id);

        renderSubCat(subCategoriesOfSingleCat);

        lastHovered = event.target;
    }
});

//click subSubCats and send to search param and show posts
subCategoriesContainer.addEventListener("click", (event) => {

    const subSubCts = event.target.closest(".subSubCts");

    if (subSubCts) {

        addToSearchParam('categoryID', subSubCts.id);
    }
});

