
import React, { useContext, useRef } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";

const SearchFishsList = ({ navigation, items, loader, onItemClick, showDefaultPlaceholder }) => {

    const { translations } = useContext(LocalizationContext);
    const flatlist = useRef();

    const ItemRender = ({ item }) => {
        return (
            <Pressable onPress={() => {
                onItemClick(item);
            }}>
                <TextComponent
                            text={item.name}
                            textStyle={styles.shopName} />
            </Pressable>
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
        <View style={[styles.listContainer]} >
            <FlatList
            contentContainerStyle={{ flexGrow:1 }}
            nestedScrollEnabled={true}
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
                onEndReachedThreshold={0.5}
                renderItem={ItemRender}
                keyExtractor={(item, index) => index.toString()}
                extraData={items}
            />
        </View>
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
        backgroundColor: colors.bg_screen,
        height:140,
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
        paddingVertical:12,
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

export default SearchFishsList;