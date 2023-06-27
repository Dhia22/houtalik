import numbro from "numbro";
import { Alert, Platform, StatusBar } from "react-native";

const statusBarHeight = Platform.OS == "ios" ? 0 : StatusBar.currentHeight;
const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

function getAlertInString(eventTime, data) {
    var time = "";
    data.map(alert => {
        if (alert.value === eventTime) {
            time = alert.time;
        }
    });
    return time;
}

function getBytesInSize(sizeInBytes) {
    var sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    return sizeInMB;
}

function showNoInternet(translations) {
    Alert.alert(translations.internet_connection, translations.no_internet_available, [
        { text: translations.ok, onPress: () => { } },
    ]);
}

function showApiError(translations) {
    Alert.alert(translations.error, translations.error_api, [
        { text: translations.ok, onPress: () => { } },
    ]);
}

function showMessageDialog(translations, title, message) {
    Alert.alert(title, message, [
        { text: translations.ok, onPress: () => { } },
    ]);
}

function showMessageDialogWithCallback(translations, title, message, onPress = null) {
    Alert.alert(title, message, [
        {
            text: translations.ok, onPress: onPress
        },
    ]);
}

function getNumberFormat(number) {
    return numbro(number).format({
        thousandSeparated: true,
        mantissa: 3 // number of decimals displayed
    })
}

function getFormattedDate(date, delimeter, dayIndex, monthIndex, yearIndex) {
    var parts = date.split(delimeter);
    var mydate = new Date();
    mydate.setDate(parts[dayIndex]);
    mydate.setMonth(parts[monthIndex]);
    mydate.setFullYear(parts[yearIndex]);
    return parts[dayIndex].toString() + " " + mois[mydate.getMonth() - 1] + " " + parts[yearIndex].toString();
}


function isLoggedIn(authentication) {
    return (authentication.user != null && authentication.user.token != null && authentication.user.token != "")
}

function isShop(item){
    return (item.raisonSociale === undefined)
}

function captializeWord(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getRandomNumber(id){
    return '?'+Math.floor((Math.random() * 100) + 1 + id).toString()
}

export { getAlertInString, 
    getBytesInSize, 
    statusBarHeight, 
    showNoInternet, 
    showApiError, 
    showMessageDialog, 
    getNumberFormat, 
    showMessageDialogWithCallback, 
    getFormattedDate, 
    isLoggedIn, 
    isShop,captializeWord,
    getRandomNumber,
 } 