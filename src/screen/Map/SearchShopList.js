
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Linking, Pressable, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Card from "../../components/Card/Card";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import ShopDirectionIcon from '../../../images/ShopStore.svg';
import ShopDirectionActiveIcon from '../../../images/ic_direction_active.svg';
import ShopIcon from '../../../images/ic_store.svg';
import PhoneOutGoingIcon from '../../../images/ic_phone_outgoing.svg';
import ForwardIcon from '../../../images/ic_forward.svg';


const SearchShopList = ({ navigation, items,  loader, onItemClick, onDirectionClick }) => {

    const { translations } = useContext(LocalizationContext);
    const [refresh,setRefresh]= useState(false);
    const [itemData,setItems] = useState(items);

    const ItemProductOfferRender = (item, index) => {
        return (<Card style={styles.menuItemCard}>
            <View style={styles.innerCard}>
                <Pressable style={styles.shopContainer} onPress={() => {
                            onItemClick(item);
                }}>
                    <View style={styles.shopContainer}>
                        <View style={styles.shopIconContainer}>
                            <ShopIcon width={56} height={56} />
                        </View>
                        <TextComponent
                            text={item.raisonSociale}
                            textStyle={styles.shopName}
                        />
                       
                    <Pressable style={[Style.rowDirection]}
                            onPress={() => {
                                Linking.openURL(`tel:${item.tel}`)
                            }}>
                            <View style={[Style.rowDirection]}>
                                <PhoneOutGoingIcon width={16} height={16} />
                                <TextComponent
                                    text={item.tel}
                                    textStyle={styles.shopContacts}
                                />
                            </View>
                        </Pressable>
                        <View style={styles.priceDivider} />
                        <View style={styles.priceContainer}>
                            <TextComponent
                                text={translations.price}
                                textStyle={styles.price}
                            />
                            <TextComponent
                                text={item.price ? item.price.toFixed(2) + "DT/Kg" : '0DT/Kg'}
                                textStyle={styles.priceValue}
                            />
                            <ForwardIcon height={32} width={32} style={{
                                position: 'absolute',
                                right: 0,
                            }} onPress={() => {
                                onItemClick(item);
                            }} />
                        </View>
                    </View>
                </Pressable>
                <View style={{
                    position: 'absolute',
                    top: 8,
                    left: 8
                }}>
                    {item.directionActive ?
                        (<ShopDirectionActiveIcon width={28} height={28}
                            onPress={() => {
                                itemData.map(it => {
                                    it.directionActive = false;
                                })
                                setRefresh(!refresh);
                                onDirectionClick(null, -1);
                            }} />)
                        :
                        (<ShopDirectionIcon width={28} height={28} onPress={() => {
                            itemData.map(it => {
                                it.directionActive = false;
                            })
                            item.directionActive = true;
                            setRefresh(!refresh);
                            onDirectionClick(item, index);
                        }} />)}
                </View>
            </View>
        </Card>
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
                contentContainerStyle={{
                    flexGrow:1
                }}
                data={itemData ? itemData : []}
                key={(item, index) => index.toString()}
                horizontal={true}
                initialNumToRender={40}
                windowSize={1000}
                removeClippedSubviews={true}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                ListFooterComponent={() => {
                    return (loader) ?
                        (<ActivityIndicator color={colors.hello_color} style={styles.indicatorMargin} size={"large"} />) :
                        items.length === 0 ?
                            (<PlaceHolderView />)
                            : null
                }}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.5}
                renderItem={({ item, index }) => ItemProductOfferRender(item, index)}
                keyExtractor={(item, index) => index.toString()}
                extraData={itemData}
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
        width: '100%',
        height: 214,
    },
    menuItemCard: {
        height: 183,
        width: 183,
        borderRadius: 15,
        marginHorizontal: 8,
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    innerCard: {
        width: '100%',
        height: '100%',
        padding: 4
    }, shopContainer: {
        flex: 1,
        marginTop: 12,
        alignSelf: 'center',
        alignItems: 'center',
    }, shopIconContainer: {
        elevation: 12,
        shadowColor: 'black',
        backgroundColor: 'white',
        borderRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.20,
    }, shopName: {
        color: colors.shop_name,
        fontFamily: Style.font.semiBold,
        fontSize: 14,
        marginTop: 8,
    }, shopContacts: {
        color: colors.shop_name,
        fontFamily: Style.font.regular,
        marginStart: 4,
        fontSize: 12,
    }, priceDivider: {
        width: 163,
        height: 1,
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: colors.card_shop_price_divider
    }, priceContainer: {
        width: 163,
        paddingVertical: 4,
        flexDirection: "row",
        alignItems: "center",
    }, price: {
        color: colors.shop_name,
        fontFamily: Style.font.medium,
        fontSize: 14,
    }, priceValue: {
        color: colors.price,
        marginStart: 4,
        fontFamily: Style.font.medium,
        fontSize: 14,
    }
});

export default SearchShopList;