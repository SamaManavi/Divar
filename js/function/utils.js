const baseUrl = "https://divarapi.liara.run";

const saveInLocalStorage = (key, value) => {

    localStorage.setItem(key, JSON.stringify(value));
}

const getFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const removeFromLocalStorage = (key) => {

    localStorage.removeItem(`${key}`);
}

// calculate time of created product
const calculateTimePassed = (date) => {

    const now = new Date();
    const createdDate = new Date(date);

    const timeDifference = now - createdDate;
    const min = Math.floor(timeDifference / 1000 / 60);
    const hour = Math.floor(min / 60);
    const day = Math.floor(hour / 24);
    const month = Math.floor(day / 30);
    const year = Math.floor(month / 12);

    if (min < 1) {
        return "لحظاتی قبل";
    } else if (min < 15) {
        return `دقایقی قبل`;
    } else if (min < 30) {
        return `یک ربع قبل`;
    } else if (min < 45) {
        return `نیم ساعت قبل`;
    } else if (hour < 1) {
        return `45 دقیقه قبل`;
    } else if (day < 1) {
        return `${hour} ساعت قبل`;
    } else if (month < 1) {
        return `${day} روز قبل`;
    } else if (year < 1) {
        return `${month} ماه قبل`;
    } else {
        return `${year} سال قبل`;
    }
}

const addToSearchParam = (param, value) => {

    const url = new URL(location.href);

    const searchParam = url.searchParams;

    searchParam.set(param, value);

    url.search = searchParam.toString();

    location.href = url.toString();
}

const getFromSearchParam = (param) => {

    const urlParams = new URLSearchParams(location.search);
    return urlParams.get(param);
}

const removeParamFromUrl = (param) => {

    const url = new URL(location.href);
    url.searchParams.delete(param);
    window.history.replaceState(null, null, url);
    location.reload();
}




export {
    baseUrl,
    saveInLocalStorage,
    getFromLocalStorage,
    calculateTimePassed,
    addToSearchParam,
    getFromSearchParam,
    removeParamFromUrl,
    removeFromLocalStorage,
    getToken,
}
