import React, { useContext, useRef, useState } from "react";

import { StyleSheet, View } from "react-native";
import TextComponent from "../components/TextComponent";
import { colors } from "../css/colors";
import { Style } from "../css/styles";
import { LocalizationContext } from "../locale/LocalizationContext";

const TimerView = ({

}) => {
    const { translations } = useContext(LocalizationContext);
    const [time, setTime] = useState(863410);
    const timerRef = useRef(time);
    const timeStr = useRef("2H:29Min");
    const dayStr = useRef("14 Jours");

    return (
        <View style={[Style.flex1Style, styles.timerContainer]}>
            <TextComponent
                text={translations.still_have}
                textStyle={[styles.expiryTime, Style.boldTextStyle, Style.text8Style]}
            />
            <View style={[Style.rowDirection]}>
                <TextComponent
                    text={dayStr.current}
                    textStyle={[styles.days, Style.boldTextStyle, Style.text16Style]}
                />
                <TextComponent
                    text={" " + timeStr.current}
                    textStyle={[styles.hours, Style.boldTextStyle, Style.text16Style]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    timerContainer: {
        marginHorizontal: 16,
        borderRadius: 4,
        padding: 8,
        marginTop: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.home_username_color,
    },
    expiryTime: {
        color: colors.white,
        marginBottom: 12,
    },
    days: {
        color: colors.home_top_bg_color,
    },
    hours: {
        color: colors.white,
    },
});
export default TimerView;