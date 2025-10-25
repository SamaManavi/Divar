import {getAllLocations} from "./index.js";

document.body.insertAdjacentHTML("beforeend", `

        <!--modal show city-->
        <div id="cityModal" class="max-h-screen flex items-center justify-center fixed inset-0 bg-black/50 backdrop-blur-[2px] size-full z-30 hidden">
            <!--modal-->
            <div id="cityModalContent" class="flex flex-col w-full h-full md:w-125 md:h-auto bg-bgGray shadow-box rounded-lg">

        <header class="shrink-0 py-4 px-5 space-y-7 border-b border-secondary/20">

            <!--title-->
            <div class="flex items-center justify-between ">
                <h3 class="font-bold text-primary text-lg">انتخاب شهر</h3>
                <button class="text-red text-xs rounded-full hover:bg-red/10 p-2 cursor-pointer transition-colors duration-300 select-none">
                    حذف همه
                </button>
            </div>

            <!--selected cities-->
            <div id="selectedCitiesContainer" class="flex items-center gap-x-3 overflow-hidden">

                <div class="flex items-center gap-x-1  text-red text-xs bg-red/5 border border-red rounded-full px-3 py-1.5">
                    <span>تهران</span>
                    <svg class="size-3 cursor-pointer">
                        <use href="#x-mark"></use>
                    </svg>
                </div>
            </div>

            <!--search cities-->
            <div class="relative">
                <input type="text" placeholder="جستجو در شهر ها"
                       class="w-full h-10 rounded border border-secondary/50 py-px pr-10 pl-4 focus:border-primary/60">
                <svg class=" size-5 absolute top-2.5 right-3">
                    <use href="#magnifying-glass"></use>
                </svg>
            </div>
        </header>

        <main class="flex-1 px-5 sm:max-h-90 overflow-auto custom-scroll">
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
                    <button class="flex items-center justify-center w-full h-10 rounded border border-red text-black hover:bg-red/90 bg-red cursor-pointer font-bold">
                        تایید
                    </button>
                </div>
            </div>
        </footer>
    </div>
        </div>
    `);


const cityModal = document.querySelector("#cityModal");
const cityModalBtnMobile = document.querySelector("#cityModalBtnMobile");
const cityModalBtnDesktop = document.querySelector("#cityModalBtnDesktop");
const closeBtn = document.querySelector("#closeBtn");
const provinceCityContainer = document.querySelector("#province-city-container");


cityModalBtnDesktop.addEventListener("click", () => {

    cityModal.classList.remove("hidden");
});
cityModalBtnMobile.addEventListener("click", () => {

    cityModal.classList.remove("hidden");
});

cityModal.addEventListener("click", (event) => {

    if (event.target === cityModal) {

        cityModal.classList.add("hidden");
    }
});

closeBtn.addEventListener("click", () => {

    cityModal.classList.add("hidden");
});

// show provinces
const locations = await getAllLocations();

const provinces = locations.data.provinces;
const cities = locations.data.cities;

const renderProvinces = () => {

    provinceCityContainer.innerHTML = "";
    provinceCityContainer.insertAdjacentHTML("beforeend", `

    <li class="">
                            <label for="whole-iran" class="checkbox-container flex items-center justify-between cursor-pointer py-4">
                                <span class="text-primary font-bold">کل ایران</span>
                                <input id="whole-iran" class="custom-checkbox size-4" type="checkbox">
                                <span class="checkmark"></span>
                            </label>
                        </li>
`)
    provinces.forEach((province) => {

        provinceCityContainer.insertAdjacentHTML("beforeend", `
        <li class="province" id="${province.id}">
            <button class="flex items-center justify-between gap-x-3 py-4 w-full">
                <span class="text-primary font-bold">${province.name}</span>
                <svg class="size-5 rotate-90">
                    <use href="#chevron-down"></use>
                </svg>
            </button>
        </li>
    `)
    });
}

const renderCities = (citiesFiltered) => {

    provinceCityContainer.innerHTML = "";

    provinceCityContainer.insertAdjacentHTML("beforeend", `

        <!--برگشت به استان ها (->ایران)-->
        <li>
                        <button class="flex items-center justify-start gap-x-3 py-4">
                            <svg class="size-5">
                                <use href="#arrow-right"></use>
                            </svg>
                            <span>کل ایران</span>
                        </button>
                    </li>
    `);

    citiesFiltered.forEach((city) => {

        provinceCityContainer.insertAdjacentHTML("beforeend", `

            <label class="checkbox-container flex items-center justify-between cursor-pointer py-4">
                <span class="text-primary font-bold">${city.name}</span>
                <input class="city custom-checkbox size-4" type="checkbox">
                <span class="checkmark"></span>
            </label>
        `);
    });
}


renderProvinces();

provinceCityContainer.addEventListener("click", (event) => {

    const provinceLi = event.target.closest(".province");

    if (provinceLi) {

        const citiesFiltered = cities.filter((city) => city.province_id === Number(provinceLi.id));

        renderCities(citiesFiltered)
    }
});















