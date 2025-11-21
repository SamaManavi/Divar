import {baseUrl, saveInLocalStorage} from "./utils.js";
import {renderSwalToast} from "./shared.js";

document.body.insertAdjacentHTML("beforeend", `

<!--login-->
<div id="modalLogin" class="max-h-screen flex items-end sm:items-center justify-center fixed inset-0 bg-black/50 backdrop-blur-[2px] size-full z-30 hidden">

    <!--modal signIn-->
    <div id="modalSignIn" class="w-full sm:w-125 md:w-125 max-h-150 md:h-auto bg-bgGray shadow-box rounded-lg">

        <header class="p-6 border-b border-secondary/20">
            <!--title-->
            <div class="flex items-center justify-between ">
                <h3 class="font-bold text-primary text-lg">ورود به حساب کاربری</h3>
                <svg id="xMark" class="size-4">
                    <use href="#x-mark"></use>
                </svg>
            </div>
        </header>

        <main class="flex flex-col gap-y-8 border-b border-secondary/20 px-6 py-11">

            <h3 class="font-bold text-primary text-lg">شماره موبایل خودرا وارد کنید</h3>
            <span id="textCheck">برای استفاده از امکانات دیوار، لطفاً شمارهٔ موبایل خود را وارد کنید. کد تأیید به این شماره پیامک خواهد شد.</span>
            <div class="relative">
                <input id="numberInput" type="number" autocomplete="tel" placeholder="شماره موبایل" dir="ltr"
                       class="border border-secondary/50 pr-2 pl-13 placeholder:text-right w-full rounded py-2  hover:border-primary/50">
                <button class="absolute top-1.5 left-2 rounded-full bg-secondary/10 py-1 px-2 text-sm text-primary">
                    98+
                </button>
                <span id="mobile-number-error" class="pt-1 text-red text-xs hidden">شماره تماس معتبر نیست.</span>
            </div>
            <div class="flex gap-x-1">
                <span class="text-red">شرایط استفاده خدمات </span>
                <span>و </span>
                <span class="text-red">حریم خصوصی </span>
                <span>دیوار را میپذیرم.</span>
            </div>
        </main>

        <footer class="py-3 px-5 border-b border-secondary/20">
            <div class="flex items-center justify-end gap-x-4">
                <div class="">
                    <button id="submitNumBtn"
                            class="flex items-center justify-center relative w-25 h-10 rounded border border-red text-black hover:bg-red/90 bg-red cursor-pointer font-bold px-6 py-1">
                        <span class="confirmText">تایید</span>
                        <!--mini loader-->
                        <div class="miniLoader h-10 w-25 absolute inset-0 flex items-center justify-center bottom-16  z-50 hidden">
                            <div class="w-5 h-5 border-4 border-t-red border-gray-300 rounded-full animate-spin"></div>
                        </div>
                    </button>
                </div>
            </div>
        </footer>
    </div>

    <!--modal OTP-->
    <div id="modalOTP" class="w-full sm:w-125 max-h-150 bg-bgGray rounded-md shadow-box hidden">
        <header class="flex flex-col gap-y-5 py-6 px-6 shadow-one">
            <div class="flex items-center justify-between">
                <h3 class="text-primary font-bold cursor-pointer">ورود به حساب کاریری</h3>
                <div id="loginModalXBtn" class="text-white/60 p-1.5 rounded-full text-xs hover:bg-white/5 hover:text-white">
                    <svg class="size-5">
                        <use href="#x-mark"></use>
                    </svg>
                </div>
            </div>
        </header>
        <main class="py-11 px-6">
            <div id="login-content-step2" class="">
                <h4 class="text-white font-bold">کد تایید را وارد کنید</h4>
                <p class="text-secondary text-sm pt-8 pb-6">
                    کد تایید ارسال شده به شماره <span id="users-phone-number"></span> را وارد کنید.
                </p>
                <div class="relative">
                    <input id="otp-code" type="number" placeholder="کد تایید 4 رقمی" class="w-full py-2 px-2 text-sm text-primary border border-secondary rounded-md direction-ltr placeholder:text-secondary placeholder:direction-rtl placeholder:text-right hover:border-primary">
                </div>
                <div class="flex justify-between items-center mt-4">
                
                <div>
                    <span id="otp-code-error" class="pt-1 text-red text-xs hidden">کد تایید معتبر نیست.</span>
                </div>
                
                    <button id="back-to-step1" class="justify-start bg-[#333] text-secondary py-1 px-2 rounded-full text-xs cursor-pointer hover:bg-[#333]/70">تغییر شماره موبایل</button>
                </div>
            </div>
        </main>
        <footer class="flex justify-end shadow-one bg-bgGray border-t border-secondary/20 p-4">
            <div id="login-footer-step1" class="hidden">
                <button id="submit-number-btn" class="h-10 w-25 flex justify-center items-center font-bold black bg-red py-1.5 px-6 hover:bg-[#c35767] transition-colors rounded-sm border-0 cursor-pointer">تایید</button>
            </div>
            <div id="login-footer-step2" class="flex items-center">
                <div id="request-timer" class="flex gap-x-6 items-center pl-10 text-secondary/50 text-sm font-bold hidden">
                    <span>درخواست مجدد</span>
                    <span id="timer"></span>
                </div>
                <button id="resend-code-btn" class="h-10 w-35 flex justify-center items-center font-bold black py-1 px-6 ml-4 text-red hover:bg-red/5 transition-colors rounded-sm border border-red cursor-pointer">
                    درخواست کد
                </button>
                <button id="verify-otp" class="h-10 w-25 flex justify-center items-center relative font-bold black bg-red py-1.5 px-8 hover:bg-[#c35767] transition-colors rounded-sm border-0 cursor-pointer">
                    <span class="confirmText">ورود</span>
                    <!--mini loader-->
                    <div class="miniLoader h-10 w-25 absolute inset-0 flex items-center justify-center bottom-16  z-50 hidden">
                        <div class="w-5 h-5 border-4 border-t-red border-gray-300 rounded-full animate-spin"></div>
                    </div>
                </button>
            </div>
        </footer>
    </div>
</div>

`);


const xMark = document.querySelector("#xMark");
const submitNumBtn = document.querySelector("#submitNumBtn");
const numberInput = document.querySelector("#numberInput");
const mobileNumberError = document.querySelector("#mobile-number-error");
const usersPhoneNumber = document.querySelector("#users-phone-number");
const resendCodeBtn = document.querySelector("#resend-code-btn");
const requestTimer = document.querySelector("#request-timer");
const timerElement = document.querySelector("#timer");
const verifyOtp = document.querySelector("#verify-otp");
const otpCodeInput = document.querySelector("#otp-code");
const otpCodeError = document.querySelector("#otp-code-error");
const modalSignIn = document.querySelector("#modalSignIn");
const modalOTP = document.querySelector("#modalOTP");
const modalLogin = document.querySelector("#modalLogin");
const backToStep1 = document.querySelector("#back-to-step1");

let timer = null;

const loginModal = () => {

    numberInput.value = "";
    mobileNumberError.classList.add("hidden");
    numberInput.focus();
    modalLogin.classList.remove("hidden");
    modalSignIn.classList.remove("hidden");
    modalOTP.classList.add("hidden");
}

const switchStep = (step) => {

    if (step === 'signIn') {

        modalSignIn.classList.remove("hidden");
        modalOTP.classList.add("hidden");

    } else if (step === 'OTP') {

        otpCodeInput.value = "";
        otpCodeError.classList.add("hidden");
        modalSignIn.classList.add("hidden");
        modalOTP.classList.remove("hidden");
    }
}

const sendOTP = async (phoneNumber) => {


    const response = await fetch(`${baseUrl}/v1/auth/send`, {

        method: "POST", headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify({
            phone: `${phoneNumber}`
        })
    });

    return response.ok;
}

const loaderHandler = (btn, status) => {

    const miniLoader = btn.querySelector(".miniLoader");

    const text = btn.querySelector(".confirmText");

    if (status) {

        btn.disabled = true;
        text.classList.add("hidden");
        miniLoader.classList.remove("hidden");

    } else {

        btn.disabled = false;
        text.classList.remove("hidden");
        miniLoader.classList.add("hidden");
    }
}

const OTPTimer = () => {

    resendCodeBtn.classList.add("hidden");
    requestTimer.classList.remove("hidden");
    let counter = 30;

    timerElement.innerHTML = `${counter}`;

    timer = setInterval(() => {

        counter--;
        timerElement.innerHTML = `${counter}`;

        if (counter === 0) {

            clearInterval(timer);
            requestTimer.classList.add("hidden");
            resendCodeBtn.classList.remove("hidden");
        }

    }, 1000);
}

const checkVerificationOfOTP = async (phoneNumber, OTPCode) => {

    const response = await fetch(`${baseUrl}/v1/auth/verify`, {

        method: "POST", headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify({phone: `${phoneNumber}`, otp: `${OTPCode}`})
    });

    return {status : response.ok, token:(await response.json()).data.token};
}


// close modal
modalLogin.addEventListener("click", (event) => {

    if (event.target === modalLogin) {

        modalLogin.classList.add("hidden");
    }
});

// close modal
xMark?.addEventListener("click", () => {

    modalLogin.classList.add("hidden");
});

//signIn modal submit number
submitNumBtn.addEventListener("click", async () => {

    const phoneNumber = numberInput.value;
    const phoneRegex = RegExp(/^09\d{9}$/);
    const isValidPhoneNumber = phoneRegex.test(phoneNumber);

    if (isValidPhoneNumber) {

        loaderHandler(submitNumBtn, true);
        const isOTPSent = await sendOTP(phoneNumber);
        loaderHandler(submitNumBtn, false);

        if (isOTPSent) {

            switchStep('OTP');
            clearInterval(timer);
            OTPTimer();
            usersPhoneNumber.innerHTML = `${phoneNumber}`
        }

    } else {
        mobileNumberError.classList.remove("hidden");
    }
});

// resend code
resendCodeBtn.addEventListener("click", async () => {

    const isOTPSent = await sendOTP(numberInput.value);

    if (isOTPSent) {

        OTPTimer();
        renderSwalToast('success', "کد با موفقیت ارسال شد");
    } else {
        renderSwalToast('error', 'خطا در ارسال کد');
    }
});

// verify OTP
verifyOtp.addEventListener("click", async () => {

    const OTPCode = otpCodeInput.value;
    const OTPRegex = RegExp(/^[0-9]{4}$/);
    const isValidOTPCode = OTPRegex.test(OTPCode);

    if (isValidOTPCode) {

        loaderHandler(verifyOtp, true);

        const response = await checkVerificationOfOTP(numberInput.value, OTPCode);

        if (response.status) {

            modalLogin.classList.add("hidden");
            renderSwalToast('success', 'با موفقیت وارد شدید');
            saveInLocalStorage("token", response.token);

        } else {

            otpCodeInput.innerHTML = "";
            otpCodeError.classList.remove("hidden");
        }

        loaderHandler(verifyOtp, false);

    } else {
        otpCodeError.classList.remove("hidden");
    }
});

// back-to-step1
backToStep1.addEventListener("click", () => {

    switchStep('signIn');
})

export {loginModal,}