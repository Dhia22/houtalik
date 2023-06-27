
import React, { useContext, useRef } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import FishIcon from '../../../images/ic_fish_green.svg';
import ShopClosedMarker from '../../../images/ic_store_closed.svg';
import ShopIcon from '../../../images/ic_store_without_outline.svg';
import TrendingIcon from '../../../images/trending-up.svg';
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";

const SearchedList = ({ navigation, items, loader, onItemClick,showDefaultPlaceholder }) => {

    const { translations } = useContext(LocalizationContext);
    const flatlist = useRef();

    const ItemRender = ({ item }) => {
        return (
            <TouchableOpacity style={styles.innerCardPress} onPress={() => {
                onItemClick(item);
            }}>
                <View style={styles.innerCard}>
                    <View style={{
                        height: 35,
                        width: 35,
                        borderRadius: 35,
                        backgroundColor: colors.bg_chip_color,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {item.type === "1" ? <FishIcon height={20} width={20} /> : (item.closed) ? <ShopClosedMarker height={20} width={20} /> : <ShopIcon height={20} width={20} />}
                        {/* {item.raisonSociale === undefined ? <FishIcon height={20} width={20} /> : (item.closed) ? <ShopClosedMarker height={20} width={20} /> : <ShopIcon height={20} width={20} />} */}
                    </View>
                    <View style={{
                        flex: 1,
                        paddingHorizontal: 19,
                    }}>
                        <TextComponent
                            text={item.name}
                            textStyle={styles.shopName} />
                        <TextComponent
                            text={item.location}
                            textStyle={styles.shopAddress} />
                    </View>
                    <TrendingIcon height={20} width={20} />
                </View>
            </TouchableOpacity>
        );
    }

    const PlaceHolderView = () => {
        return (<View style={styles.noContentContainer}>
            <TextComponent text={translations.no_jobs_available}
                textStyle={[Style.mediumTextStyle, Style.text14Style, styles.noJobAvailable]} />
        </View>)
    };

    const onLoadMore = () => {
    }

    return (
            <FlatList
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={{ flexGrow:1}}
            ref={flatlist}
                data={items ? items : []}
                key={(item, index) => index.toString()}
                removeClippedSubviews={true}
                scrollEventThrottle={16}
                maxToRenderPerBatch={60}
                initialNumToRender={30}
                windowSize={1000}
                ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
                ListFooterComponent={() => {
                    return (loader) ?
                        (<ActivityIndicator color={colors.hello_color} style={styles.indicatorMargin} size={"large"} />) :
                        items.length === 0 && showDefaultPlaceholder ?
                            (<PlaceHolderView />)
                            : null
                }}
                renderItem={ItemRender}
                keyExtractor={(item, index) => index.toString()}
                extraData={items}
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
    listContainer: {
        flex: 1,
        backgroundColor: colors.bg_screen
    },
    menuItemCard: {
        height: 183,
        width: 183,
        borderRadius: 15,
        marginHorizontal: 8,
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCard: {
        width: '100%',
        paddingVertical: 12,
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerCardPress: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }, itemDivider: {
        height: 1,
        marginHorizontal: 16,
        backgroundColor: colors.card_shop_price_divider
    },
    shopName: {
        fontFamily: Style.font.regular,
        fontSize: 16,
        fontWeight: 500,
        color: colors.shop_name,
        writingDirection: "ltr",
        alignSelf: "flex-start"
    },
    shopAddress: {
        fontFamily: Style.font.regular,
        fontSize: 12,
        fontWeight: 400,
        color: colors.search_location,
        writingDirection: "ltr",
        alignSelf: "flex-start"
    },
    indicatorMargin:{
        margin:20
    }
});

export default SearchedList;