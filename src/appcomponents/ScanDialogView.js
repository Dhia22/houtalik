import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { colors } from "../css/colors";
import Card from "../components/Card/Card";
import TextComponent from "../components/TextComponent";
import { LocalizationContext } from "../locale/LocalizationContext";
import { Style } from "../css/styles";
import AntDesign from "react-native-vector-icons/AntDesign";
import QRCode from "react-native-qrcode-svg";
import NetInfo from "@react-native-community/netinfo";
import { showNoInternet } from "../utils/AppUtils";
import * as service from '../utils/apis/services';

const ScanDialogView = ({ navigation }) => {
    const { translations } = useContext(LocalizationContext);
    const [qrString, setQRString] = useState("");
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(0);
    const [time, setTime] = useState(timerRef.current);

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                if (timerRef.current === 0) {
                    getQRCodeDetail();
                }
            } else {
                showNoInternet(translations);
            }
        });
    }, [seconds]);

    // scan dialog cancel button click event handler
    function onCancelDialog() {
        navigation.goBack();
    }

    async function getQRCodeDetail() {
        const result = await service.getQRCodeDetail();
        if (result != null && result.QRcode && result.QRcode != "" && result.ageInSeconds && result.ageInSeconds != "") {
            timerRef.current = result.ageInSeconds;
            setQRString(result.QRcode);
            setSeconds(result.ageInSeconds);
        } else {
            showApiError(translations);
        }
    }

    const TimerView = () => {

        var mOut = Math.floor(timerRef.current / 60);
        var sOut = timerRef.current - (mOut * 60);
        let minutePrefix = "";
        if (mOut < 10) {
            minutePrefix = "0";
        }
        let secondPrefix = "";
        if (sOut < 10) {
            secondPrefix = "0";
        }
        const timeVaOut = minutePrefix.toString() + mOut + ":" + secondPrefix.toString() + sOut;
        const timeStr = useRef(timeVaOut);
        useEffect(() => {
            const timerId = setInterval(() => {
                timerRef.current -= 1;
                var m = Math.floor(timerRef.current / 60);
                var s = timerRef.current - (m * 60);
                let minutePrefix = "";
                if (m < 10) {
                    minutePrefix = "0";
                }
                let secondPrefix = "";
                if (s < 10) {
                    secondPrefix = "0";
                }
                const timeVa = minutePrefix.toString() + m + ":" + secondPrefix.toString() + s;
                if (timerRef.current < 0) {
                    timerRef.current = 0;
                    clearInterval(timerId);
                    setQRString("");
                    setSeconds(0);
                } else {
                    timeStr.current = timeVa;
                    setTime(timerRef.current);
                }
            }, 1000);
            return () => {
                clearInterval(timerId);
            };
        }, [time]);

        return (
            <TextComponent
                noOfLine={1}
                text={timeStr.current}
                textStyle={[styles.timer, Style.text32Style, Style.boldTextStyle]}
            />
        )
    }

    return (

        <View style={styles.centeredView}>
            <View style={[{ width: '86%' }]}>
                {seconds > 0 ?
                    <Card style={[styles.card]}>
                        <AntDesign name="closecircle" size={24} color={colors.hello_color}
                            style={[styles.closeIcon]}
                            onPress={onCancelDialog} />

                        <TimerView />
                        <TextComponent
                            noOfLine={1}
                            text={translations.scan_qr_code}
                            textStyle={[styles.message, Style.text14Style, Style.boldTextStyle]}
                        />
                        <View style={[Style.centerChilderns, { marginBottom: 32, height: 240 }]}>
                            {qrString != "" && <QRCode
                                value={qrString}
                                logoSize={200}
                                logoBackgroundColor='transparent'
                            />}
                        </View>
                    </Card > : <ActivityIndicator color={colors.hello_color} size={"large"} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: colors.bg_dialog_color,
        alignItems: "center",
        justifyContent: 'center',
    },
    card: {
        alignItems: 'center',
        height: 380,
    },
    closeIcon: {
        position: 'absolute',
        right: 4,
        zIndex: 1,
        marginTop: 4,
    },
    addProductContainer: {
        backgroundColor: colors.home_username_color,
        borderRadius: 8,
        paddingVertical: 16,
        color: colors.white,
        marginTop: 12,
        marginHorizontal: 16,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmerButton: {
        color: colors.white,
    },
    addWholeListContainer: {
        backgroundColor: colors.home_top_bg_color,
        borderRadius: 8,
        paddingVertical: 16,
        color: colors.white,
        marginTop: 6,
        marginHorizontal: 16,
        marginBottom: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timer: {
        marginTop: 32,
        marginHorizontal: 16,
        marginBottom: 6,
        color: colors.hello_color,
        alignSelf: 'center',
    },
    message: {
        marginTop: 6,
        marginHorizontal: 16,
        marginBottom: 12,
        color: colors.home_username_color,
        alignSelf: 'center',
    },
});

export default ScanDialogView;