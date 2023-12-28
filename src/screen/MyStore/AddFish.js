import NetInfo from "@react-native-community/netinfo";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { Chip } from "react-native-paper";
import { useSelector } from "react-redux";
import CameraIcon from "../../../images/camera.svg";
import ImagePlaceHolderIcon from "../../../images/ic_image_placeholder.svg";
import ProgressDialogView from "../../appcomponents/ProgressDialogView";
import ButtonComponent2 from "../../components/ButtonComponent2";
import Card from "../../components/Card/Card";
import ImageComponent from "../../components/ImageComponent";
import NetworkImageComponent from "../../components/NetworkImageComponent";
import TextComponent from "../../components/TextComponent";
import TextInputErrorComponent from "../../components/TextInputErrorComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import * as service from "../../utils/apis/services";
import {
  getRandomNumber,
  showApiError,
  showMessageDialogWithCallback,
  showNoInternet,
} from "../../utils/AppUtils";
import { isNullOrEmpty } from "../../validators/EmailValidator";
import SearchFishsList from "./SearchFishsList";
import axios from "axios";

const AddFishView = ({
  navigation,
  existingFish,
  item,
  onFishAdded,
  photo,
}) => {
  const authentication = useSelector((state) => state.authentication);
  const { translations } = useContext(LocalizationContext);
  const [selectedFish, setSelectedFish] = useState("");
  const [selectedFishError, setSelectedFishError] = useState("");

  const [fishPrice, setFishPrice] = useState(
    item === null ? "" : parseFloat(item.price).toFixed(2).toString()
  );
  const [fishPriceError, setFishPriceError] = useState("");
  const [selectTagError, setSelectedTagError] = useState("");
  const [capturePhoto, setCapturePhoto] = useState(
    item === null
      ? photo
      : service.IMG_BASE_URL + item.img + getRandomNumber(item.id)
  );
  const [photoError, setPhotoError] = useState("");
  const [progress, setProgressBar] = useState(false);

  const [fishType, setFishType] = useState([]);
  const [dropdownFishs, setDropdownFishs] = useState([]);
  const [loader, setLoader] = useState(false);

  const [query, setQuery] = useState("");
  const searchStarted = useRef(false);
  let cancelSource = axios.CancelToken.source();

  function getTypes(types) {
    let newType = [];
    if (item != null && item.tags && item.tags != "") {
      const tagArray = item.tags.split(";");
      const outTagArray = types.split(";");
      if (tagArray.length > 0) {
        outTagArray.map((outTag) => {
          let tagFound = false;
          tagArray.map((inTag) => {
            if (outTag.toLowerCase() === inTag.toLowerCase()) {
              tagFound = true;
            }
          });
          newType.push({
            title: outTag,
            status: tagFound,
          });
        });
      }
    } else {
      if (types != undefined && types != "") {
        const tagArray = types.split(";");
        if (tagArray.length > 0) {
          tagArray.map((inTag) => {
            newType.push({
              title: inTag,
              status: false,
            });
          });
        }
      }
    }
    return newType;
  }

  
  useEffect(() => {
    if (item != null) {
      console.log("1",item)
      getDropdownFishOnLoad(item?.fish?.nameFr);
    } else if (existingFish != null && existingFish.id != undefined) {
      console.log("existingFish2:::",existingFish)
      getDropdownFishOnLoad(existingFish.nameFr);
    }
  }, []);


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
            alert(response.customButton);
          } else {
            const file = {
              uri: response.assets[0].uri,
              name: response.assets[0].fileName,
              type: response.assets[0].type,
            };
            setPhotoError("");
            setCapturePhoto(file);
          }
        });
      }
    } else {
      ImagePicker.launchCamera(options, (response) => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
          alert(response.customButton);
        } else {
          const file = {
            uri: response.assets[0].uri,
            name: response.assets[0].fileName,
            type: response.assets[0].type,
          };
          setPhotoError("");
          setCapturePhoto(file);
        }
      });
    }
  }

  function addFish() {
    if (isFormValid()) {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          if (item != null) {
            editFishApi();
          } else {
            addFishApi();
          }
        } else {
          showNoInternet(translations);
        }
      });
    }
  }

  async function editFishApi() {
    setProgressBar(true);
    let selectedTagStr = "";
    fishType.map((tag) => {
      if (tag.status) {
        if (selectedTagStr === "") {
          selectedTagStr = tag.title.toLowerCase();
        } else {
          selectedTagStr = selectedTagStr + ";" + tag.title.toLowerCase();
        }
      }
    });
    console.log("item:::params:::",item);
    console.log("selectedFishParams:::",selectedFish);
    console.log("fishPrice1",typeof(fishPrice));
    var params = new FormData();
    params.append("id", item.id==undefined ? item?._id :item.id);
    params.append("price", fishPrice);
    params.append("tags", selectedTagStr);
    params.append("fish", selectedFish.id);

    if (
      capturePhoto != null &&
      capturePhoto.uri != undefined &&
      capturePhoto.uri.toString().search("https://") === -1
    ) {
      params.append("img", capturePhoto);
    }
    
    const result = await service.shopEditFish(
      params,
      authentication.user.token
    );
    console.log("result:::updateStock:::",result.data);
    console.log("status:::",result.status);
    setProgressBar(false);
    if (result.data != null) {
      if (result.status && result.status != 200) {
        showMessageDialogWithCallback(
          translations,
          translations.error,
          result.message,
          (onPress = () => {})
        );
      } else {
         onFishAdded();
      }
    } else {
      showApiError(translations);
    }
  }

  async function addFishApi() {
    console.log("addFish:::");
    setProgressBar(true);
    let selectedTagStr = "";
    fishType.map((tag) => {
      if (tag.status) {
        if (selectedTagStr === "") {
          selectedTagStr = tag.title.toLowerCase();
        } else {
          selectedTagStr = selectedTagStr + ";" + tag.title.toLowerCase();
        }
      }
    });
    console.log("selectedTagStr:::::",selectedTagStr);
    console.log("authentication.user.id::",authentication.user.id)
    var params = new FormData();
    params.append("shop", authentication.user.id);
    params.append("price", fishPrice);
    params.append("tags", selectedTagStr);
    params.append("fish", selectedFish.id);
    params.append("img", capturePhoto);
    const result = await service.shopAddFish(params, authentication.user.token);
    setProgressBar(false);
    if (result != null) {
      if (result.status && result.status != 200) {
        showMessageDialogWithCallback(
          translations,
          translations.error,
          result.message,
          (onPress = () => {})
        );
      } else {
        onFishAdded();
      }
    } else {
      showApiError(translations);
    }
  }

  function isFormValid() {
    if (capturePhoto === null) {
      setPhotoError(translations.photo_required);
      return false;
    }
    let selectedFishStr = selectedFish;
    if (isNullOrEmpty(selectedFishStr.toString())) {
      setSelectedFishError(translations.select_atleast_one_fish);
      return false;
    }
    let fishPriceStr = fishPrice;
    if (isNullOrEmpty(fishPriceStr)) {
      setFishPriceError(translations.price_required);
      return false;
    }
    if (parseFloat(fishPriceStr) === 0.0) {
      setFishPriceError(translations.price_cannot_be_zero);
      return false;
    }
    let selectedTagStr = "";
    fishType.map((tag) => {
      if (tag.status) {
        if (selectedTagStr === "") {
          selectedTagStr = tag.title.toLowerCase();
        } else {
          selectedTagStr = selectedTagStr + ";" + tag.title.toLowerCase();
        }
      }
    });
    if (isNullOrEmpty(selectedTagStr)) {
      setSelectedTagError(translations.select_atleast_one_tag);
      return false;
    }
    return true;
  }

  async function getDropdownFishOnLoad(queryStr) {
    cancelToken();
    const result = await service.getDropDownFish(
      cancelSource,
      authentication.user.token,
      queryStr
    );
    console.log("getDropdownFishOnLoad:::",result);
    cancelSource = null;
    let newFishs = [];
    if (result != null && result.length > 0) {
      result.map((fish) => {
        fish.name = fish.nameFr;
        newFishs.push(fish);
      });
    }
    var selectedFishStr = "";
    if (newFishs.length > 0) {
      if (item != null) {
        newFishs &&
          newFishs.map((fish) => {
            console.log("fish:::1",fish)
            console.log("Item:::1",item);
            if (fish.id === item.fish._id) {
              selectedFishStr = fish;
            }
            // if (fish.nameFr === item.fish.nameFr) {
            //   selectedFishStr = fish;
            // }
          });
      } else if (existingFish != null && existingFish.id != undefined) {
        newFishs &&
          newFishs.map((fish) => {
            console.log("elseFish::1",fish,existingFish)
            if (fish.id === existingFish.id) {
              selectedFishStr = fish;
              
            }
          });
      }
    }

    console.log("selectedFishStr:::::Val",selectedFishStr)
     if (selectedFishStr != "") {
      
      setQuery(selectedFishStr.name);
      setSelectedFishError("");
      setSelectedFish(selectedFishStr);
      setFishType(getTypes(selectedFishStr.tags));
    } else {
      console.log("else:::2")
      setSelectedFishError(translations.result_not_found);
      setFishType([]);
    }
  }

  function cancelToken(){
    if (cancelSource != undefined && cancelSource != null) {
      cancelSource.cancel();
    }
    cancelSource = axios.CancelToken.source();
  }

  async function getDropdownFish(queryStr) {
    setLoader(true);
    cancelToken();
    const result = await service.getDropDownFish(
      cancelSource,
      authentication.user.token,
      queryStr
    );
    cancelSource = null;
    let newFishs = [];
    if (result != null && result.length > 0) {
      result.map((fish) => {
        fish.name = fish.nameFr;
        newFishs.push(fish);
      });
    }
    if (newFishs.length > 0) {
      setSelectedFishError("");
    } else {
      setSelectedFishError(translations.result_not_found);
    }
    setLoader(false);
    setDropdownFishs(newFishs);
  }

  const onChangeHandler = (value) => {
    setQuery(value);
    if (isNullOrEmpty(value)) {
      setDropdownFishs([]);
      setSelectedFishError("");
    } else {
      getDropdownFish(value);
    }
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.imagePlaceHolderContainer}>
        {item === null ? (
          <>
            {capturePhoto === null ? (
              <ImagePlaceHolderIcon
                height={53}
                width={43}
                onPress={() => {
                  launchCamera();
                }}
              />
            ) : (
              <Pressable
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 120,
                  position: "absolute",
                }}
                onPress={() => {
                  launchCamera();
                }}
              >
                <ImageComponent
                  resizeMode="cover"
                  url={capturePhoto}
                  imgStyle={{
                    height: 120,
                    width: 120,
                    borderRadius: 120,
                    position: "absolute",
                  }}
                />
              </Pressable>
            )}
          </>
        ) : (
          <>
            {item.img != null && item.img != "" ? (
              <Pressable
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 120,
                  position: "absolute",
                }}
                onPress={() => {
                  launchCamera();
                }}
              >
                {capturePhoto != null &&
                capturePhoto.uri === undefined &&
                capturePhoto.toString().search("https://") != -1 ? (
                  <NetworkImageComponent
                    resizeMode="cover"
                    url={capturePhoto}
                    imgStyle={{
                      height: 120,
                      width: 120,
                      borderRadius: 120,
                      position: "absolute",
                    }}
                  />
                ) : (
                  <ImageComponent
                    resizeMode="contain"
                    url={capturePhoto}
                    imgStyle={{
                      height: 120,
                      width: 120,
                      borderRadius: 120,
                      position: "absolute",
                    }}
                  />
                )}
              </Pressable>
            ) : (
              <ImagePlaceHolderIcon
                height={53}
                width={43}
                onPress={() => {
                  launchCamera();
                }}
              />
            )}
          </>
        )}

        <Card
          style={{
            height: 24,
            position: "absolute",
            bottom: 24,
            right: 0,
            width: 24,
            alignItems: "center",
            alignSelf: "flex-end",
            justifyContent: "center",
          }}
        >
          <CameraIcon
            height={14}
            width={16}
            onPress={() => {
              launchCamera();
            }}
          />
        </Card>
      </View>
      <TextComponent text={photoError} textStyle={styles.photoEerrorText} />
      <TextComponent
        text={translations.fish_name}
        textStyle={styles.fishNameText}
      />
      <View style={styles.priceContainer}>
        <TextInputErrorComponent
          text={query}
          showIcon={false}
          errorText={""}
          inputStyle={styles.priceInputStyle}
          hasPlaceHolder={true}
          placeholderTextColor={colors.border_input}
          placeHolderText={translations.select_fish}
          textStyle={styles.selectedTextStyle}
          onInputEnd={() => {}}
          onChangeText={(text) => {
            onChangeHandler(text);
          }}
        />
      </View>
      {dropdownFishs.length > 0 ? (
        <SearchFishsList
          items={dropdownFishs}
          showDefaultPlaceholder={false}
          onItemClick={(item) => {
            console.log("items:::drop:::",item);
            setQuery(item.name);
            setDropdownFishs([]);
            setSelectedFishError("");
            setSelectedFish(item);
          }}
          loader={loader}
        />
      ) : null}
      <TextComponent text={selectedFishError} textStyle={styles.errorText} />
      <TextComponent
        text={translations.price}
        textStyle={styles.fishNameText}
      />
      <View style={styles.priceContainer}>
        <TextInputErrorComponent
          text={fishPrice}
          showIcon={false}
          errorText={""}
          inputStyle={styles.priceInputStyle}
          hasPlaceHolder={true}
          placeholderTextColor={colors.border_input}
          placeHolderText={translations.enter_price}
          textStyle={styles.selectedTextStyle}
          onChangeText={(text) => {
            if (!text || text.match(/^\d{1,}(\.\d{0,4})?$/)) {
              if (fishPriceError != "") {
                setFishPriceError("");
              }
              setFishPrice(text);
            }
          }}
          keyboardType={"decimal-pad"}
        />
        <TextComponent text={translations.dt_kg} textStyle={styles.dtKgText} />
      </View>
      <TextComponent text={fishPriceError} textStyle={styles.errorText} />

      <TextComponent text={translations.tags} textStyle={styles.fishNameText} />

      <View style={styles.tagContainer}>
        {fishType.map((type, index) => {
         
          return (
            <View key={index} style={styles.tagChipContainer}>
              <Chip
                key={index}
                mode="outlined"
                selected={false}
                ellipsizeMode={"clip"}
                height={38} //give desirable height to chip
                textStyle={
                  type.status ? styles.activeChipText : styles.deactiveChipText
                } //label properties
                style={type.status ? styles.activeChip : styles.deactiveChip} //display diff color BG
                onPress={(e) => {
                  type.status = !type.status;
                  let newFishType = [];
                  fishType.map((fish) => {
                    newFishType.push(fish);
                  });
                  setFishType(newFishType);
                  setSelectedTagError("");
                }}
              >
                {type.title}
              </Chip>
            </View>
          );
        })}
      </View>
      <TextComponent text={selectTagError} textStyle={styles.errorText} />
      <ButtonComponent2
        text={translations.submit}
        buttonStyle={styles.addFishButtonContainer}
        textStyle={styles.addFishText}
        onPress={() => {
          addFish();
        }}
      />
      <ProgressDialogView visible={progress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    padding: 16,
  },
  imagePlaceHolderContainer: {
    backgroundColor: colors.card_shop_price_divider,
    height: 120,
    alignSelf: "center",
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 120,
    marginBottom: 12,
  },
  fishNameText: {
    fontFamily: Style.font.regular,
    fontSize: 14,
    fontWeight: 500,
    paddingTop: 8,
    paddingBottom: 4,
    color: colors.shop_name,
  },
  inputBoxContainer: {
    borderWidth: 1,
    borderRadius: 10,
    height: 48,
    borderColor: colors.border_input,
  },
  dropdownSelectFish: {
    borderColor: colors.border_input,
    borderWidth: 1,
    borderRadius: 8,
    marginEnd: 4,
    marginVertical: 4,
    flex: 1,
    height: 48,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 14,
    color: colors.border_input,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: colors.price,
    paddingHorizontal: 8,
    fontFamily: Style.font.regular,
    backgroundColor: colors.transparent,
    borderWidth: 0,
    flex: 1,
  },
  selectedDropdownTextStyle: {
    fontSize: 14,
    color: colors.price,
    paddingHorizontal: 8,
    fontFamily: Style.font.regular,
    backgroundColor: colors.transparent,
    borderWidth: 0,
    flex: 1,
  },
  inputSearchStyle: {
    height: 52,
    fontSize: 14,
  },
  priceInputStyle: {
    marginHorizontal: 0,
    flex: 1,
    paddingHorizontal: 8,
    height: 52,
  },
  priceContainer: {
    flexDirection: "row",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderColor: colors.border_input,
    borderWidth: 1,
  },
  dtKgText: {
    fontFamily: Style.font.regular,
    fontSize: 14,
    fontWeight: 600,
    marginHorizontal: 12,
    color: colors.dt_kg,
  },
  addFishButtonContainer: {
    backgroundColor: colors.price,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 12,
    justifyContent: "center",
    paddingVertical: 12,
  },
  addFishText: {
    color: colors.white,
    fontFamily: Style.font.regular,
    fontSize: 16,
    fontWeight: 500,
  },
  deactiveChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 48,
    height: 38,
    borderColor: colors.search_location,
    paddingVertical: 0,
  },
  activeChip: {
    backgroundColor: colors.chip_name,
    borderWidth: 1,
    borderRadius: 48,
    height: 38,
    paddingVertical: 0,
  },
  deactiveChipText: {
    color: colors.search_location,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: Style.font.regular,
    paddingVertical: 0,
  },
  activeChipText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: Style.font.regular,
    paddingVertical: 0,
  },
  tagContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  tagChipContainer: {
    marginEnd: 8,
    marginVertical: 4,
  },
  errorText: {
    fontFamily: Style.font.regular,
    fontSize: 12,
    color: colors.red,
  },
  photoEerrorText: {
    alignSelf: "center",
    fontFamily: Style.font.regular,
    fontSize: 12,
    color: colors.red,
  },
});

export default AddFishView;
