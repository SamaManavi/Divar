import {findCategoryParentNameById, getAllSubSubCategory, getCategories} from "./main.js";

const categories = (await getCategories()).data.categories;
const subSubCategories = (await getAllSubSubCategory()).data.categories;

const renderCategoriesOfAds = (categories) => {

    categoryContainerAd.innerHTML = "";
    categories.forEach((category) => {

        categoryContainerAd.insertAdjacentHTML("beforeend", `

            <li class="category" id="${category._id}">
                <div class="flex items-center justify-between">
                    <span class="text-sm">${category.title}</span>                
                    <svg class="size-5 rotate-90">
                        <use href="#chevron-down"></use>
                    </svg>
                </div>
                <span class="categoryGuid pt-3 text-[10px] text-secondary/50 text-start hidden">${category.description}</span>
            </li>
        `)
    });
}
const renderSubCategories = (subCategories, isStep2, parentId) => {

    categoryContainerAd.innerHTML = "";

    categoryContainerAd.insertAdjacentHTML("beforeend", `

        <li id="${parentId}" class="comeback flex items-center gap-x-3 border-b border-secondary/10 py-4 *:hover:text-primary cursor-pointer">
            <svg class="size-4">
                <use href="#arrow-right"></use>
            </svg>
            
            <span class="text-sm">بازگشت به ${isStep2 ? findCategoryParentNameById(parentId, true) : 'دسته ها'}</span>
        </li>


            ${subCategories.map((category) => `
                <li class="category" id="${category._id}">
                <div class="flex items-center justify-between">
                    <span class="text-sm">${category.title}</span>                
                    <svg class="size-5 rotate-90">
                        <use href="#chevron-down"></use>
                    </svg>
                </div>
                <span class="categoryGuid pt-3 text-[10px] text-secondary/50 text-start hidden">${category.description}</span>
            </li>
            `).join("")}

    `);
}

const guidCheckBox = document.querySelector("#has-picture");
const categoryContainerAd = document.querySelector("#categoryContainerAd");
const searchSubSubCatInput = document.querySelector("#searchSubSubCatInput");
const searchCategoriesContainer = document.querySelector("#searchCategoriesContainer");
const emptySearch = document.querySelector("#empty-search");
const categorySearchModal = document.querySelector("#categorySearchModal");
const comeback = document.querySelector("#comeback");

comeback.addEventListener("click", () => history.back());

let page = 0;

//show categories of ads
renderCategoriesOfAds(categories);

// check box handle
guidCheckBox.addEventListener("change", () => {

    const categoryGuids = document.querySelectorAll(".categoryGuid");

    if (guidCheckBox.checked) {


        categoryGuids.forEach((catGuid) => catGuid.classList.remove("hidden"));

    } else {

        categoryGuids.forEach((catGuid) => catGuid.classList.add("hidden"));
    }


});

// show sub category & show sub sub category
categoryContainerAd.addEventListener("click", (event) => {

    const category = event.target.closest(".category");
    const comeback = event.target.closest(".comeback");

    if (category) {

        const categoryClicked = categories.find((cat) => category.id === cat._id);

        if (categoryClicked) {

            renderSubCategories(categoryClicked.subCategories, false, null);
            page++;

        } else {

            const allSubCategories = categories.flatMap((category) => category.subCategories);
            const categoryClicked = allSubCategories.find((cat) => category.id === cat._id);

            if (categoryClicked) {

                renderSubCategories(categoryClicked.subCategories, true, categoryClicked.parent);
                page++;
            } else {

                window.location.href = `register-post.html?categoryID=${category.id}`;
            }
        }

    } else if (comeback) {


        if (page === 1) {

            renderCategoriesOfAds(categories);
            page--;

        } else if (page === 2) {

            const categoryClicked = categories.find((cat) => comeback.id === cat._id);

            if (categoryClicked) {

                renderSubCategories(categoryClicked.subCategories, false, null);
                page--;
            }
        }
    }


});

//search cities
searchSubSubCatInput.addEventListener("keyup", (event) => {

    if (event.target.value) {

        categorySearchModal.classList.remove("hidden");

        const searchCatResults = subSubCategories.filter((subCat) => subCat.title.includes(event.target.value));

        if (searchCatResults.length) {

            searchCategoriesContainer.innerHTML = "";
            emptySearch.classList.add("hidden");

            searchCatResults.forEach((category) => {

                searchCategoriesContainer.insertAdjacentHTML("beforeend", `
                    <li class="category" id="${category._id}">
                        <div class="flex items-center justify-between">
                    <span class="text-sm">${category.title}</span>                
                    <svg class="size-5 rotate-90">
                        <use href="#chevron-down"></use>
                    </svg>
                </div>
                        <span class="categoryGuid pt-3 text-[10px] text-secondary/50 text-start hidden">${category.description}</span>
                    </li>
                `);
            })

        } else {

            searchCategoriesContainer.innerHTML = "";
            emptySearch.classList.remove("hidden");
        }

    } else {

        categorySearchModal.classList.add("hidden");
    }

});

//click on subSub category in search result
searchCategoriesContainer.addEventListener("click", (event) => {

    const category = event.target.closest(".category");

    if (!category) return;

    window.location.href = `register-post.html?categoryID=${category.id}`;

});


