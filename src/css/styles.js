import { statusBarHeight } from "../utils/AppUtils";
import { colors } from "./colors";

export const Style = {

    font: {
        black: "KumbhSans-Black",
        bold: "KumbhSans-Bold",
        extraBold: "KumbhSans-ExtraBold",
        extraLight: "KumbhSans-ExtraLight",
        light: "KumbhSans-Light",
        medium: "KumbhSans-Medium",
        regular: "KumbhSans-Regular",
        semiBold: "KumbhSans-SemiBold",
        thin: "KumbhSans-Thin",
    },
    boldTextStyle: {
        fontFamily: "KumbhSans-Medium",
    },
    semiBoldTextStyle: {
        fontFamily: "KumbhSans-SemiBold",
    },
    mediumTextStyle: {
        fontFamily: "KumbhSans-Medium",
    },
    regularTextStyle: {
        fontFamily: "KumbhSans-Medium",
    },
    lightTextStyle: {
        fontFamily: "KumbhSans-Medium",
    },
    capitalizeTextStyle: {
        textTransform: 'capitalize',
    },
    text6Style: {
        fontSize: 6,
    },
    text8Style: {
        fontSize: 8,
    },
    text10Style: {
        fontSize: 10,
    },
    text11Style: {
        fontSize: 10,
    },
    text12Style: {
        fontSize: 12,
    },
    text14Style: {
        fontSize: 14,
    },
    text16Style: {
        fontSize: 16,
    },
    text18Style: {
        fontSize: 18,
    },
    text20Style: {
        fontSize: 20,
    },
    text24Style: {
        fontSize: 24,
    },
    text22Style: {
        fontSize: 22,
    },
    text28Style: {
        fontSize: 28,
    },
    text32Style: {
        fontSize: 32,
    },
    text40Style: {
        fontSize: 40,
    },
    text46Style: {
        fontSize: 46,
    },
    greyHeaderViewStyle: {
        backgroundColor: colors.header_bg_color,
    },
    greyAppBackgroundStyle: {
        backgroundColor: colors.header_bg_color,
    },
    whiteAppBackgroundStyle: {
        backgroundColor: colors.white,
    },
    transparentStyle: {
        backgroundColor: colors.transparent,
    },
    flex1Style: {
        flex: 1,
    },
    todayTextColorStyle: {
        color: colors.today_text_color,
    },
    rowDirection: {
        flexDirection: 'row',
    },
    screenBgColor: {
        backgroundColor: colors.screen_bg_color,
    },
    introScreen: {
        backgroundColor: colors.white,
        flex: 1,
    },
    width50Screen: {
        width: '50%',
    },
    centerChilderns: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    centerFilterChilderns: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingTop: 4,
        paddingBottom: 4,
    },
    topBarContainer: {
        paddingTop: statusBarHeight,
        backgroundColor: colors.home_top_bg_color
    },
    introDefaultScreen: {
        backgroundColor: colors.splash_bg_color,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
}
