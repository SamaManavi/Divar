import {isLogin, logOut} from "../../function/auth.js";

const phoneNumberMyDivarSidebar = document.querySelector("#phoneNumberMyDivarSidebar");
const myDivarLogout = document.querySelector("#myDivarLogout");


if (!await isLogin()) location.href = "../main.html";

const phoneNumber = (await isLogin()).phone;

phoneNumberMyDivarSidebar.innerHTML = `${phoneNumber}`;
myDivarLogout.addEventListener("click", () => {

    logOut();
});


export {phoneNumber}