import React from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

const ButtonComponent = (
    { text, color, onPress = null, touchableStyle = null, textStyle = null, showLeftIcon = false, leftIcon }) => {
    return (
        <TouchableOpacity onPress={onPress}
            style={touchableStyle}>
            <View style={{ flexDirection: 'row' }}>
                {showLeftIcon && leftIcon}
                <Text style={textStyle}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
}
export default ButtonComponent;