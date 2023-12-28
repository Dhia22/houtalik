

const isEmpty = (str) => (!str?.length);

const isNullOrEmpty = (str) => {
    if(str === undefined){
        return true;
    }
    if(str === null){
        return true;
    }
    return (str.trim().length === 0);
};

const isEmailValid = (str) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return !reg.test(str.trim());
};

const isPhoneNumberValid = (str) => {
    return !(str.trim().match(/\d/g).length === 10);
};

const isPasswordValid = (str) => {
    return !(str.trim().length >= 8 && str.trim().length < 13);
};

const isConfirmPasswordMatched = (password, confirmPassword) => {
    return !(password.trim() === confirmPassword.trim());
};

export { isEmpty, isEmailValid, isNullOrEmpty, isPhoneNumberValid, isPasswordValid, isConfirmPasswordMatched }