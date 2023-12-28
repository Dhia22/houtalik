import React, { useContext } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View
} from "react-native";
import ActiveFishIcon from "../../../images/ic_fish_active.svg";
import DeactiveFishIcon from "../../../images/ic_fish_deactive.svg";
import Card from "../../components/Card/Card";
import NetworkImageComponent from "../../components/NetworkImageComponent";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import { IMG_BASE_URL } from "../../utils/apis/services";
import { getRandomNumber } from "../../utils/AppUtils";

const StoreFishList = ({
  navigation,
  items,
  loader,
  onItemClick,
  onActivateFishClicked,
  onDeactivateFishClicked,
  onImageClick,
}) => {
  const { translations } = useContext(LocalizationContext);

  const ItemRender = ({ item }) => {
      return (
      <View style={styles.innerCard}>
        <Pressable
          style={{
            flex: 1,
            flexDirection: "row",
          }}
          onPress={() => {
            onItemClick(item);
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
            <Pressable
              style={styles.fishImageContainer}
              onPress={() => {
                onImageClick(IMG_BASE_URL + item.img+ getRandomNumber(item.id));
              }}
            >
              <Card style={styles.fishImageContainer}>
                <NetworkImageComponent
                  resizeMode="cover"
                  url={IMG_BASE_URL + item.img + getRandomNumber(item.id)}
                  imgStyle={styles.fishImage}
                />
              </Card>
            </Pressable>
            <View style={styles.fishInfoContainer}>
              <TextComponent
                text={item?.fish?.nameFr}
                textStyle={styles.fishNameText}
              />
              <TextComponent
                text={item?.fish?.nameAr}
                textStyle={styles.subnameText}
              />
              <View style={styles.priceContainer}>
                <TextComponent
                  text={translations.price}
                  textStyle={styles.priceText}
                />
                <TextComponent
                 text={Number(item.price).toFixed(2) + `DT/Kg`}
                 //text={item.price + `DT/Kg`}
                  textStyle={styles.priceValueText}
                />
              </View>
            </View>
          </View>
        </Pressable>
        <Pressable style={
            item.activated
              ? styles.activeFishContainer
              : styles.deactiveFishContainer
          } 
          onPress={() => {
            item.activated ? onActivateFishClicked(item) :onDeactivateFishClicked(item)
          }}>
        <View
          style={
            item.activated
              ? styles.activeFishContainer
              : styles.deactiveFishContainer
          }
        >
          {item.activated ? (
            <ActiveFishIcon
              height={15}
              width={15}
            />
          ) : (
            <DeactiveFishIcon
              height={15}
              width={15}
            />
          )}
        </View>
        </Pressable>
      </View>
    );
  };

  const PlaceHolderView = () => {
    return (
      <View style={styles.noContentContainer}>
        <TextComponent
          text={translations.no_jobs_available}
          textStyle={[
            Style.mediumTextStyle,
            Style.text14Style,
            styles.noJobAvailable,
          ]}
        />
      </View>
    );
  };

  const onLoadMore = () => {};

  return (
    <View style={[styles.listContainer]}>
      <FlatList
        data={items ? items : []}
        key={(item, index) => index.toString()}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        maxToRenderPerBatch={60}
        initialNumToRender={30}
        windowSize={1000}
        ListFooterComponent={() => {
          return loader ? (
            <ActivityIndicator
              color={colors.hello_color}
              style={styles.indicatorMargin}
              size={"large"}
            />
          ) : items.length === 0 ? (
            <PlaceHolderView />
          ) : null;
        }}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={ItemRender}
        keyExtractor={(item, index) => index.toString()}
        extraData={items}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  noContentContainer: {
    alignItems: "center",
    padding: 24,
  },
  noJobAvailable: {
    color: colors.black,
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.bg_screen,
  },
  menuItemCard: {
    height: 183,
    width: 183,
    borderRadius: 15,
    marginHorizontal: 8,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCard: {
    width: "100%",
    paddingVertical: 8,
    borderColor: colors.card_shop_price_divider,
    backgroundColor: colors.white,
    borderWidth: 2,
    elevation: 0,
    borderRadius: 15,
    marginVertical: 6,
    flexDirection: "row",
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDivider: {
    height: 1,
    marginHorizontal: 16,
    backgroundColor: colors.card_shop_price_divider,
  },
  shopName: {
    fontFamily: Style.font.regular,
    fontSize: 16,
    fontWeight: 500,
    color: colors.shop_name,
  },
  shopAddress: {
    fontFamily: Style.font.regular,
    fontSize: 12,
    fontWeight: 400,
    color: colors.search_location,
  },
  activeFishContainer: {
    height: 35,
    width: 35,
    borderRadius: 35,
    backgroundColor: colors.active_fish,
    alignItems: "center",
    justifyContent: "center",
  },
  deactiveFishContainer: {
    height: 35,
    width: 35,
    borderRadius: 35,
    backgroundColor: colors.price,
    alignItems: "center",
    justifyContent: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fishNameText: {
    fontFamily: Style.font.regular,
    fontSize: 14,
    fontWeight: 700,
    color: colors.shop_name,
  },
  subnameText: {
    fontFamily: Style.font.regular,
    fontSize: 12,
    fontWeight: 200,
    color: colors.shop_name,
    writingDirection: "ltr",
    alignSelf: "flex-start",
  },
  priceText: {
    fontFamily: Style.font.regular,
    fontSize: 14,
    fontWeight: 400,
    color: colors.shop_name,
  },
  priceValueText: {
    fontFamily: Style.font.regular,
    fontSize: 14,
    marginStart: 4,
    fontWeight: 700,
    color: colors.price,
  },
  fishImageContainer: {
    height: 56,
    width: 56,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  fishImage: {
    alignSelf: "center",
    height: 48,
    borderRadius: 12,
    width: 48,
  },
  fishInfoContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
});

export default StoreFishList;
