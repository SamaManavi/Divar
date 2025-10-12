import {baseUrl} from "./utils.js";


const getAllCities = async () => {

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

const getSocial = async () => {

    const response = await fetch(`${baseUrl}/v1/social`);
    return await response.json();
}
const showSocial = (social, socialsContainer) => {


    social.data.socials.forEach((social) => {

        socialsContainer.insertAdjacentHTML("beforeend", `

                <a href="${social.link}">
                    <img class="size-5" src="${baseUrl}/${social.icon.path}" alt="${social.name}">
                </a>
            `)
    });
}






export {getAllCities, getSocial, showPopularCities, showSocial}