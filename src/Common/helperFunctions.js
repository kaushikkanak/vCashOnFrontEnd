
export const splitDate = (date) => {
    if(date){
        let _date = date.split("T")[0]
        return _date
    }else{
        return
    }
}

export const isAutheticated = () => {
    if (typeof window == "undefined") {
        return false;
    }
    if (localStorage.getItem("token")) {
        return true;
    } else {
        return false;
    }
};

export const passwordValidation = (password) => {
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    if (password.match(upperCaseLetters) &&
        password.match(numbers) &&
        password.length >= 8
        ) {
        return true
    } else {
        return false
    }
}