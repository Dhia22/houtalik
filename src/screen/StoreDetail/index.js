import 'react-native-reanimated';
import NetInfo from "@react-native-community/netinfo";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Linking, Pressable, StatusBar, StyleSheet, View,TouchableWithoutFeedback } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Chip } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import ShopDirectionActiveIcon from "../../../images/ic_direction_active.svg";
import LocationFillIcon from "../../../images/ic_location_fill.svg";
import PhoneOutGoingIcon from "../../../images/ic_phone_outgoing.svg";
import ShopIcon from "../../../images/ic_store.svg";
import StoreCloseIcon from "../../../images/ic_store_close.svg";
import StoreOpenIcon from "../../../images/ic_store_open.svg";
import ShopDirectionIcon from "../../../images/ShopStore.svg";
import ProgressDialogView from "../../appcomponents/ProgressDialogView";
import TopBar from "../../appcomponents/TopBar";
import NetworkImageComponent from "../../components/NetworkImageComponent";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import * as service from "../../utils/apis/services";
import {
  captializeWord, getRandomNumber, showApiError,
  showMessageDialogWithCallback
} from "../../utils/AppUtils";
import FishList from "./FishList";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TouchableOpacity from 'react-native-gesture-handler';
import IconComment from "../../../images/icon-comment.svg";
import { Livraison } from "../../utils/apis/services";
import WebView from 'react-native-webview';
import ButtonComponent2 from '../../components/ButtonComponent2';

const StoreDetailScreen = ({ navigation, route }) => {
  const { translations } = useContext(LocalizationContext);
  const [loader, setLoader] = useState(false);
  const authentication = useSelector((state) => state.authentication);
  const [fishes, setFishes] = useState([]);
  const [shopInfo, setShopInfo] = useState(
    route.params.store ? route.params.store : null
  );
  const directionActive = useRef(route.params.store != null && route.params.store.directionActive && route.params.store.directionActive === true ? true : false)
  const [progress, setProgressBar] = useState(false);
  const [lookingFish, setLookingFish] = useState(
    route.params.fish ? route.params.fish : null
  );
  const [fishId, setFishId] = useState(
    route.params.fishId ? route.params.fishId : null
  );

  const [res,SetRes]=useState();
  

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        shopDetail();
      } else {
        showNoInternet(translations);
      }
    });
  }, []);

  console.log('DirectionDetails:::',directionActive);
  console.log("shopInfoStireDetails::::",route?.params?.store);
  var data=route?.params?.store;
  async function shopDetail(id) {
    setProgressBar(true);
   
    //console.log('ShopInfo:::',data?.shop);
    console.log("StoreDetailsResult::::",shopInfo);
    const result = await service.shopDetailUsers(shopInfo.id!=undefined? shopInfo.id: (data?.shop?._id) ? (data?.shop?._id):data._id);
    console.log("Res:::StoreDetails",result);
    SetRes(result);

    setProgressBar(false);
    if (result != null) {
      if (result.status && result.status != 200) {
        showMessageDialogWithCallback(
          translations,
          translations.error,
          result.message,
          (onPress = () => {
            navigation.goBack();
          })
        );
      } else {
        setShopInfo(result);
        let activatedFish = [];
        let lf = lookingFish;
        result.fishs.map((fish) => {
          if (fish.activated) {
            if (fishId != null) {
              if (fishId != fish.fish) {
                activatedFish.push(fish);
              }else{
                lf = fish;
              }
            }else{
              activatedFish.push(fish);
            }
          }
        });
        setLookingFish(lf);
        setFishes(activatedFish);
      }
    } else {
      showApiError(translations);
    }
  }

 // console.log("shopInfo.id:::",route.params.store);
 console.log("lookingFish::::",lookingFish);
console.log("data:::",data);
console.log('Fishes:::',fishes);
  
  function getTags(item) {
    let newType = [];
    if (item.tags && item.tags != "") {
      const tagArray = item.tags.split(";");
      if (tagArray.length > 0) {
        tagArray.map((outTag) => {
          newType.push(outTag);
        });
      }
    }
    return newType;
  }

  console.log("ShopData:::",shopInfo);
  
  return (
    <View style={[Style.introScreen, styles.body]}>
      <TopBar
        navigation={navigation}
        showNavigation={true}
        centerTitle={translations.store_detail}
        showCenterTitle={true}
        centerTitleStyle={[styles.titleText]}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {shopInfo != null ? (
          <View
            style={{
              padding: 16,
            }}
          >
            <View style={styles.SDOuterContainer}>
              <View style={styles.SDInnerContainer}>
                <View style={styles.shopIconContainer}>
                  <ShopIcon width={56} height={56} />
                </View>
                <View style={styles.SDShopNameContainer}>
                  <View style={styles.SDShopNameInnerContainer}>
                    <TextComponent
                      text={shopInfo.raisonSociale ? shopInfo.raisonSociale :data.raisonSociale?data.raisonSociale:data.shop.raisonSociale}
                      textStyle={styles.SDShopName}
                    />
                  </View>
                  <Pressable
                    style={[styles.SDShopNameInnerContainer]}
                    onPress={() => {
                      shopInfo.tel !=null ? (
                      Linking.openURL(`tel:${(shopInfo.tel).split(" ").join("")}`)
                      ):null
                     }}
                  >
                    <View style={styles.SDShopNameInnerContainer}>
                      <View style={[Style.rowDirection]}>
                        <PhoneOutGoingIcon width={16} height={16} />
                        <TextComponent
                          text={shopInfo.tel}
                          textStyle={styles.shopContacts}
                        />
                      </View>
                    </View>
                  </Pressable>
                </View>
                <View>
                  {shopInfo.closed ? (
                    <View style={[styles.storeCloseContainer]}>
                      <StoreCloseIcon width={14} height={14} />
                      <TextComponent
                        text={translations.close}
                        textStyle={styles.storeOpen}
                      />
                    </View>
                  ) : (
                    <View style={[styles.storeOpenContainer]}>
                      <StoreOpenIcon width={14} height={14} />
                      <TextComponent
                        text={translations.open}
                        textStyle={styles.storeOpen}
                      />
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.SDLocationDivider} />
              <View style={[styles.locationContainer]}>
                <LocationFillIcon width={24} height={24} />
                <TextComponent
                  text={shopInfo.adresse}
                  textStyle={styles.SDLocationText}
                />
                {directionActive.current === true ?
                <ShopDirectionActiveIcon
                width={34}
                height={34}
                style={styles.SDLocationIcon}
                onPress={() => {
                 
                  let shopInfo1 = route.params.store;
                  shopInfo1.directionActive = false;
                  route.params.onReturn(shopInfo1);
                  navigation.goBack();
                }}
              />
                 : 
                 <ShopDirectionIcon width={34} height={34}
                 onPress={() => {
                  let shopInfo1 = route.params.store;

                  console.log("shopInfo1",shopInfo1);
                  shopInfo1.directionActive = true;
                  route.params.onReturn(shopInfo1);
                  navigation.goBack();
                }} /> }
              </View>
            </View>
            {/* {lookingFish != null ? (
              <>
                <TextComponent
                  text={translations.look_for_fish}
                  textStyle={styles.allFish}
                />
                <View style={styles.menuItemCard}>
                  <Pressable
                    style={{
                      alignSelf: "center",
                      marginVertical: 4,
                      height: 206,
                      borderRadius: 20,
                      width: '96%',
                    }}
                    onPress={() => {
                      navigation.navigate("FullImage", {
                        url: service.IMG_BASE_URL + lookingFish.img + getRandomNumber(lookingFish.id),
                        id: lookingFish.id,
                      });
                    }}
                  >
                    <NetworkImageComponent
                      resizeMode="cover"
                      url={service.IMG_BASE_URL + lookingFish.img + getRandomNumber(lookingFish.id)}
                      imgStyle={{
                        alignSelf: "center",
                        marginVertical: 4,
                        height: 206,
                        borderRadius: 20,
                        width: '96%',
                      }}
                    />
                  </Pressable>
                  <View style={styles.fishNameContainer}>
                    <TextComponent
                      text={lookingFish.fish!=null ?lookingFish.fish.nameFr:lookingFish.nameFr}
                      textStyle={styles.SDShopName}
                    />
                    <TextComponent
                      text={parseFloat(lookingFish.price).toFixed(2) + `DT/Kg`}
                      textStyle={styles.priceValue}
                    />
                    
                  </View>
                  <TextComponent
                    text={lookingFish.nameAr}
                    textStyle={styles.SDFishName}
                  />
                  

                  {getTags(lookingFish).length > 0 ? (
                      <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 16,
                        marginTop: 8,
                        flexWrap: "wrap",
                        flexDirection: "row",
                      }}
                    >
                      {getTags(lookingFish).map((type, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              marginEnd: 8,
                              marginVertical: 2,
                            }}
                          >
                            <Chip
                              key={index}
                              disabled
                              ellipsizeMode={"clip"}
                              mode="outlined" 
                              height={30} 
                              textStyle={{
                                color: colors.chip_name,
                                fontSize: 14,
                                fontWeight: 500,
                                fontFamily: Style.font.regular,
                              }} 
                              style={{
                                backgroundColor: colors.bg_chip_color,
                                borderWidth: 0,
                                borderRadius: 48,
                                flexWrap: "wrap",
                              }} 
                              onPress={() => {}}
                            >
                              {captializeWord(type)}
                            </Chip>
                            
                          </View>
                        );
                      })}
                      
                    </View>
                    
           
                                      
                    </View>
                    
                  ) 
                  
                  : null}

                          
                </View>
              </>
            ) : null} */}

             {/* <View style={styles.buttonContainer}>
            <ButtonComponent2
              text={translations.add_a_product}
              buttonStyle={styles.addFishButtonContainer}
              textStyle={styles.addFishText}
              onPress={() => {
                Linking.openURL(Livraison + shopInfo._id + "/" + lookingFish._id)
              }}
            />
            </View> */}
        
                      {/* <Pressable onPress={()=>{ 
                        Linking.openURL(Livraison + shopInfo._id + "/" + lookingFish._id)
                      
                      }}
                      style={{
                        marginEnd: 8,
                        marginVertical: 2,
                        
                    }}
                      >

                      <IconComment width={34} height={34} />
                      </Pressable> */}
            <TextComponent
              text={translations.all_fish}
              textStyle={styles.allFish}
            />
            <FishList
              items={fishes}
              onItemClick={(item) => {}}
              onImageClick={(url) => {
                navigation.navigate("FullImage", {
                  url: url,
                });
              }}
              shopid={res?._id}
             // shopid={(route?.params?.store?.id) ? (route?.params?.store?.id) : (route?.params?.store?._id)}
              loader={loader}
            />
          </View>
        ) : null}
      </ScrollView>
      <ProgressDialogView visible={progress} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.bg_screen,
  },
  addFishText: {
    color: colors.white,
    fontFamily: Style.font.regular,
    fontSize: 14,
    fontWeight: 500,
  },
  titleText: {
    color: colors.shop_name,
    fontFamily: Style.font.semiBold,
    fontSize: 18,
  },
  buttonContainer: {
    marginEnd: 12,
    marginVertical: 2,
    width:"40%"
      
  },
  SDOuterContainer: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 12,
    borderColor: colors.card_stroke,
    backgroundColor: colors.white,
  },
  addFishButtonContainer: {
    backgroundColor: colors.price,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
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
  SDLocationIcon: {
    marginEnd: 8,
  },
});

export default StoreDetailScreen;
