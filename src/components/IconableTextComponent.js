import React from "react";
import { Text } from "react-native";

const IconableTextComponent = ({ text, svgIcon, textStyle, noOfLine = 1, elipsize = 'tail' }) => {
    return (
        <View style={{
            flexDirection: 'row',
        }}>

            <Text style={textStyle}
                numberOfLines={noOfLine}
                ellipsizeMode={elipsize}>
                {text}
            </Text>
        </View>
    );
}
export default IconableTextComponent;