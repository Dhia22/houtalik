import React from "react";
import { Image } from "react-native";
const ImageComponent = ({ url, imgStyle, resizeMode = 'cover' }) => {
    return (
        <Image
            style={imgStyle}
            source={url === '' ? require('../../images/ic_product.png') : url}
            resizeMode={resizeMode}
            defaultSource={require('../../images/ic_product.png')}
        ></Image>
    );
}
export default ImageComponent;