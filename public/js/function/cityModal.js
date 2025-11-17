import {getAllLocations} from "./index.js";
import {getFromLocalStorage, saveInLocalStorage} from "./utils.js";

document.body.insertAdjacentHTML("beforeend", `

        <!--modal show city-->
        <div id="cityModal" class="max-h-screen flex items-center justify-center fixed inset-0 bg-black/50 backdrop-blur-[2px] size-full z-30 hidden">
            <!--modal-->
            <div id="cityModalContent" class="flex flex-col w-full h-full md:w-125 md:h-auto bg-bgGray shadow-box rounded-lg">

        <header class="shrink-0 py-4 px-5 space-y-7 border-b border-secondary/20">

            <!--title-->
            <div class="flex items-center justify-between ">
                <h3 class="font-bold text-primary text-lg">انتخاب شهر</h3>
                <button id="delete-all" class="text-red text-xs rounded-full hover:bg-red/10 p-2 cursor-pointer transition-colors duration-300 select-none">
                    حذف همه
                </button>
            </div>

            <!--selected cities-->
            <div id="selectedCitiesContainer" class="flex items-center gap-x-3 overflow-hidden">

            <!--loaded from js-->
            </div>

            <!--search cities-->
            <div class="relative">
                <input id="searchCities" type="text" placeholder="جستجو در شهر ها"
                       class="w-full h-10 rounded border border-secondary/50 py-px pr-10 pl-4 focus:border-primary/60">
                <svg class=" size-5 absolute top-2.5 right-3">
                    <use href="#magnifying-glass"></use>
                </svg>
            </div>
        </header>

        <main class="mainModal flex-1 px-5 sm:max-h-90 overflow-auto custom-scroll">
            <div>
                <ul class="divide-y divide-secondary/10">

                    <!--provinces-->
                    <div id="province-city-container">

                    </div>
                </ul>
            </div>
        </main>

        <footer class="shrink-0 max-sm:pb-4 py-3 px-5 border-t border-secondary/20">
            <div class="flex items-center gap-x-4">
                <div class="flex-1">
                    <button id="closeBtn" class="flex items-center justify-center w-full h-10 rounded border border-secondary/50 text-secondary hover:bg-secondary/5 cursor-pointer font-bold">
                        انصراف
                    </button>
                </div>
                <div class="flex-1">
                    <button id="submit-btn" class="flex items-center justify-center w-full h-10 rounded border border-red text-black hover:bg-red/90 bg-red cursor-pointer font-bold">
                        تایید
                    </button>
                </div>
            </div>
        </footer>
    </div>
        </div>
    `);

const mainModal = document.querySelector(".mainModal");
const cityModal = document.querySelector("#cityModal");
const cityModalBtnMobile = document.querySelector("#cityModalBtnMobile");
const cityModalBtnDesktop = document.querySelector("#cityModalBtnDesktop");
const closeBtn = document.querySelector("#closeBtn");
const provinceCityContainer = document.querySelector("#province-city-container");
const selectedCitiesContainer = document.querySelector("#selectedCitiesContainer");
const deleteAll = document.querySelector("#delete-all");
const submitBtn = document.querySelector("#submit-btn");
const searchCitiesInput = document.querySelector("#searchCities");

const localStorageCities = getFromLocalStorage("city");

let selectedItems = [];


if (localStorageCities.length === 1) {

    document.title = `دیوار ${localStorageCities[0].name}: بزرگترین سایت نیازمندی های رایگان در ایران`;
} else {

    document.title = ` دیوار ${localStorageCities.length} شهر : بزرگترین سایت نیازمندی های رایگان در ایران `;
}


// show provinces
const locations = await getAllLocations();
const provinces = locations.data.provinces;
const cities = locations.data.cities;

const renderProvinces = () => {

    provinceCityContainer.innerHTML = "";
    provinceCityContainer.insertAdjacentHTML("beforeend", `

        <li id="allProvincesOfIran" class="">
        <label class="checkbox-container flex items-center justify-between cursor-pointer py-4">
            <span class="text-primary font-bold">کل ایران</span>
            <input id="whole-iran" class="custom-checkbox size-4" type="checkbox">
            <span class="checkmark"></span>
        </label>
    </li>
    `);

    provinces.forEach((province) => {

        provinceCityContainer.insertAdjacentHTML("beforeend", `
        <li data-name="${province.name}" class="province" id="${province.id}">
            <button class="flex items-center justify-between gap-x-3 py-4 w-full cursor-pointer">
                <span class="text-primary font-bold">${province.name}</span>
                <svg class="size-5 rotate-90">
                    <use href="#chevron-down"></use>
                </svg>
            </button>
        </li>
    `)
    });
    checkExistence(false, null);
}
const renderCities = (citiesFiltered, provinceName, provinceId) => {

    provinceCityContainer.innerHTML = "";

    provinceCityContainer.insertAdjacentHTML("beforeend", `

        <!--برگشت به استان ها (->ایران)-->
        <li class="comebackToAllProvinces">
            <button class="flex items-center justify-start gap-x-3 py-4 cursor-pointer">
                <svg class="size-5">
                    <use href="#arrow-right"></use>
                </svg>
                <span>کل ایران</span>
            </button>
        </li>
        <label id="allCitiesInProvince" class="checkbox-container flex items-center justify-between cursor-pointer py-4">
            <span id="allCityInProvince" data-id ="${provinceId}" class="text-primary font-bold">همه شهر های ${provinceName}</span>
            <input id="allCities" class="custom-checkbox size-4" type="checkbox">
            <span class="checkmark"></span>
        </label>
    `);

    citiesFiltered.forEach((city) => {

        provinceCityContainer.insertAdjacentHTML("beforeend", `

            <label class="checkbox-container singleCity flex items-center justify-between cursor-pointer py-4">
                <span class="cityName text-primary font-bold">${city.name}</span>
                <input id="${city.id}" class="city custom-checkbox size-4" type="checkbox">
                <span class="checkmark"></span>
            </label>
        `);
    });
    checkExistence(false, null);
}
const handleSubmitBtnDesign = (hasItems) => {

    if (hasItems) {

        deleteAll.classList.remove("hidden");
        submitBtn.classList.add("bg-red", "cursor-pointer", "text-black", "hover:bg-red/90", "border-red");
        submitBtn.classList.remove("bg-[#404040]", "cursor-not-allowed", "opacity-50", "text-secondary", "border-[#404040]");
        submitBtn.disabled = false;
    } else {

        deleteAll.classList.add("hidden");
        submitBtn.classList.remove("bg-red", "cursor-pointer", "text-black", "hover:bg-red/90", "border-red");
        submitBtn.classList.add("bg-[#404040]", "cursor-not-allowed", "opacity-50", "text-secondary", "border-[#404040]");
        submitBtn.disabled = true;
    }
}
const renderSelectedItems = (Items) => {

    selectedCitiesContainer.innerHTML = "";

    if (Items.length) {

        handleSubmitBtnDesign(true);

        Items.forEach((city) => {

            selectedCitiesContainer.insertAdjacentHTML("beforeend", `
                 <div class="shrink-0">

                    <div class="flex items-center gap-x-1  text-red text-xs bg-red/5 border border-red rounded-full px-3 py-1.5">
                        <span>${city}</span>
                        <svg id="x-btn" data-name="${city}" class="size-3 cursor-pointer">
                        <use href="#x-mark"></use>
                    </svg>
                    </div>
                </div>
            `);
        });

    } else {

        selectedCitiesContainer.insertAdjacentHTML("beforeend", `

            <span class="text-secondary">حداقل یک شهر انتخاب کنید.</span>
        `);
        handleSubmitBtnDesign(false)
    }
}
const isAllCitiesSelected = () => {

    const selectedIds = new Set(selectedItems.map(item => item.id));
    const isAllCitiesSelected = cities.every(city => selectedIds.has(city.id));

    return !!isAllCitiesSelected;
}
const checkExistence = (isSearch, searchedCities) => {

    const wholeIran = document.querySelector("#whole-iran");
    const allCities = document.querySelector("#allCities");
    const allCitiesOfProvince = document.querySelectorAll(".city");
    const allCityInProvince = document.querySelector("#allCityInProvince");

    let selectItemsId = [];

    selectedItems.forEach((item) => selectItemsId.push(item.id));

    if (isSearch) {

        let searchCitiesId = [];

        searchedCities.forEach((city) => searchCitiesId.push(city.id));

        const cityResult = searchCitiesId.filter((cityId) => selectItemsId.includes(Number(cityId)));

        allCitiesOfProvince.forEach((city) => {
            if (cityResult.includes(Number(city.id))) {

                city.checked = true;
            }
        });

    } else {

        let shownCitiesId = [];

        allCitiesOfProvince.forEach((city) => shownCitiesId.push(city.id));

        if (isAllCitiesSelected()) {

            if (wholeIran) {

                wholeIran.checked = true;
            }

            if (allCities) {

                allCities.checked = true;

                if (allCitiesOfProvince) {

                    allCitiesOfProvince.forEach((city) => city.checked = true);
                }
            }
        }

        const common = shownCitiesId.filter((cityId) => selectItemsId.includes(Number(cityId)));

        allCitiesOfProvince.forEach((city) => {
            if (common.includes(city.id)) {

                city.checked = true;
            }
        });

        if (allCityInProvince) {

            if (checkProvinceAllCities()) {

                allCities.checked = checkProvinceAllCities();
            }
        }
    }
}
const checkProvinceAllCities = () => {

    const allCitiesOfProvince = document.querySelectorAll(".city");

    return Array.from(allCitiesOfProvince).every(city => city.checked);
}
const prepareSelectItemsNames = (selectedItems) => {

    let selectItemNames = [];


    if (isAllCitiesSelected()) {

        selectItemNames = [];
        selectItemNames.push("کل ایران");

    } else {

        const uniqueSelectedCities = [...new Map(selectedItems.map(city => [city.id, city])).values()];

        const grouped = uniqueSelectedCities.reduce((acc, item) => {

            if (!acc[item.province_id]) acc[item.province_id] = [];

            acc[item.province_id].push(item);

            return acc;
        }, {});

        for (const provinceId in grouped) {

            const selectedCitiesOfProvince = grouped[provinceId];
            const allCitiesOfProvince = cities.filter((city) => +city.province_id === +provinceId);
            const province = provinces.find((province) => +province.id === +provinceId);

            const allSelected = selectedCitiesOfProvince.length === allCitiesOfProvince.length;

            if (allSelected) {

                selectItemNames.push(`همه شهرهای ${province.name}`);
            } else {

                selectedCitiesOfProvince.forEach(city => selectItemNames.push(city.name));
            }
        }
    }
    renderSelectedItems(selectItemNames);
}
const deleteItemsFromSelectItems = (Items, isArray) => {

    if (isArray) {

        const idsToRemove = Items.map(item => item.id);
        selectedItems = selectedItems.filter(city => !idsToRemove.includes(city.id));

    } else {

        selectedItems = selectedItems.filter(city => city.id !== Items.id);
    }
}
const openModal = () => {

    document.body.classList.add("overflow-y-hidden");
    selectedItems = [...localStorageCities];
    cityModal.classList.remove("hidden");
    renderProvinces();
    mainModal.scrollTo({top: 0, behavior: 'auto'});
    prepareSelectItemsNames(selectedItems);
    searchCitiesInput.value = "";
}
const closeModal = () => {

    cityModal.classList.add("hidden");
    selectedItems = [];
    document.body.classList.remove("overflow-y-hidden");
}

function isProvincePhrase(name) {
    return name.includes("همه شهرهای");
}

function getProvinceNameFromPhrase(name) {
    return name.replace("همه شهرهای", "").trim();
}

const pushObjNotDuplicated = (array) => {

    array.forEach(city => {
        if (!selectedItems.some(item => item.id === city.id)) {
            selectedItems.push(city);
        }
    });
}


// show city modal desktop
cityModalBtnDesktop.addEventListener("click", () => {

    openModal();
});

// show city modal mobile
cityModalBtnMobile.addEventListener("click", () => {

    openModal();
});

// close modal if clicked on overlay
cityModal.addEventListener("click", (event) => {

    if (event.target === cityModal) {
        closeModal();
    }
});

// close modal if clicked on enseraf
closeBtn.addEventListener("click", () => {
    closeModal();
});

// delete all
deleteAll.addEventListener("click", () => {

    const allCities = document.querySelector("#allCities");
    const allCitiesOfProvince = document.querySelectorAll(".city");
    const wholeIranCheckBox = document.querySelector("#whole-iran");

    selectedItems = [];
    prepareSelectItemsNames(selectedItems);

    if (allCitiesOfProvince) {

        allCitiesOfProvince.forEach((city) => city.checked = false);
    }

    if (wholeIranCheckBox) {

        wholeIranCheckBox.checked = false;
    }

    if (allCities) {

        allCities.checked = false;
    }
});

// modal show provinces
provinceCityContainer.addEventListener("click", (event) => {

    const wholeIran = event.target.closest("#whole-iran");

    if (wholeIran) {

        // selectWholeIran
        if (wholeIran.checked) {

            pushObjNotDuplicated(cities);

        } else {

            selectedItems = [];
        }
        prepareSelectItemsNames(selectedItems);
    }
});

// modal show cities
provinceCityContainer.addEventListener("click", (event) => {

    const provinceLi = event.target.closest(".province");
    const comebackToAllProvincesElement = event.target.closest(".comebackToAllProvinces");
    const singleCity = event.target.closest(".city");
    const markedAllCities = event.target.closest("#allCities");
    const allCitiesOfProvince = document.querySelectorAll(".city");
    const allCityInProvince = document.querySelector("#allCityInProvince");
    const allCities = document.querySelector("#allCities");

    // checked single city
    if (singleCity) {

        const singleCitySelected = cities.find((e) => e.id === Number(singleCity.id));

        if (singleCity.checked) {

            if (checkProvinceAllCities()) {

                allCities.checked = checkProvinceAllCities();
            }
            selectedItems.push(singleCitySelected);

        } else {

            allCities.checked = false;

            deleteItemsFromSelectItems(singleCitySelected, false);
        }
    }

    // checked all cities if checked checkedAllCitiesElement
    if (markedAllCities) {

        const wholeCitiesOfProvince = cities.filter((cities) => cities.province_id === Number(allCityInProvince.dataset.id));

        if (allCities.checked) {

            pushObjNotDuplicated(wholeCitiesOfProvince);
            allCitiesOfProvince.forEach((city) => city.checked = true);

        } else {

            allCitiesOfProvince.forEach((city) => city.checked = false);
            deleteItemsFromSelectItems(wholeCitiesOfProvince, true);
        }
    }

    // come to all provinces(Iran)
    if (comebackToAllProvincesElement) {

        renderProvinces();
        mainModal.scrollTo({top: 0, behavior: 'auto'});
    }

    // show cities of province that clicked
    if (provinceLi) {

        const citiesFiltered = cities.filter((city) => city.province_id === Number(provinceLi.id));
        renderCities(citiesFiltered, provinceLi.dataset.name, provinceLi.id);
        mainModal.scrollTo({top: 0, behavior: 'auto'});
    }
    prepareSelectItemsNames(selectedItems);
});

//deleteBtn with x-btn
selectedCitiesContainer.addEventListener("click", (event) => {

    const xBtnClicked = event.target.closest("#x-btn");
    const wholeIran = document.querySelector("#whole-iran");
    const allCitiesOfProvince = document.querySelectorAll(".city");
    const allCities = document.querySelector("#allCities");

    if (xBtnClicked) {

        const itemDeleted = xBtnClicked.dataset.name;

        // delete whole iran
        if (isAllCitiesSelected()) {

            if (wholeIran) {

                wholeIran.checked = false;
            }
            if (allCities) {

                allCitiesOfProvince.forEach(city => city.checked = false);
                allCities.checked = false;
            }
            selectedItems = [];
            prepareSelectItemsNames(selectedItems);
        }

        // delete single city && all city of province
        if (isProvincePhrase(itemDeleted)) {

            const provinceNameDeleted = getProvinceNameFromPhrase(itemDeleted);
            const provinceId = provinces.find((item) => item.name === provinceNameDeleted).id;
            const allCityOfProvinceDeleted = selectedItems.filter((item) => item.province_id === +provinceId);

            if (allCities) {

                allCitiesOfProvince.forEach(city => city.checked = false);
                allCities.checked = false;
            }
            deleteItemsFromSelectItems(allCityOfProvinceDeleted, true);

        } else {

            const cityObjDeleted = selectedItems.find((item) => item.name === itemDeleted);

            if (allCitiesOfProvince) {

                const cityInputDeleted = Array.from(allCitiesOfProvince).find(city => +city.id === +cityObjDeleted.id);
                if (cityInputDeleted) {

                    cityInputDeleted.checked = false;
                }
            }
            deleteItemsFromSelectItems(cityObjDeleted, false);
        }

        prepareSelectItemsNames(selectedItems);
    }
});

//search search search
searchCitiesInput.addEventListener("keyup", (event) => {

    if (event.keyCode === 8) {
        renderProvinces();
    }

    if (event.target.value) {

        const searchCityResults = cities.filter((city) => city.name.startsWith(event.target.value));

        if (searchCityResults.length) {

            provinceCityContainer.innerHTML = "";

            searchCityResults.forEach((city) => {

                provinceCityContainer.insertAdjacentHTML("beforeend", `

                    <label class="checkbox-container singleCity flex items-center justify-between cursor-pointer py-4">
                    <span class="cityName text-primary font-bold">${city.name}</span>
                    <input id="${city.id}" class="city custom-checkbox size-4" type="checkbox">
                    <span class="checkmark"></span>
                </label>
                `);
            });

        } else {

            provinceCityContainer.innerHTML = "";
            provinceCityContainer.insertAdjacentHTML("beforeend", `
            
                 <!--city empty-->
                <div id="empty-search" class="h-full flex flex-col items-center justify-center">
                    <img src="./images/city-search-icon.png" alt="">
                    <span class="text-secondary text-xs"> نتیجه ایی برای جستجوی شما یافت نشد.</span>
                </div>
            `);
        }
        checkExistence(true, searchCityResults);
    }
});

// confirm btn
submitBtn.addEventListener("click", () => {

    saveInLocalStorage("city", selectedItems);
    cityModal.classList.add("hidden");
    window.location.reload();
});







