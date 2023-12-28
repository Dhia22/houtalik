import React from "react";
import { Text } from "react-native";

const TextComponent = ({ text, textStyle, noOfLine = 1, elipsize = 'tail' }) => {
    return (
        <Text style={textStyle}
            numberOfLines={noOfLine}
            ellipsizeMode={elipsize}>
            {text}
        </Text>
    );
}
export default TextComponent;