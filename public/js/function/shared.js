import {baseUrl} from "./utils.js";

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



export {getSocial, showSocial}