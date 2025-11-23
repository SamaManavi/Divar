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
const renderSwalCallInfo = () => {

    Swal.fire({
        html: `
            <div id="overlay" class="flex items-center justify-center fixed inset-0 bg-black/50 backdrop-blur-[2px] size-full z-30">
                <div class="max-w-125 bg-bgGray shadow-box rounded-lg">
                    <header class="p-4 w-full">
                        <div id="closeBtn" class="flex items-center justify-end">
                        <svg class="size-6">
                        <use href="#x-mark"></use>
                    </svg>
                    </div>
                    </header>
                    <main class="flex flex-col w-full gap-y-8 border-b border-secondary/20 px-6 py-5 text-white">
                        <div class="flex items-center justify-between w-full">
                    <div>
                        <h3>شماره موبایل</h3>
                    </div>

                    <div class="flex items-center gap-x-3">
                        <span class="text-red">09888888888</span>
                        <svg class="size-5">
                            <use href="#copy"></use>
                        </svg>
                    </div>
                </div>
                        <div class="flex flex-col items-center justify-center bg-[#545454] text-xs py-4 px-10 rounded gap-y-1 text-white">
                    <span>درخواست بیعانه، از نشانه‌های کلاهبرداری</span>
                    <p class="pt-2">برای هر نوع پرداخت (بیعانه یا کل مبلغ)، از «پرداخت امن» استفاده کنید.</p>
                </div>
                    </main>
                </div>
            </div>
            `, showConfirmButton: false, didOpen: () => {
            const overlay = document.getElementById("overlay");
            const modal = document.getElementById("modal");
            const closeBtn = document.getElementById("closeBtn");

            // کلیک روی X = بستن
            closeBtn.addEventListener("click", () => {
                Swal.close();
            });

            // کلیک روی اوورلی (خارج از مودال) = بستن
            overlay.addEventListener("click", (event) => {
                if (event.target === overlay) {
                    Swal.close();
                }
            });
        }
    });

}
const renderSwalToast = (icon, title) => {

    Swal.fire({

        icon,
        title,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#333',
        color: '#ffffffde',
    });
}


export {getSocial, showSocial, renderSwalCallInfo, renderSwalToast}