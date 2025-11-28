import {getSingleSubSubCategory} from "./main.js";
import {baseUrl, getFromSearchParam, getToken} from "./utils.js";
import {getAllLocations} from "./index.js";
import {renderSwalToast} from "./shared.js";


const productFieldsContainer = document.querySelector("#productFieldsContainer");
const subCategoryTitle = document.querySelector("#subCategoryTitle");
const selectedImagesContainer = document.querySelector("#selectedImagesContainer");
const postSubmitBtn = document.querySelector("#postSubmitBtn");
const exchange = document.querySelector("#exchange");
const totalAmount = document.querySelector("#totalAmount");
const adName = document.querySelector("#adName");
const descriptionElm = document.querySelector("#description");
const comeback = document.querySelector("#comeback");


const subSubCatId = getFromSearchParam("categoryID");
const subSubCategory = (await getSingleSubSubCategory(subSubCatId)).data.category;
const locations = (await getAllLocations()).data;
let dynamicFields = {};
let cityId = null;
let neighborId = "-1";
let pics = [];
const mapInfo = {x: 51.3890, y: 35.6892};


const creatPost = async (title, price, description, cityId, neighborhoodId, categoryId, exchange, images, map, dynamicFields) => {

    const formData = new FormData();
    formData.append("city", cityId);
    formData.append("neighborhood", neighborhoodId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("exchange", exchange.checked);
    formData.append("map", JSON.stringify(map));
    formData.append("pics", images);
    formData.append("categoryFields", JSON.stringify(dynamicFields));

    const response = await fetch(`${baseUrl}/v1/post/${categoryId}`, {

        headers: {
            Authorization: `Bearer ${getToken()}`,
        }, method: "POST", body: formData,
    });

    if (response.ok) {

        renderSwalToast("success", "پست با موفقیت ثبت شد");

    } else {

        renderSwalToast("error", "خطا در ثبت پست");
    }
}
const renderProductFieldsTemplate = () => {

    subSubCategory.productFields.forEach((field) => {

        if (field.type === "selectbox") {

            productFieldsContainer.insertAdjacentHTML("beforeend", `

                <div class="text-secondary">
                    <h3 class="font-bold text-sm pb-3">${field.name}</h3>
                    <select data-slug="${field.slug}" class="selectbox w-full p-2 text-sm bg-bgGray rounded shadow-one text-secondary border border-secondary/20 outline-0 cursor-pointer">
                        ${field.options.map((option) => `
                           <option class="hidden" value="">${field.name}</option>            
                           <option value="${option}">${option}</option>            
                        `).join("")}
                    </select>
                </div>            
            `);

        } else if (field.type === "checkbox") {

            productFieldsContainer.insertAdjacentHTML("beforeend", `

                <div class="flex items-center justify-between">
                    <h3 class="font-bold">${field.name}</h3>
                    <label class="switch">
                        <input data-slug="${field.slug}" id="has-picture" class="checkbox" type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
            `);
        }
    });
}
const generateImage = (pics) => {

    selectedImagesContainer.innerHTML = `            
        <div class="flex flex-col items-center justify-center gap-y-2 border border-dashed border-red size-25">
                <input type="file" id="newPostImagesInput" class="hidden" accept="image/*" multiple="">
                <label for="newPostImagesInput">
                    <svg class="size-5">
                        <use href="#image"></use>
                    </svg>
                    <span class="text-xs">انتخاب عکس</span>
                </label>
            </div>
    `;
    pics.forEach((pic) => {

        let reader = new FileReader();

        reader.onload = function () {

            let src = reader.result;

            selectedImagesContainer.insertAdjacentHTML("beforeend", `
    
            <div class="group relative !size-25 cursor-pointer">
                <img src="${src}" class="size-full rounded group-hover:opacity-40" alt="">
                <div class="absolute inset-0 hidden group-hover:flex items-center justify-center">
                    <svg data-name="${pic.name}" class="selectedImageDeleteBtn size-5 text-white">
                        <use href="#trash"></use>
                    </svg>
                </div>
         </div>
        `)
        }
        reader.readAsDataURL(pic);
    });
}

renderProductFieldsTemplate();

//show sub sub category name

subCategoryTitle.innerHTML = `${subSubCategory.title}`;


// show dynamic fields

subSubCategory.productFields.forEach((field) => {

    if (field.type === 'checkbox') {

        dynamicFields[field.slug] = false;

    } else {

        dynamicFields[field.slug] = null;
    }
});

productFieldsContainer.addEventListener("change", (event) => {

    const selectbox = event.target.closest(".selectbox");

    if (!selectbox) return;

    dynamicFields[selectbox.dataset.slug] = selectbox.value;
});

productFieldsContainer.addEventListener("change", (event) => {

    const checkbox = event.target.closest(".checkbox");

    if (!checkbox) return;

    dynamicFields[checkbox.dataset.slug] = checkbox.checked;
});


// show city and neighborhood

const cities = locations.cities;
const neighborhoods = locations.neighborhoods;

const citySelect = new Choices("#citySelectBox", {
    searchEnabled: true, searchFields: ['label'], placeholderValue: "شهر را انتخاب کنید ...", itemSelectText: '',
});

const neighborSelect = new Choices("#neighborSelectBox", {
    searchEnabled: true, searchFields: ['label'], placeholderValue: "محله را انتخاب کنید ...", itemSelectText: '',
});

const preparedCities = cities.map(city => {

    return {value: city.id, label: city.name};
});

citySelect.setChoices(preparedCities, 'value', 'label', false);
document.querySelector(".choices__input--cloned").placeholder = "جستجوی شهر ...";

document.querySelector("#citySelectBox").addEventListener("change", (event) => {

    cityId = +event.target.value;

    const preparedNeighborhood = neighborhoods.filter((neighbor) => +neighbor.city_id === +cityId).map(neighbor => {

        return {value: neighbor.id, label: neighbor.name}
    });

    neighborSelect.setChoices(preparedNeighborhood, 'value', 'label', true);
});

document.querySelector("#neighborSelectBox").addEventListener("change", (event) => {

    neighborId = +event.target.value;
});


// upload image
selectedImagesContainer.addEventListener("change", (event) => {

    const newPostImagesInput = event.target.closest("#newPostImagesInput");

    if (!newPostImagesInput) return;

    if (event.target.files.length) {

        let file = event.target.files[0];

        if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg") {

            pics.push(file);
            generateImage(pics);

        } else {
            renderSwalToast("error", "فرمت فایل آپلودی مجاز نیست");
        }
    }
});

selectedImagesContainer.addEventListener("click", (event) => {


    const selectedImageDeleteBtn = event.target.closest(".selectedImageDeleteBtn");

    if (!selectedImageDeleteBtn) return;

    pics = pics.filter((pic) => pic.name !== selectedImageDeleteBtn.dataset.name);
    generateImage(pics);
});


//show map
const map = L.map("map").setView([35.6892, 51.3890], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom: 19}).addTo(map);

const icon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", iconSize: [32, 32], iconAnchor: [16, 32],
});
const marker = L.marker(map.getCenter(), {icon, interactive: false}).addTo(map);
map.on("move", () => marker.setLatLng(map.getCenter()));

// get map data
map.on("moveend", () => {

    const center = map.getCenter();
    mapInfo.x = center.lng;
    mapInfo.y = center.lat;
});


//send ad
postSubmitBtn.addEventListener("click", async () => {

    let isAllFieldsFull = true;

    for (const field in dynamicFields) {

        if (dynamicFields[field] === null) {

            isAllFieldsFull = false;
        }
    }

    const price = totalAmount.value;
    const title = adName.value.trim();
    const description = descriptionElm.value.trim();

    if (isAllFieldsFull && price !== "" && title !== "" && description !== "" && cityId !== null) {

        await creatPost(title, price, description, cityId, neighborId, subSubCatId, exchange, pics, mapInfo, dynamicFields);

    } else {

        renderSwalToast("warning", "لطفا همه فیلد هارا پر کنید!");
    }
});

comeback.addEventListener("click", () => history.back());