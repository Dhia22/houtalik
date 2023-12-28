import React from "react";
import {
  Dimensions, StatusBar,
  StyleSheet,
  View
} from "react-native";
import TopBar from "../../appcomponents/TopBar";
import NetworkImageComponent from "../../components/NetworkImageComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import Pinchable from 'react-native-pinchable';

const FullImageFishScreen = ({ navigation, route }) => {

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  return (
    <View style={[Style.introScreen, styles.body]}>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
    
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
        }}
      >
        <Pinchable>
          <NetworkImageComponent
            resizeMode="contain"
            url={route.params.url}
            imgStyle={{
              width: windowWidth,
              height: windowHeight,
            }}
          />
        </Pinchable>

      </View>
      <TopBar
        navigation={navigation}
        showNavigation={true}
        showCenterTitle={false}
        centerTitleStyle={[styles.titleText]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.black,
  },
  titleText: {
    color: colors.shop_name,
    fontFamily: Style.font.semiBold,
    fontSize: 18,
  },
  SDOuterContainer: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 12,
    borderColor: colors.card_stroke,
    backgroundColor: colors.white,
  },
  shopIconContainer: {
    elevation: 4,
    alignSelf: "baseline",
    shadowColor: "black",
    backgroundColor: "white",
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
  },
  SDInnerContainer: {
    flexDirection: "row",
    alignSelf: "baseline",
    alignItems: "center",
    height: 60,
  },
  SDShopNameContainer: {
    marginStart: 16,
    height: 56,
    flex: 1,
  },
  shopContacts: {
    color: colors.shop_name,
    fontFamily: Style.font.regular,
    marginStart: 4,
    fontSize: 12,
  },
  SDShopNameInnerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  SDLocationText: {
    color: colors.black,
    fontFamily: Style.font.medium,
    marginStart: 8,
    flex: 1,
    fontSize: 14,
  },
  SDLocationDivider: {
    height: 1,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: colors.card_shop_price_divider,
  },
  storeOpenContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: colors.store_open,
    borderRadius: 50,
    flexDirection: "row",
  },
  storeCloseContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: colors.store_close,
    borderRadius: 50,
    flexDirection: "row",
  },
  storeOpen: {
    color: colors.white,
    marginStart: 4,
    fontFamily: Style.font.medium,
    fontSize: 14,
  },
  allFish: {
    color: colors.black,
    fontFamily: Style.font.semiBold,
    fontSize: 16,
    marginVertical: 12,
  },
  menuItemCard: {
    borderRadius: 20,
    marginTop: 8,
    borderColor: colors.card_stroke,
    borderWidth: 1,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  fishNameContainer: {
    flexDirection: "row",
    marginTop: 8,
    marginHorizontal: 16,
  },
  SDShopName: {
    color: colors.shop_name,
    fontFamily: Style.font.regular,
    fontSize: 16,
    marginEnd: 16,
    flex: 1,
    fontWeight: 500,
    writingDirection: "ltr",
    alignSelf: "flex-start",
  },
  SDFishName: {
    color: colors.shop_name,
    fontFamily: Style.font.regular,
    fontSize: 14,
    marginEnd: 16,
    marginStart: 16,
    fontWeight: 700,
    writingDirection: "ltr",
    alignSelf: "flex-start",
  },
  priceValue: {
    color: colors.price,
    marginHorizontal: 4,
    fontFamily: Style.font.regular,
    fontWeight: 700,
    fontSize: 14,
  },
});

export default FullImageFishScreen;