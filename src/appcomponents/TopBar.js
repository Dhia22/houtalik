import React from "react";

import { Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackIcon from '../../images/ic_back.svg';
import TextComponent from "../components/TextComponent";
import { colors } from "../css/colors";
import { Style } from "../css/styles";
import { statusBarHeight } from "../utils/AppUtils";

const TopBar = ({
    title,
    showTitle = false,
    titleStyle,
    centerTitle,
    showCenterTitle = false,
    centerTitleStyle,
    showNavigation = true,
    navigation }) => {
   
    function onBackClicked() {
        navigation.goBack();
    }
   
    return (
        <View style={{
            paddingHorizontal: 0,
            flexDirection: 'row',
            height: 48,
            
            alignItems: 'center',
            paddingHorizontal: 16,
            backgroundColor: colors.white
        }}>
            {/* {showTitle &&
                <TextComponent
                    text={title}
                    textStyle={[titleStyle, Style.boldTextStyle, Style.text16Style, Style.flex1Style]}
                />} */}
            {showNavigation &&
                <Pressable 
                style={{
                    height:24,
                    width:24,
                }}
                onPress={() => {
                    onBackClicked();
                }}>
                <View style={{
                    height:24,
                    width:24,
                }}>
                <BackIcon height={20} width={22} />
                </View>
                </Pressable>
            }
            {showCenterTitle &&
                <View style={[Style.flex1Style, { alignItems: 'center', justifyContent: 'center' }]}>
                    <TextComponent
                        text={centerTitle}
                        textStyle={[centerTitleStyle, styles.centerTitleStyle]}
                    /></View>}
        </View>
    );
}

const styles = StyleSheet.create({
    defaultErrorTextStyle: {
        color: colors.red,
    },
    textInputStyle: {
        height: 48,
        paddingHorizontal: 8,
        flex: 1,
    },
    centerTitleStyle: {
        paddingHorizontal: 8,
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    badgeTextColor: {
        color: colors.white,
    },
    badgeViewStyle: {
        backgroundColor: 'red',
        height: 20,
        width: 20,
        borderRadius: 20,
        position: 'absolute',
        right: -4,
        top: -4,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
export default TopBar;