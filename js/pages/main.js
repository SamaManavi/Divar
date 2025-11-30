import {addToSearchParam, getFromLocalStorage, getFromSearchParam, removeParamFromUrl} from "../function/utils.js";
import {
    getCategories, priceFormater, renderFiltering, showCategories, showFamousSearch
} from "../function/main.js";
import {getPosts, showPosts} from "../function/posts.js";
import {loginModal, isLogin, logOut} from "../function/auth.js";
import {renderModal} from "../function/myDivar.js";


const loader = document.querySelector("#loader");
const categoriesContainer = document.querySelector("#categories-container");
const postsContainer = document.querySelector("#posts-container")
const globalSearch = document.querySelector("#globalSearch");
const modalOverlay = document.querySelector("#modalOverlay");
const modalGlobalSearch = document.querySelector("#modalGlobalSearch");
const globalSearchInput = document.querySelector("#globalSearchInput");
const globalSearchMobile = document.querySelector("#globalSearchMobile");
const filterSelectBoxContainer = document.querySelector("#filter-selectBox");
const filterCheckBoxContainer = document.querySelector("#filter-checkBox");
const searchIconMobile = document.querySelector("#searchIconMobile");
const searchIconDesktop = document.querySelector("#searchIconDesktop");
const globalSearchModal = document.querySelector("#globalSearchModal");
const globalSearchInputMobile = document.querySelector("#globalSearchInputMobile");
const globalSearchMobileSpan = document.querySelector("#globalSearchMobileSpan");
const globalSearchMobileIcon = document.querySelector("#globalSearchMobileIcon");
const mostSearchedContainer = document.querySelector("#mostSearched");
const famousSearchMobileContainer = document.querySelector("#famous-search-modal-mobile");
const hasPicture = document.querySelector("#has-picture");
const exChange = document.querySelector("#ex-change");
const minPriceInput = document.querySelector("#minPriceInput");
const maxPriceInput = document.querySelector("#maxPriceInput");
const cityNameDesktop = document.querySelector("#city-name-desktop");
const cityNameMobile = document.querySelector("#city-name-mobile");
const myDivarModalMobi = document.querySelector("#myDivarModalMobi");
const myDivarBtnMobi = document.querySelector("#myDivarMobiBtn");
const myDivarMobiContainer = document.querySelector("#myDivarMobiContainer");
const registerAd = document.querySelector("#registerAd");
const ads = document.querySelector("#ads");
const miniLoader = document.querySelector(".miniLoader");

// root protection
if (!getFromLocalStorage("city")) {
    location.href = "./index.html";
}

const data = await Promise.allSettled([getPosts(1), getCategories()]);

// get and show posts
const posts = data[0].value;
let backupPosts = [...posts.data.posts];
const pagination = posts.data.pagination;

showPosts(posts.data.posts, postsContainer);

loader.classList.add("hidden");

categoriesContainer.addEventListener("click", (event) => {

    //send category to search param
    const categoryLi = event.target.closest(".categoryLi");
    if (categoryLi) {
        addToSearchParam('categoryID', categoryLi.id);
    }

    // comeback to all ads list
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

            renderFiltering(categoryInfos[0].filters, filterSelectBoxContainer, filterCheckBoxContainer);
        }

    } else {

        // show subSubCategory(there is a categoryID in searchParam but its not main category id ==> categoryInfos.length)
        const allSubCategories = categories.data.categories.flatMap((category) => category.subCategories);
        const subCategoriesInfo = allSubCategories.filter((subCategory) => subCategory._id === categoryId);


        if (subCategoriesInfo.length) {

            await showCategories(subCategoriesInfo[0], categoriesContainer, false, true, false);

            //sucSubCategory filtering
            if (subCategoriesInfo[0].filters.length) {

                renderFiltering(subCategoriesInfo[0].filters, filterSelectBoxContainer, filterCheckBoxContainer);
            }

        } else {

            // show subSubCategorySelected(color red)
            const allSubSubCategories = allSubCategories.flatMap((subCategory) => subCategory.subCategories);
            const subSubCategorySelected = allSubSubCategories.filter((subCategory) => subCategory._id === categoryId);

            await showCategories(subSubCategorySelected[0], categoriesContainer, false, false, true);

            //sucCategory filtering
            if (subSubCategorySelected[0].filters.length) {

                renderFiltering(subSubCategorySelected[0].filters, filterSelectBoxContainer, filterCheckBoxContainer);
            }
        }
    }

} else {

    // show main category
    await showCategories(categories.data.categories, categoriesContainer, false, false, false);
}

// global search input(open)desktop
globalSearch.addEventListener("click", () => {

    modalOverlay.classList.remove("hidden");
    modalGlobalSearch.classList.remove("hidden");

    //show famous search
    showFamousSearch(famousSearchMobileContainer);
});

// global search mobile
globalSearchMobile.addEventListener("click", () => {

    globalSearchModal.classList.remove("hidden");
    //show famous search
    showFamousSearch(mostSearchedContainer);
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

//click on mostSearched li and send to url(desktop)
mostSearchedContainer.addEventListener("click", (event) => {

    const searchValue = event.target.closest(".searchValue");

    if (searchValue) {

        addToSearchParam("search", searchValue.dataset.search);
    }
});

//click on mostSearched li and send to url(mobile)
famousSearchMobileContainer.addEventListener("click", (event) => {

    const searchValueMobile = event.target.closest(".searchValue");

    if (searchValueMobile) {

        addToSearchParam("search", searchValueMobile.dataset.search)
    }
});

// filter has picture --- exChange
let filteredPosts = backupPosts;

hasPicture.addEventListener("change", () => {

    if (hasPicture.checked) {

        addToSearchParam("pics", true);

    } else {

        removeParamFromUrl("pics");
    }
});

exChange.addEventListener("change", () => {

    if (exChange.checked) {

        addToSearchParam("exchange", true);
    } else {

        removeParamFromUrl("exchange");
    }

});

if (getFromSearchParam("exchange")) {

    exChange.setAttribute("checked", "true");
}

if (getFromSearchParam("pics")) {

    filteredPosts = filteredPosts.filter((post) => post.pics.length);
    showPosts(filteredPosts, postsContainer);

    hasPicture.setAttribute("checked", "true");
}

// click in a post and send to search param
postsContainer.addEventListener("click", (event) => {

    const singlePost = event.target.closest(".singlePost");

    if (singlePost) {

        window.location.href = `/Divar/public/post.html?id=${singlePost.id}`;
    }
});

//filter Price
const minPriceSearchParam = getFromSearchParam("minPrice");
const maxPriceSearchParam = getFromSearchParam("maxPrice");

if (minPriceSearchParam) {

    minPriceInput.value = priceFormater(minPriceSearchParam);
}

if (maxPriceSearchParam) {

    maxPriceInput.value = priceFormater(maxPriceSearchParam);
}

// check input value format
minPriceInput.addEventListener("input", (event) => {

    event.target.value = priceFormater(event.target.value);
});

maxPriceInput.addEventListener("input", (event) => {

    event.target.value = priceFormater(event.target.value);
});

minPriceInput.addEventListener("blur", (event) => {


    const cleanValue = event.target.value.replace(/[^\d]/g, "");

    addToSearchParam("minPrice", cleanValue);

});

minPriceInput.addEventListener("keyup", (event) => {

    if (event.keyCode === 13) {

        const cleanValue = event.target.value.replace(/[^\d]/g, "");

        addToSearchParam("minPrice", cleanValue);
    }
});

maxPriceInput.addEventListener("blur", (event) => {


    const cleanValue = event.target.value.replace(/[^\d]/g, "");

    addToSearchParam("maxPrice", cleanValue);

});

maxPriceInput.addEventListener("keyup", (event) => {

    if (event.keyCode === 13) {

        const cleanValue = event.target.value.replace(/[^\d]/g, "");

        addToSearchParam("maxPrice", cleanValue);
    }
});

//show city name
const cities = getFromLocalStorage("city");

if (cities.length > 1) {

    cityNameDesktop.innerHTML = `${cities.length}شهر `;
    cityNameMobile.innerHTML = `${cities.length}شهر `;

} else {

    cityNameDesktop.innerHTML = cities[0].name;
    cityNameMobile.innerHTML = cities[0].name;
}


// develop*************************************************************************
// bottom menu
myDivarBtnMobi.addEventListener("click", async () => {

    myDivarModalMobi.classList.remove("hidden");
    myDivarBtnMobi.classList.add("border-b-3", "border-red");
    ads.classList.remove("border-b-3", "border-red");

    await renderModal(myDivarMobiContainer);
});

ads.addEventListener("click", async () => {

    myDivarModalMobi.classList.add("hidden");
    myDivarBtnMobi.classList.remove("border-b-3", "border-red");
    ads.classList.add("border-b-3", "border-red");
});

myDivarMobiContainer.addEventListener("click", (event) => {

    const menuOption = event.target.closest(".menuOption");
    const menuOptionLogin = event.target.closest(".menuOptionLogin");
    const Exit = event.target.closest(".Exit");

    if (menuOption) {
        loginModal();
    }

    if (menuOptionLogin) {

        location.href = `${menuOptionLogin.dataset.adrs}`
    }

    if (Exit) {
        logOut();
    }
});

// *************************************************************************************

//register ad
registerAd.addEventListener("click", async () => {

    if (await isLogin()) {

        location.href = "new-post.html";
    } else {

        loginModal();
    }
});

// pagination
let currentPage = 2;
let totalPages = pagination.totalPages;
let isLoading = false;

const loadMore = async () => {

    if (isLoading || currentPage > totalPages) return;

    isLoading = true;
    miniLoader.classList.remove("hidden");


    const data = await getPosts(currentPage);
    currentPage = +data.data.pagination.page + 1;
    totalPages = data.data.pagination.totalPages;

    showPosts(data.data.posts, postsContainer);


    miniLoader.classList.add("hidden");
    isLoading = false;
}

window.addEventListener("scroll", async () => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
    if (bottom) {
        await loadMore();
    }
});


