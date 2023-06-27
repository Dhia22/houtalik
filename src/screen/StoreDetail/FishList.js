
import React, { useContext } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";
import NetworkImageComponent from "../../components/NetworkImageComponent";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import { IMG_BASE_URL } from "../../utils/apis/services";
import { captializeWord, getRandomNumber } from "../../utils/AppUtils";


const FishList = ({ navigation, items, loader, onItemClick,onImageClick,headerComponent }) => {

    const { translations } = useContext(LocalizationContext);

    const ItemRender = ({ item }) => {
        function getTags() {
            let newType = [];
            if (item.tags && item.tags != "") {
                const tagArray = item.tags.split(";");
                if (tagArray.length > 0) {
                    tagArray.map((outTag) => {
                        newType.push(outTag);
                    })
                }
            }
            return newType;
        }

        return (<View style={styles.menuItemCard}>
            <Pressable 
            style={{
                alignSelf: 'center',
                marginVertical: 4,
                height: 206,
                borderRadius: 20,
                width: '96%',
            }}
            onPress={() => {
                onImageClick(IMG_BASE_URL + item.img + getRandomNumber(item.id));
            }}>
            <NetworkImageComponent
                resizeMode="cover"
                url={IMG_BASE_URL + item.img + getRandomNumber(item.id)}
                imgStyle={{
                    alignSelf: 'center',
                    marginVertical: 4,
                    height: 206,
                    borderRadius: 20,
                    width: '96%',
                }}
            />
            </Pressable>
            <View style={styles.fishNameContainer}>
                <TextComponent
                    text={item.nameFr}
                    textStyle={styles.SDShopName}/>
                <TextComponent
                    text={parseFloat(item.price).toFixed(2)+`DT/Kg`}
                    textStyle={styles.priceValue}/>
            </View>
            <TextComponent
                text={item.nameAr}
                textStyle={styles.SDFishName}
            />
            {getTags().length > 0 ? 
            <View style={{
                flex: 1,
                marginTop:4,
                paddingHorizontal: 16,
                flexWrap: 'wrap',
                flexDirection:'row'
            }}>
                {
                    getTags().map((type, index) => {
                        return (
                            <View
                            key={index.toString()}
                             style={{
                                marginEnd: 8,
                                marginVertical: 2,
                            }}>
                                <Chip
                                    key={index}
                                    disabled
                                    ellipsizeMode={'clip'}
                                    mode="outlined" //changing display mode, default is flat.
                                    height={30} //give desirable height to chip
                                    textStyle={{ color: colors.chip_name, fontSize: 14, fontWeight: 500, fontFamily: Style.font.regular }} //label properties
                                    style={{ backgroundColor: colors.bg_chip_color, borderWidth: 0, borderRadius: 48, flexWrap: 'wrap' }} //display diff color BG
                                    onPress={() => {

                                    }}>
                                    {captializeWord(type)}
                                </Chip>
                            </View>
                        );
                    })}
            </View> : null }
        </View>
        );
    }

    const PlaceHolderView = () => {
        return (<View style={styles.noContentContainer}>
            <TextComponent text={translations.no_jobs_available}
                textStyle={[Style.mediumTextStyle, Style.text14Style, styles.noJobAvailable]} />
        </View>)
    };


    return (
        <FlatList
            data={items ? items : []}
            style={styles.SDChipContainer}
            removeClippedSubviews={true}
            scrollEventThrottle={16}
            ListHeaderComponent={headerComponent}
            ListFooterComponent={() => {
                return (loader) ?
                    (<ActivityIndicator color={colors.hello_color} style={styles.indicatorMargin} size={"large"} />) :
                    items.length === 0 ?
                        (<PlaceHolderView />)
                        : null
            }}
            renderItem={ItemRender}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.scrollViewContent}
        />
    );
}

const styles = StyleSheet.create({
    noContentContainer: {
        alignItems: 'center',
        padding: 24,
    },
    noJobAvailable: {
        color: colors.black,
    },
    menuItemCard: {
        borderRadius: 20,
        marginTop: 8,
        borderColor: colors.card_stroke,
        borderWidth: 1,
        paddingVertical: 12,
        backgroundColor: colors.white,
    },
    indicatorMargin: {
        marginTop: 20,
    },
    fishNameContainer: {
        flexDirection: 'row',
        marginVertical: 8,
        marginHorizontal: 16,
    },
    SDShopName: {
        color: colors.shop_name,
        fontFamily: Style.font.regular,
        fontSize: 16,
        marginEnd: 16,
        flex: 1,
        fontWeight: 500,
    },
    SDFishName: {
        color: colors.shop_name,
        fontFamily: Style.font.regular,
        fontSize: 14,
        marginEnd: 16,
        marginStart: 16,
        fontWeight: 700,
        writingDirection: "ltr",
        alignSelf: "flex-start"
    },
    priceValue: {
        color: colors.price,
        marginHorizontal: 4,
        fontFamily: Style.font.regular,
        fontWeight: 700,
        fontSize: 14,
    },
    storeOpenContainer: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        alignItems: "center",
        backgroundColor: colors.store_open,
        borderRadius: 50,
        flexDirection: 'row'
    },
    storeOpen: {
        color: colors.white,
        marginStart: 4,
        fontFamily: Style.font.medium,
        fontSize: 14,
    },
    SDChipContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    scrollViewContent: {

        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
});

export default FishList;