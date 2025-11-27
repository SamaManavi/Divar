import {isLogin} from "../../function/auth.js";

const phoneNumberMyDivarSidebar = document.querySelector("#phoneNumberMyDivarSidebar");

if (!await isLogin()) location.href = "../main.html";

const phoneNumber = (await isLogin()).phone;

phoneNumberMyDivarSidebar.innerHTML = `${phoneNumber}`;


export {phoneNumber}