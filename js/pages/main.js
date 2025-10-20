import {addToSearchParam, getFromLocalStorage, getFromSearchParam, removeParamFromUrl} from "../function/utils.js";
import {getCategories, getPosts, renderFiltering, showCategories, showPosts} from "../function/main.js";

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



window.addEventListener("load", async () => {

    // root protection
    if (getFromLocalStorage("city")) {

        loader.classList.add("hidden");

        // get and show posts
        const posts = await getPosts();
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
        const categories = await getCategories();
        const categoryId = getFromSearchParam("categoryID");

        if (categoryId) {

            // find main category which in searchParam
            const categoryInfos = categories.data.categories.filter((category) => category._id === categoryId);

            if (categoryInfos.length) {

                // show sub category
                await showCategories(categoryInfos, categoriesContainer, true, false)

                //sucCategory filtering
                if (categoryInfos[0].filters.length) {

                    renderFiltering(categoryInfos[0].filters, filterCategoryContainer);
                }

            } else {

                // show subSubCategory(there is a categoryID in searchParam but its not main category id ==> categoryInfos.length)
                const allSubCategories = categories.data.categories.flatMap((category) => category.subCategories);
                const subCategoriesInfo = allSubCategories.filter((subCategory) => subCategory._id === categoryId);

                await showCategories(subCategoriesInfo, categoriesContainer, false, true)

                //sucSubCategory filtering
                if (subCategoriesInfo[0].filters.length) {

                    renderFiltering(subCategoriesInfo[0].filters, filterCategoryContainer);
                }
            }

        } else {

            // show main category
            await showCategories(categories.data.categories, categoriesContainer, false, false, null);
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
                    addToSearchParam("value", event.target.value.trim())
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
                    addToSearchParam("value", event.target.value.trim())
                }
            }
        });

        //binding between url and searchInput
        const searchParamValue = getFromSearchParam("value");

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
                removeParamFromUrl("value");
            }
        });

        // clean global search input(mobile)
        searchIconMobile.parentElement.addEventListener("click", () => {

            if (searchIconMobile.getAttribute("href") === "#x-mark") {

                globalSearchInputMobile.value = "";
                searchIconMobile.setAttribute("href", "#magnifying-glass");
                removeParamFromUrl("value");
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


    } else {

        loader.classList.remove("hidden");
    }
});
