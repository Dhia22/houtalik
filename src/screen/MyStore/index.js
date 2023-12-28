import 'react-native-reanimated';
import NetInfo from "@react-native-community/netinfo";
import { CommonActions } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { Modalize } from "react-native-modalize";
import SwitchToggle from "react-native-switch-toggle";
import { useDispatch, useSelector } from "react-redux";
import LocationFillIcon from "../../../images/ic_location_fill.svg";
import PlaceHolderIcon from "../../../images/ic_no_fish_placeholder.svg";
import PhoneOutGoingIcon from "../../../images/ic_phone_outgoing.svg";
import StoreReOpenIcon from "../../../images/ic_reopen_store.svg";
import ShopIcon from "../../../images/ic_store.svg";
import StoreCloseIcon from "../../../images/ic_store_close.svg";
import StoreActiveIcon from "../../../images/ic_store_open_blue.svg";
import LogoutIcon from "../../../images/logout.svg";
import ProgressDialogView from "../../appcomponents/ProgressDialogView";
import TopBar from "../../appcomponents/TopBar";
import ButtonComponent2 from "../../components/ButtonComponent2";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import { removeUser } from "../../state/slices/authenticationSlice";
import * as service from "../../utils/apis/services";
import {
  showApiError,
  showMessageDialogWithCallback,
  showNoInternet,
} from "../../utils/AppUtils";
import AddFishView from "./AddFish";
import StoreFishList from "./StoreFishList";

const MyStoreScreen = ({ navigation }) => {
  const dispath = useDispatch();
  const { translations } = useContext(LocalizationContext);
  const [loader, setLoader] = useState(false);
  const modalizeRef = useRef(null);
  const [reOpenStoreFlag, setReOpenStoreFlag] = useState(false);
  const [closeStoreFlag, setCloseStoreFlag] = useState(false);
  const [progress, setProgressBar] = useState(false);
  const authentication = useSelector((state) => state.authentication);
  const [shopInfo, setShopInfo] = useState(null);
  const [fishes, setFishes] = useState([]);
  const [shopOpen, setShopOpen] = useState(true);
  const [editFish, setEditFish] = useState(null);
  const [capturePhoto, setCapturePhoto] = useState(null);
  const [existingFish, setExistingFish] = useState(null);
  

  useEffect(() => {
    if (editFish != null) {
      modalizeRef.current?.open();
    }
  }, [editFish]);

  useEffect(() => {
    if (existingFish != null) {
      modalizeRef.current?.open();
    }
  }, [existingFish]);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        shopDetail();
      } else {
        showNoInternet(translations);
      }
    });
  }, []);

  
  async function shopDetail() {
    console.log("ShopDetails:::::MyStore:::");
    setProgressBar(true);
    console.log("authntication::::",authentication);
    const result = await service.shopDetail(authentication.user.id);
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
        setFishes(result.fishs);
        setShopOpen(!result.closed);
      }
    } else {
      showApiError(translations);
    }
  }

  async function deactivateFishApi(fishId) {
    console.log("deactivateID::::",fishId);
    setProgressBar(true);
    const result = await service.deactivateFish(
      fishId
    );
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
        let newFishes = [];
        fishes.map((fish) => {
          console.log("fishID::",fish._id);
          if (fish._id === fishId) {
            fish.activated = result.activated;
          }
          newFishes.push(fish);
        });
        setFishes(newFishes);
      }
    } else {
      showApiError(translations);
    }
  }

  async function activateFishApi(fishId) {
    console.log("activateID::::",fishId);
    setProgressBar(true);
    const result = await service.activateFish(
      fishId
    );
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
        let newFishes = [];
        fishes.map((fish) => {
          if (fish._id === fishId) {
            fish.activated = result.activated;
          }
          newFishes.push(fish);
        });
        setFishes(newFishes);
      }
    } else {
      showApiError(translations);
    }
  }

  async function shopOpenApi() {
    setProgressBar(true);
    const result = await service.shopOpen(
      authentication.user.id
    );
    setProgressBar(false);
    setReOpenStoreFlag(false);
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
        let newShopInfo = shopInfo;
        newShopInfo.closed = result.closed;
        setShopInfo(newShopInfo);
        setShopOpen(!newShopInfo.closed);
      }
    } else {
      showApiError(translations);
    }
  }

  async function shopCloseApi() {
    setProgressBar(true);
    const result = await service.shopClose(
      authentication.user.id
    );
    setProgressBar(false);
    setCloseStoreFlag(false);
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
        let newShopInfo = shopInfo;
        newShopInfo.closed = result.closed;
        setShopInfo(newShopInfo);
        setShopOpen(!newShopInfo.closed);
      }
    } else {
      showApiError(translations);
    }
  }

  async function requestCameraPermission() {
    try {
      const OsVer = Platform.constants["Version"];
      if (OsVer > 30) {
        return true;
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs camera permission",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  async function requestExternalWritePermission() {
    try {
      const OsVer = Platform.constants["Version"];
      if (OsVer > 30) {
        return true;
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "External Storage Write Permission",
          message: "App needs write permission",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      alert("Write permission err", err);
    }
    return false;
  }

  async function launchCamera() {
    setCapturePhoto(null);
    setExistingFish(null);
    const options = {
      mediaType: "photo",
      quality: 1,
      saveToPhotos: true,
      includeBase64: false,
    };
    if (Platform.OS === "android") {
      let isCameraPermitted = await requestCameraPermission();
      let isStoragePermitted = await requestExternalWritePermission();
      if (isCameraPermitted && isStoragePermitted) {
        ImagePicker.launchCamera(options, (response) => {
          if (response.didCancel) {
          } else if (response.error) {
          } else if (response.customButton) {
          } else {
            const file = {
              uri: response.assets[0].uri,
              name: response.assets[0].fileName,
              type: response.assets[0].type,
            };
       
            findFishApi(file);
          }
        });
      }
    } else {
      ImagePicker.launchCamera(options, (response) => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          const file = {
            uri: response.assets[0].uri,
            name: response.assets[0].fileName,
            type: response.assets[0].type,
          };
          findFishApi(file);
        }
      });
    }
  }

  async function findFishApi(file) {
    console.log("File::::",file)
    setProgressBar(true);
    var params = new FormData();
    params.append("image", file);
    console.log("file1",file);
    console.log("authentication.user.token:::",authentication.user.token);
    const result = await service.fishClassification(
      params,
      authentication.user.token
    );
    console.log("findFishApi:::",result?.data);
    console.log("findFishApiStatus:::",result.status);
    setProgressBar(false);
    if (result != null) {
      // if (result.found && result.found === true) {
      //   setCapturePhoto(file);
      //   setExistingFish(result);
      // }
      if (result.status && result.status === 200) {
        setCapturePhoto(file);
        setExistingFish(result.data);
      }
    } else {
      showApiError(translations);
    }
  }

  function logoutClicked() {
    dispath(removeUser());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Map" }],
      })
    );
  }

  console.log('Fishes:::Mapo',fishes);
  return (
    <View style={[Style.introScreen, styles.body]}>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      <TopBar
        navigation={navigation}
        showNavigation={true}
        centerTitle={translations.my_fish_store}
        showCenterTitle={true}
        centerTitleStyle={[styles.titleText]}
      />
      {shopInfo != null ? (
        <View style={styles.bodyContainer}>
          <View style={styles.SDOuterContainer}>
            <View style={styles.SDInnerContainer}>
              <View style={styles.shopIconContainer}>
                <ShopIcon width={56} height={56} />
              </View>
              <View style={styles.SDShopNameContainer}>
                <View style={styles.SDShopNameInnerContainer}>
                  <TextComponent
                    text={shopInfo.raisonSociale}
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
                <SwitchToggle
                  containerStyle={{
                    width: 60,
                    height: 28,
                    borderRadius: 25,
                    padding: 5,
                  }}
                  circleStyle={{
                    width: 24,
                    height: 24,
                    borderRadius: 20,
                  }}
                  switchOn={shopOpen}
                  onPress={() => {
                    if (!shopOpen) {
                      setReOpenStoreFlag(true);
                    } else {
                      setCloseStoreFlag(true);
                    }
                  }}
                  circleColorOff={colors.white}
                  circleColorOn={colors.white}
                  backgroundColorOn={colors.bg_floating_button}
                  backgroundColorOff={colors.quantity_bg}
                />
              </View>
            </View>
            <View style={styles.SDLocationDivider} />
            <View style={[styles.locationContainer]}>
              <LocationFillIcon width={24} height={24} />
              <TextComponent
                text={shopInfo.adresse}
                textStyle={styles.SDLocationText}
              />
              <LogoutIcon
                width={34}
                height={34}
                onPress={() => {
                  logoutClicked();
                }}
              />
            </View>
          </View>
          <View style={styles.fishListContainer}>
            {fishes.length > 0 ? (
              <>
                <TextComponent
                  text={translations.added_fish}
                  textStyle={styles.allFish}
                />
                <StoreFishList
                  items={fishes}
                  onItemClick={(item) => {
                    console.log("ItemEdit:::",item);
                    setEditFish(item);
                  }}
                  onImageClick={(url) => {
                    navigation.navigate("FullImage", {
                      url: url,
                    });
                  }}
                  onActivateFishClicked={(item) => {
                    NetInfo.fetch().then((state) => {
                      if (state.isConnected) {
                        console.log("deactive FishList:::",item);
                        deactivateFishApi(item?._id);
                      } else {
                        showNoInternet(translations);
                      }
                    });
                  }}
                  onDeactivateFishClicked={(item) => {
                    NetInfo.fetch().then((state) => {
                      if (state.isConnected) {
                        console.log("Active Fish List::::",item);
                        activateFishApi(item?._id);
                      } else {
                        showNoInternet(translations);
                      }
                    });
                  }}
                  loader={loader}
                />
              </>
            ) : (
              <View style={styles.placeHolderContainer}>
                <PlaceHolderIcon height={120} width={140} />
                <TextComponent
                  text={translations.no_fish}
                  textStyle={styles.noFishText}
                />
              </View>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <ButtonComponent2
              text={translations.add_fish}
              buttonStyle={styles.addFishButtonContainer}
              textStyle={styles.addFishText}
              onPress={() => {
                setEditFish(null);
                launchCamera();
              }}
            />
          </View>
        </View>
      ) : null}
      <Modalize
        ref={modalizeRef}
        onClosed={() => {
          setCapturePhoto(null);
          setEditFish(null);
          setExistingFish(null);
        }}
        adjustToContentHeight={true}
      >
        <AddFishView
          photo={capturePhoto}
          navigation={navigation}
          item={editFish}
          existingFish={existingFish}
          onFishAdded={() => {
            modalizeRef.current?.close();
            setTimeout(() => {
              NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                  shopDetail();
                } else {
                  showNoInternet(translations);
                }
              });
            }, 1000);
          }}
        />
      </Modalize>
      <Modal
        animationType="slide"
        transparent={true}
        visible={reOpenStoreFlag}
        onRequestClose={() => {
          setReOpenStoreFlag(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <StoreReOpenIcon
              height={48}
              width={48}
              style={{
                alignSelf: "center",
              }}
            />
            <TextComponent
              text={translations.your_store_is_closed}
              textStyle={styles.yourStoreClosed}
            />
            <TextComponent
              text={translations.your_store_is_closed_reopen}
              noOfLine={2}
              textStyle={styles.yourStoreClosedMessage}
            />
            <ButtonComponent2
              text={translations.open_the_store}
              showLeftIcon={true}
              leftIcon={<StoreActiveIcon height={20} width={20} />}
              buttonStyle={styles.storeReopenButtonContainer}
              textStyle={styles.storeReopenText}
              onPress={() => {
                NetInfo.fetch().then((state) => {
                  if (state.isConnected) {
                    shopOpenApi();
                  } else {
                    showNoInternet(translations);
                  }
                });
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={closeStoreFlag}
        onRequestClose={() => {
          setCloseStoreFlag(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <StoreReOpenIcon
              height={48}
              width={48}
              style={{
                alignSelf: "center",
              }}
            />
            <TextComponent
              text={translations.your_store_is_closed}
              textStyle={styles.yourStoreClosed}
            />
            <TextComponent
              text={translations.your_store_is_open_closed}
              noOfLine={2}
              textStyle={styles.yourStoreClosedMessage}
            />
            <ButtonComponent2
              text={translations.close_the_store}
              showLeftIcon={true}
              leftIcon={<StoreCloseIcon width={14} height={14} />}
              buttonStyle={styles.storeCloseButtonContainer}
              textStyle={styles.storeReopenText}
              onPress={() => {
                NetInfo.fetch().then((state) => {
                  if (state.isConnected) {
                    shopCloseApi();
                  } else {
                    showNoInternet(translations);
                  }
                });
              }}
            />
          </View>
        </View>
      </Modal>
      <ProgressDialogView visible={progress} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.bg_screen,
  },
  bodyContainer: {
    flex: 1,
  },
  fishListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleText: {
    color: colors.shop_name,
    fontFamily: Style.font.semiBold,
    fontSize: 18,
  },
  SDOuterContainer: {
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 16,
    marginHorizontal: 16,
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
  SDShopName: {
    color: colors.shop_name2,
    fontFamily: Style.font.semiBold,
    fontSize: 14,
    writingDirection: "ltr",
    alignSelf: "flex-start",
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
  addFishButtonContainer: {
    backgroundColor: colors.price,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  addFishText: {
    color: colors.white,
    fontFamily: Style.font.regular,
    fontSize: 16,
    fontWeight: 500,
  },
  noFishText: {
    paddingVertical: 12,
    fontFamily: Style.font.regular,
    fontSize: 14,
    fontWeight: 700,
    color: colors.shop_name,
  },
  placeHolderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 12,
    backgroundColor: colors.white,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080",
  },
  modalView: {
    width: Dimensions.get("window").width - 40,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  yourStoreClosed: {
    fontSize: 22,
    fontWeight: 700,
    marginTop: 12,
    paddingVertical: 2,
    fontFamily: Style.font.regular,
    color: colors.shop_name,
    alignSelf: "center",
  },
  yourStoreClosedMessage: {
    fontSize: 14,
    paddingVertical: 4,
    fontWeight: 400,
    alignSelf: "center",
    marginBottom: 24,
    fontFamily: Style.font.regular,
    textAlignVertical: "center",
    textAlign: "center",
    color: colors.search_location,
  },
  storeReopenButtonContainer: {
    backgroundColor: colors.bg_floating_button,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    paddingVertical: 8,
  },
  storeCloseButtonContainer: {
    backgroundColor: colors.store_close,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    paddingVertical: 8,
  },
  storeReopenText: {
    color: colors.white,
    fontFamily: Style.font.regular,
    fontSize: 16,
    fontWeight: 500,
    paddingHorizontal: 12,
  },
  storeReopenIcon: {
    alignSelf: "center",
  },
});

export default MyStoreScreen;
