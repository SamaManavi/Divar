import {isLogin} from "../../function/auth.js";
import {renderSwalToast} from "../../function/shared.js";
import {baseUrl, getToken} from "../../function/utils.js";
import {phoneNumber} from "./shared.js";

const verifyNationalCode = document.querySelector("#verifyNationalCode");
const verifyBtn = document.querySelector("#verifyBtn");
const verified = document.querySelector("#verified");
const notVerified = document.querySelector("#notVerified");
const verificationDate = document.querySelector("#verificationDate");
const loader = document.querySelector("#loader");


const isVerified = (await isLogin()).verified;
const verificationTime = (await isLogin()).verificationTime;

if (isVerified) {

    verified.classList.remove("hidden");
    notVerified.classList.add("hidden");
    verificationDate.innerHTML = `${verificationTime.slice(0, 10)}`;
    loader.classList.add("hidden");

} else {

    verified.classList.add("hidden");
    notVerified.classList.remove("hidden");

    loader.classList.add("hidden");

    verifyBtn.addEventListener("click", async () => {

        const nationalCode = verifyNationalCode.value;
        const last2DigitPhoneNumber = phoneNumber.slice(-2);

        if (nationalCode.length === 10) {

            if (nationalCode.slice(-2) === last2DigitPhoneNumber) {

                const response = await fetch(`${baseUrl}/v1/user/identity`, {

                    headers: {
                        Authorization: `Bearer ${getToken()}`, "content-type": "application/json",
                    }, method: "POST", body: JSON.stringify({nationalCode})
                });

                if (response.ok) {

                    location.reload();

                } else {

                    renderSwalToast("error", "تایید هویت با خطا مواجه شد");
                }

            } else {

                renderSwalToast("warning", "کد ملی معتبر نیست");
            }

        } else {
            renderSwalToast("warning", "کد ملی باید 10 رقم باشد");
        }
    });

}


