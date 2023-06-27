import React from "react";

import TextComponent from "./TextComponent";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../css/colors";

const TextInputMultilineComponent = ({ text, hasPlaceHolder = false, placeHolderText, textStyle, errorText, errorTextStyle = styles.defaultErrorTextStyle, secureText = false, onPress = null, onChangeText, endEditing }) => {

    const [error, setError] = useState("");
    return (
        <View style={{
            paddingHorizontal: 0,
        }}>
            <TextInput
                placeholder={(hasPlaceHolder) ? placeHolderText : ""}
                style={[textStyle, styles.textInputStyle]}
                value={text}
                onChangeText={(text) => {
                    onChangeText(text);
                }}
                multiline={true}
                secureTextEntry={secureText}
                textAlignVertical='top'
                numberOfLines={8}
                underlineColorAndroid="transparent"
                onEndEditing={endEditing}
            />

            <TextComponent
                text={error}
                textStyle={errorTextStyle} />

        </View>
    );
}

const styles = StyleSheet.create({
    defaultErrorTextStyle: {
        color: colors.red,
    },
    textInputStyle: {
        height: 40,
    }
});
export default TextInputMultilineComponent;