import {findCityObj, getAllLocations, showPopularCities} from "../function";
import {getFromLocalStorage, saveInLocalStorage} from "../function/utils.js";
import {getSocial, showSocial} from "../function/shared.js";

const popularCitiesContainer = document.querySelector("#popular-cities");
const socialsContainer = document.querySelector("#socials-container")
const loader = document.querySelector("#loader");
const citySearchResult = document.querySelector("#city-search-result");
const searchCityInput = document.querySelector("#search-city-input");
const citiesSearchedContainer = document.querySelector("#searched-city");
const emptySearch = document.querySelector("#empty-search");

window.addEventListener("load", async () => {

    if (getFromLocalStorage("city")) {

        window.location.href = "main.html";

    } else {

        // get all cities
        const fetchedCities = await getAllLocations();
        const cities = fetchedCities.data.cities;

        // control load
        loader.classList.add("hidden");

        // show popular cities
        const popularCities = cities.filter((city) => city.popular);
        showPopularCities(popularCities, popularCitiesContainer);

        // show social
        const social = await getSocial();
        showSocial(social, socialsContainer);

        //search cities
        searchCityInput.addEventListener("keyup", (event) => {

            if (event.target.value) {

                citySearchResult.classList.remove("hidden");

                const searchCityResults = cities.filter((city) => city.name.startsWith(event.target.value));

                if (searchCityResults.length) {

                    citiesSearchedContainer.innerHTML = "";
                    emptySearch.classList.add("hidden");

                    searchCityResults.forEach((city) => {

                        citiesSearchedContainer.insertAdjacentHTML("beforeend", `
                        <li id="${city.id}" class="cityName" data-city="${city.name}">${city.name}</li>
                    `);
                    })

                } else {

                    citiesSearchedContainer.innerHTML = "";
                    emptySearch.classList.remove("hidden");
                }

            } else {

                citySearchResult.classList.add("hidden");
            }

        });

        //go to city page
        citiesSearchedContainer.addEventListener("click", (event) => {

            const cityLi = event.target.closest(".cityName");

            const citySelected = findCityObj(cities, +cityLi.id);

            if (cityLi) {

                saveInLocalStorage('city', [citySelected]);
                location.href = "main.html"
            }
        });

        popularCitiesContainer.addEventListener("click", (event) => {

            const cityLi = event.target.closest(".cityName");

            const citySelected = findCityObj(cities, +cityLi.id);

            if (cityLi) {

                saveInLocalStorage('city', [citySelected]);
                location.href = "main.html"
            }
        });

    }
});

