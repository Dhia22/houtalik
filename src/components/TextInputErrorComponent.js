import React from "react";

import TextComponent from "./TextComponent";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../css/colors";
import ImageComponent from "./ImageComponent";
import { Style } from "../css/styles";

const TextInputErrorComponent = ({
    text,
    inputStyle,
    showIcon = false,
    icon = null,
    hasPlaceHolder = false,
    placeholderTextColor = '#000000',
    placeHolderText,
    textStyle,
    errorText = null,
    errorTextStyle = styles.defaultErrorTextStyle,
    secureText = false,
    onChangeText,
    noOfLine = 1,
    keyboardType = 'default', }) => {

    const [error, setError] = useState("");
    return (
        <View style={{
            paddingHorizontal: 0,
            flex:1,
        }}>
            <View style={[{
                flexDirection: 'row'
            }, inputStyle]}>
                {showIcon &&
                    <ImageComponent
                        resizeMode="contain"
                        url={icon}
                        imgStyle={{
                            height: 24,
                            width: 24,
                            alignSelf: 'center',
                        }} />}
                <TextInput
                    placeholder={(hasPlaceHolder) ? placeHolderText : ""}
                    style={[textStyle, styles.textInputStyle, Style.text14Style]}
                    value={text}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={(text) => {
                        onChangeText(text);
                    }}
                    keyboardType={keyboardType}
                    numberOfLines={noOfLine}
                    secureTextEntry={secureText}
                    underlineColorAndroid="transparent"
                />
            </View>
            <TextComponent
                text={errorText}
                textStyle={errorTextStyle} />
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
    }
});
export default TextInputErrorComponent;