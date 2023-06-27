import React from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

const ButtonComponent2 = (
    { text, color, onPress = null,buttonStyle = {}, touchableStyle = null, textStyle = null, showLeftIcon = false, leftIcon }) => {
    return (
        <TouchableOpacity onPress={onPress}
            style={touchableStyle}>
            <View style={[buttonStyle,{ flexDirection: 'row' }]}>
                {showLeftIcon && leftIcon}
                <Text style={textStyle}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
}
export default ButtonComponent2;