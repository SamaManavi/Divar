import {loginModal, logOut} from "../function/auth.js";
import {renderModal} from "../function/myDivar.js";


const myDivarBtnDesk = document.querySelector("#myDivarBtn");
const myDivarModal = document.querySelector("#myDivarModal");

// open dropdown
myDivarBtnDesk.addEventListener("click", async (event) => {

    event.stopPropagation();
    myDivarModal.classList.remove("hidden");
    await renderModal(myDivarModal);
});

// close dropdown
document.addEventListener("click", () => {

    myDivarModal.classList.add("hidden");
})

myDivarModal.addEventListener("click", (event) => {

    const menuOption = event.target.closest(".menuOption");
    const menuOptionLogin = event.target.closest(".menuOptionLogin");
    const Exit = event.target.closest(".Exit");

    if (menuOption) {
        loginModal();
    }

    if (menuOptionLogin) {

        location.href = `${menuOptionLogin.dataset.adrs}`
    }

    if (Exit){
        logOut();
    }
});