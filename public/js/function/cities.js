import {baseUrl} from "./utils.js";

const getAllLocations = async () => {

    const response = await fetch(`${baseUrl}/v1/location`);
    return await response.json();
}

const showPopularCities = (popularCities, popularCitiesContainer) => {

    popularCities.forEach((city) => {

        popularCitiesContainer.insertAdjacentHTML("beforeend", `
            <span id="${city.id}" class="cityName cursor-pointer" data-city="${city.name}">${city.name}</span>
            `);
    });
}

const findCityObj = (cities, cityId) => {

    return cities.find(city => city.id === cityId);
}


export {getAllLocations, showPopularCities, findCityObj}