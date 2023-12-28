import React, { useEffect } from "react";
import FastImage from "react-native-fast-image";
import { } from "react-native-gesture-handler";
const NetworkImageComponent = ({ url, imgStyle, resizeMode = 'contain' }) => {
    return (
        <FastImage
        style={imgStyle}
        source={{
            uri:url,
            priority: FastImage.priority.high,
            //cache:FastImage.cacheControl.web
        }}
        resizeMode={resizeMode}
        />
    );
}
export default NetworkImageComponent;