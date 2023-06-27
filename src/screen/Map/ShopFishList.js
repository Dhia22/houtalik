
import React, { useContext } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import NetworkImageComponent from "../../components/NetworkImageComponent";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import { IMG_BASE_URL } from "../../utils/apis/services";
import { getRandomNumber } from "../../utils/AppUtils";

const ShopFishList = ({ navigation, items, loader, onItemClick }) => {

    const { translations } = useContext(LocalizationContext);

    const ItemProductOfferRender = ({ item }) => {

        return (
            <Pressable onPress={() => {
                onItemClick(item);
            }}>
                <View style={styles.menuItemCard}>
                    <NetworkImageComponent
                        resizeMode="cover"
                        url={IMG_BASE_URL + item.img + getRandomNumber(item.id)}
                        imgStyle={{
                            height: 44,
                            width: 80,
                        }}
                    />
                    <TextComponent
                        text={item.nameFr}
                        textStyle={styles.shopName}
                    />
                    <TextComponent
                        text={item.price.toFixed(2) + "DT/Kg"}
                        textStyle={styles.priceValue}
                    />
                </View>
            </Pressable>
        );
    }

    return (
        <FlatList
            data={items ? items : []}
            key={(item, index) => index.toString()}
            bounces={false}
            horizontal={true}
            removeClippedSubviews={true}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            renderItem={ItemProductOfferRender}
            keyExtractor={(item, index) => index.toString()}
            extraData={items}
        />
    );
}

const styles = StyleSheet.create({
    menuItemCard: {
        height: 88,
        width: 95,
        borderRadius: 5,
        marginTop: 8,
        borderColor: colors.card_stroke,
        borderWidth: 1,
        padding: 4,
        marginHorizontal: 8,
        backgroundColor: colors.white,
    }, shopName: {
        color: colors.shop_name,
        fontFamily: Style.font.medium,
        fontSize: 12,
        marginHorizontal: 4,
    }, priceValue: {
        color: colors.price,
        marginHorizontal: 4,
        fontFamily: Style.font.medium,
        fontSize: 12,
    },
});

export default ShopFishList;