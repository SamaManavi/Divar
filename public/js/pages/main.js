import {addToSearchParam, getFromLocalStorage, getFromSearchParam, removeParamFromUrl} from "../function/utils.js";
import {
    getCategories,
    getPosts,
    renderFiltering,
    showCategories,
    showFamousSearch,
    showPosts
} from "../function/main.js";

const loader = document.querySelector("#loader");
const categoriesContainer = document.querySelector("#categories-container");
const postsContainer = document.querySelector("#posts-container")
const globalSearch = document.querySelector("#globalSearch");
const modalOverlay = document.querySelector("#modalOverlay");
const modalGlobalSearch = document.querySelector("#modalGlobalSearch");
const globalSearchInput = document.querySelector("#globalSearchInput");
const globalSearchMobile = document.querySelector("#globalSearchMobile");
const filterCategoryContainer = document.querySelector("#filter-category");
const searchIconMobile = document.querySelector("#searchIconMobile");
const searchIconDesktop = document.querySelector("#searchIconDesktop");
const globalSearchModal = document.querySelector("#globalSearchModal");
const globalSearchInputMobile = document.querySelector("#globalSearchInputMobile");
const globalSearchMobileSpan = document.querySelector("#globalSearchMobileSpan");
const globalSearchMobileIcon = document.querySelector("#globalSearchMobileIcon");
const mostSearchedContainer = document.querySelector("#mostSearched");


window.addEventListener("load", async () => {

    // root protection
    if (getFromLocalStorage("city")) {

        const data = await Promise.allSettled([getPosts(), getCategories()]);

        loader.classList.add("hidden");

        // get and show posts
        const posts = data[0].value;
        showPosts(posts.data.posts, postsContainer);

        //send category to search param
        categoriesContainer.addEventListener("click", (event) => {

            const categoryLi = event.target.closest(".categoryLi");
            if (categoryLi) {
                addToSearchParam('categoryID', categoryLi.id);
            }
        });

        // comeback to all ads list
        categoriesContainer.addEventListener("click", (event) => {

            const allAdsLi = event.target.closest("#allAdsLi");
            if (allAdsLi) {
                removeParamFromUrl("categoryID");
            }
        });

        //handle categories and subCategories and subSubCategories
        const categories = data[1].value;
        const categoryId = getFromSearchParam("categoryID");

        if (categoryId) {

            // find main category which in searchParam
            const categoryInfos = categories.data.categories.filter((category) => category._id === categoryId);

            if (categoryInfos.length) {

                // show sub category
                await showCategories(categoryInfos[0], categoriesContainer, true, false)

                //sucCategory filtering
                if (categoryInfos[0].filters.length) {

                    renderFiltering(categoryInfos[0].filters, filterCategoryContainer);
                }

            } else {

                // show subSubCategory(there is a categoryID in searchParam but its not main category id ==> categoryInfos.length)
                const allSubCategories = categories.data.categories.flatMap((category) => category.subCategories);
                const subCategoriesInfo = allSubCategories.filter((subCategory) => subCategory._id === categoryId);


                if (subCategoriesInfo.length) {

                    await showCategories(subCategoriesInfo[0], categoriesContainer, false, true, false);

                    //sucSubCategory filtering
                    if (subCategoriesInfo[0].filters.length) {

                        renderFiltering(subCategoriesInfo[0].filters, filterCategoryContainer);
                    }

                } else {

                    // show subSubCategorySelected(color red)
                    const allSubSubCategories = allSubCategories.flatMap((subCategory) => subCategory.subCategories);
                    const subSubCategorySelected = allSubSubCategories.filter((subCategory) => subCategory._id === categoryId);

                    await showCategories(subSubCategorySelected[0], categoriesContainer, false, false, true);

                    //sucCategory filtering
                    if (subSubCategorySelected[0].filters.length) {

                        renderFiltering(subSubCategorySelected[0].filters, filterCategoryContainer);
                    }
                }
            }

        }
        else {

            // show main category
            await showCategories(categories.data.categories, categoriesContainer, false, false, false);
        }

        // global search input(open)desktop
        globalSearch.addEventListener("click", () => {

            modalOverlay.classList.remove("hidden");
            modalGlobalSearch.classList.remove("hidden");
        });

        // global search mobile
        globalSearchMobile.addEventListener("click", () => {

            globalSearchModal.classList.remove("hidden");

        });

        // global search (close)
        modalOverlay.addEventListener("click", () => {

            modalOverlay.classList.add("hidden");
            modalGlobalSearch.classList.add("hidden");
        });

        // typing in global search (desktop)
        globalSearchInput.addEventListener("keyup", (event) => {

            // handle search icon while typing
            if (globalSearchInput.value.trim() !== "") {

                searchIconDesktop.setAttribute("href", "#x-mark");
            } else {

                searchIconDesktop.setAttribute("href", "#magnifying-glass");
            }

            // search -- send search param value to url
            if (event.keyCode === 13) {

                event.preventDefault();
                if (event.target.value.trim()) {
                    addToSearchParam("search", event.target.value.trim())
                }
            }
        });

        // typing in global search (mobile)
        globalSearchInputMobile.addEventListener("keyup", (event) => {

            // handle search icon while typing
            if (globalSearchInputMobile.value.trim() !== "") {

                searchIconMobile.setAttribute("href", "#x-mark");
            } else {

                searchIconMobile.setAttribute("href", "#magnifying-glass");
            }

            // search -- send search param value to url
            if (event.keyCode === 13) {

                event.preventDefault();
                // close modal
                globalSearchModal.classList.add("hidden");

                if (event.target.value.trim()) {
                    addToSearchParam("search", event.target.value.trim())
                }
            }
        });

        //binding between url and searchInput
        const searchParamValue = getFromSearchParam("search");

        // send from searchParam to input (desktop)
        if (searchParamValue) {

            // change search icon while input has amount
            searchIconDesktop.setAttribute("href", "#x-mark");

            // fill input with search param value
            globalSearchInput.value = searchParamValue;
        }

        // clean global search input (desktop)
        searchIconDesktop.parentElement.addEventListener("click", () => {

            if (searchIconDesktop.getAttribute("href") === "#x-mark") {

                globalSearchInput.value = "";
                searchIconDesktop.setAttribute("href", "#magnifying-glass");
                removeParamFromUrl("search");
            }
        });

        // clean global search input(mobile)
        searchIconMobile.parentElement.addEventListener("click", () => {

            if (searchIconMobile.getAttribute("href") === "#x-mark") {

                globalSearchInputMobile.value = "";
                searchIconMobile.setAttribute("href", "#magnifying-glass");
                removeParamFromUrl("search");
            }
        });

        // send from searchParam to input(mobile)
        if (searchParamValue) {

            // change search icon while input has amount
            globalSearchMobileIcon.setAttribute("href", "#x-mark");
            searchIconMobile.setAttribute("href", "#x-mark");


            // fill input with search param value
            globalSearchMobile.value = searchParamValue;
            globalSearchMobileSpan.innerHTML = `${searchParamValue}`
            globalSearchInputMobile.value = `${searchParamValue}`;
        }

        //show famous search
        showFamousSearch(mostSearchedContainer);

        //click on mostSearched li and send to url
        mostSearchedContainer.addEventListener("click", (event) => {

           const searchValue = event.target.closest(".searchValue");

           if (searchValue){

               addToSearchParam("search", searchValue.dataset.search);
           }
        });
    }
});
