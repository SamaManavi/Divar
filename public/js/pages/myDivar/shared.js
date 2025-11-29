import {isLogin, logOut} from "../../function/auth.js";

const phoneNumberMyDivarSidebar = document.querySelector("#phoneNumberMyDivarSidebar");
const myDivarLogout = document.querySelector("#myDivarLogout");
const comeback = document.querySelector("#comeback");



if (!await isLogin()) location.href = "../main.html";

const phoneNumber = (await isLogin()).phone;

phoneNumberMyDivarSidebar.innerHTML = `${phoneNumber}`;
myDivarLogout.addEventListener("click", () => {

    logOut();
});
comeback.addEventListener("click", () => history.back());

export {phoneNumber}