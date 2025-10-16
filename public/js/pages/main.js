import {addToSearchParam, getFromLocalStorage, getFromSearchParam, removeParamFromUrl} from "../function/utils.js";
import {getCategories, getPosts, showCategories, showPosts} from "../function/main.js";

const loader = document.querySelector("#loader");
const categoriesContainer = document.querySelector("#categories-container");
const postsContainer = document.querySelector("#posts-container")


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
            } else {

                // show subSubCategory(there is a categoryID in searchParam but its not main category id ==> categoryInfos.length)
                const allSubCategories = categories.data.categories.flatMap((category) => category.subCategories);
                const subCategoriesInfo = allSubCategories.filter((subCategory) => subCategory._id === categoryId);
                await showCategories(subCategoriesInfo, categoriesContainer, false, true)
            }

        } else {

            // show main category
            await showCategories(categories.data.categories, categoriesContainer, false, false,null);
        }

    } else {

        loader.classList.remove("hidden");
    }
});
