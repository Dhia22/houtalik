import NetInfo from "@react-native-community/netinfo";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import ActionButton from "react-native-action-button";
import { useSelector } from "react-redux";
import { LogBox } from "react-native";
import ShopDirectionIcon from "../../../images/ShopStore.svg";
import DTFloatingIcon from "../../../images/dt.svg";
import DTSelectedFloatingIcon from "../../../images/dt_selected.svg";
import BackIcon from "../../../images/ic_back.svg";
import ShopDirectionActiveIcon from "../../../images/ic_direction_active.svg";
import FilterIcon from "../../../images/ic_filter.svg";
import FilterFloatingIcon from "../../../images/ic_filter_outline.svg";
import CloseFloatingIcon from "../../../images/ic_floating_active.svg";
import LocationFloatingIcon from "../../../images/ic_floating_location.svg";
import ForwardIcon from "../../../images/ic_forward.svg";
import LocationFillIcon from "../../../images/ic_location_fill.svg";
import LocationSelectedIcon from "../../../images/ic_location_selected.svg";
import PhoneOutGoingIcon from "../../../images/ic_phone_outgoing.svg";
import ShopIcon from "../../../images/ic_store.svg";
import ShopProfileIcon from "../../../images/ic_store_without_outline.svg";
import StoreCloseIcon from "../../../images/ic_store_close.svg";
import StoreOpenIcon from "../../../images/ic_store_open.svg";
import ScanIcon from "../../../images/scan.svg";
import ProgressDialogView from "../../appcomponents/ProgressDialogView";
import SearchView from "../../appcomponents/SearchView";
import Card from "../../components/Card/Card";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import {
  isLoggedIn,
  isShop,
  showApiError,
  showMessageDialog,
  showMessageDialogWithCallback,
  showNoInternet,
} from "../../utils/AppUtils";
import * as service from "../../utils/apis/services";
import SearchShopList from "./SearchShopList";
import ShopFishList from "./ShopFishList";
import axios from "axios";
import MapNew from "./MapNew";
import MapView, { Polyline } from "react-native-maps";
import "react-native-reanimated";
//import MapViewDirections from "react-native-maps-directions";
var isZoom = 0;
var isLat;
var isLong;
var currentLat;
var currentLong;
var FishName = '';
var dataArr=[];
// var latitude= 0;
// var longitude=0;
// var latitudeDelta=180;
// var longitudeDelta=360;

var latitude = 0;
var longitude = 0;
var latitudeDelta = Platform.OS == "ios" ? 0.0123 : 200;
var longitudeDelta = Platform.OS == "ios" ? 45.0123 : 360;

// var  latitude=35.776159;
// var   longitude= 10.826581;
// var   latitudeDelta= 0.0123;
// var   longitudeDelta= 0.0123;

var currenttopLeftLat;
var currenttopLeftLon;
var currenttopRightLat;
var currenttopRightLon;
var currentbottomLeftLat;
var currentbottomLeftLon;
var currentbottomRightLat;
var currentbottomRightLon;

const MapScreen = ({ navigation, route }) => {
  const windowWidth = Dimensions.get("window").width;
  const { translations } = useContext(LocalizationContext);
  const authentication = useSelector((state) => state.authentication);
  const [progress, setProgressBar] = useState(false);
  const mapMarker = useRef([]);
  const [refresh, setRefresh] = useState(false);
  const [Zoom, SetZoom] = useState();
  const [showTheThing, SetshowTheThing] = useState(false);
  const mapMarkerOriginal = useRef([]);
  const searchEnabled = useRef(false);
  const fishdDetail = useRef(null);
  const closetFilterApplied = useRef(false);
  const bestPriceFilterApplied = useRef(false);
  const shopList = useRef([]);
  const originShopList = useRef([]);
  const activeIndex = useRef(-1);
  const timer = useRef("");
  const mapRef = useRef(new MapView());
  const polylineRef = useRef(null);
  // const showShopCardDetail = useRef(null);
  const shopCardDetailRef = useRef(null);
  const showCard = useRef(false);
  const showShopList = useRef(false);
  const [SearchViewText, SetSearchViewText] = useState('');
  const [orderId, SetOrderId] = useState(0);
  const [ZoomLevelData, SetZoomLevelData] = useState(0);
  const [ShopData, setShopData] = useState([]);
  const [tel, SetTel] = useState();
  const [RaisonSociale, SetRaisonSociale] = useState();
  // const currentLocation = useRef({
  //   latitude: 35.776159,
  //   longitude: 10.826581,
  //   latitudeDelta: 0.0123,
  //   longitudeDelta: 0.0123,
  // });
  // const userLocation = useRef({
  //   latitude: 35.776159,
  //   longitude: 10.826581,
  //   latitudeDelta: 0.0123,
  //   longitudeDelta: 0.0123,
  // });
  // const region = useRef({
  //   latitude: 35.776159,
  //   longitude: 10.826581,
  //   latitudeDelta: 0.0123,
  //   longitudeDelta: 0.0123,
  // });

  const region = useRef({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  });
  const currentLocation = useRef({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  });
  const userLocation = useRef({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  });

  const shopCoordinatesMap = useRef(new Map());
  let cancelSource = axios.CancelToken.source();
  let cancelMapApiSource = axios.CancelToken.source();
  let cancelShopDetailSource = axios.CancelToken.source();

 

  function onMapChanged(storeDetail) {

    if (storeDetail != null) {
      currentLocation.current = {
        latitude: parseFloat((storeDetail?.shop?.lat) == undefined ? (storeDetail?.lat) : (storeDetail?.shop?.lat)),
        longitude: parseFloat((storeDetail?.long) == undefined ? (storeDetail?.shop?.lon) == undefined ? (storeDetail?.lon) : (storeDetail?.shop?.lon) : (storeDetail?.shop?.lon) == undefined ? (storeDetail?.long) : (storeDetail?.shop?.lon)),
        latitudeDelta: region.current.latitudeDelta,
        longitudeDelta: region.current.longitudeDelta,
      };
      shopCardDetailRef.current = storeDetail;
      if (shopCardDetailRef.current.directionActive === true) {
        if (
          shopCoordinatesMap.current.has(
            shopCardDetailRef.current?.id == undefined ? shopCardDetailRef.current?._id : shopCardDetailRef.current?.id
          )
        ) {
          let decodeCoordinates = shopCoordinatesMap.current.get(
            shopCardDetailRef.current?.id == undefined ? shopCardDetailRef.current?._id : shopCardDetailRef.current?.id
          );
          if (decodeCoordinates.length > 0) {
            showPolyline(decodeCoordinates);
            setRefresh(!refresh);
          } else {
            handleGetDirections(shopCardDetailRef.current?.shop, true);
            setRefresh(!refresh);
          }
        } else {
          handleGetDirections((shopCardDetailRef.current?.shop) == undefined ? shopCardDetailRef.current : (shopCardDetailRef.current?.shop), true);
          setRefresh(!refresh);
        }
      } else {
        showPolyline([]);
        setRefresh(!refresh);
      }
    }
  }
  function onLeftIconClicked() { }

  function onScanClicked() {
    navigation.navigate("ScanQRScreen");
  }

  function onStoreClicked() {
    navigation.navigate("MyStore");
  }


  async function onSearchedShopApi(shopCardDetail) {
    setProgressBar(true);
    cancelToken();
    const searchShopResult = await service.shopOnMap(
      cancelSource,
      // parseFloat(shopCardDetail.lat),
      // parseFloat(shopCardDetail.long)
      currenttopLeftLat,
      currenttopLeftLon,
      currenttopRightLat,
      currenttopRightLon,
      currentbottomLeftLat,
      currentbottomLeftLon,
      currentbottomRightLat,
      currentbottomRightLon
    );
    //resetAll();
    cancelSource = null;
    mapMarker.current = [];

    //  resetAll();

    if (searchShopResult != null && searchShopResult.length > 0) {
      searchShopResult.map((marker) => {

        marker.isactive = false;
        if (marker.id === shopCardDetail.id) {
          if (shopCardDetail.closed === false) {
            marker.isactive = true;
          }
          mapMarker.current.push(marker);

        }
        setRefresh(!refresh);
      });
    }


    // var regionData = {
    //   latitude: parseFloat(mapMarker.current[0].lat),
    //   longitude: parseFloat(mapMarker.current[0].long),
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421
    //   //latitudeDelta: parseFloat(markerList[0].lat),
    //   //longitudeDelta: parseFloat(markerList[0].long),
    //   // latitudeDelta: 0.0123,
    //   // longitudeDelta: 0.0123,

    // };
    //moveRegion(regionData);
    setProgressBar(false);
  }

  function cancelToken() {
    if (cancelSource != undefined && cancelSource != null) {
      cancelSource.cancel();
    }
    cancelSource = axios.CancelToken.source();
  }

  function cancelMapApiToken() {
    if (cancelMapApiSource != undefined && cancelMapApiSource != null) {
      cancelMapApiSource.cancel();
    }
    cancelMapApiSource = axios.CancelToken.source();
  }

  async function onMapLoadShopsApi(
    currenttopLeftLat,
    currenttopLeftLon,
    currenttopRightLat,
    currenttopRightLon,
    currentbottomLeftLat,
    currentbottomLeftLon,
    currentbottomRightLat,
    currentbottomRightLon
  ) {
    setProgressBar(true);
     cancelToken();
    const shopsNearBySearchedShop = await service.shopOnMap(
      cancelSource,
      currenttopLeftLat,
      currenttopLeftLon,
      currenttopRightLat,
      currenttopRightLon,
      currentbottomLeftLat,
      currentbottomLeftLon,
      currentbottomRightLat,
      currentbottomRightLon
    );
    resetAll();
    cancelSource = null;
    mapMarker.current = [];


    
    if (shopsNearBySearchedShop != null && shopsNearBySearchedShop.length > 0) {
      shopsNearBySearchedShop.map((shop) => {
        mapMarker.current.push(shop);
      });
    }
    setProgressBar(false);
  }


  const [enable, setEnable] = useState(false);

  async function onResetMapLoadShopsApi(
    currenttopLeftLat,
    currenttopLeftLon,
    currenttopRightLat,
    currenttopRightLon,
    currentbottomLeftLat,
    currentbottomLeftLon,
    currentbottomRightLat,
    currentbottomRightLon
  ) {
    setProgressBar(true);
    cancelToken();
    const shopsNearBySearchedShop = await service.shopOnMap(
      cancelSource,
      //latitude,
      //longitude
      currenttopLeftLat,
      currenttopLeftLon,
      currenttopRightLat,
      currenttopRightLon,
      currentbottomLeftLat,
      currentbottomLeftLon,
      currentbottomRightLat,
      currentbottomRightLon
    );
    resetAll();
    cancelSource = null;
    mapMarker.current = [];

    if (shopsNearBySearchedShop != null && shopsNearBySearchedShop.length > 0) {
      shopsNearBySearchedShop.map((shop) => {
        mapMarker.current.push(shop);
      });
    }
    setProgressBar(false);
  }
  // Function to add a new marker to the array
  async function fishShopsOnMapChangedApi(fishdDetail, order, currenttopLeftLat, currenttopLeftLon, currenttopRightLat, currenttopRightLon, currentbottomLeftLat, currentbottomLeftLon, currentbottomRightLat, currentbottomRightLon) {
    setProgressBar(true);
    showCard.current = false;
    const fishShops = await service.fishShops(fishdDetail?.id, order, currenttopLeftLat,
      currenttopLeftLon,
      currenttopRightLat,
      currenttopRightLon,
      currentbottomLeftLat,
      currentbottomLeftLon,
      currentbottomRightLat,
      currentbottomRightLon);
    var latestShops = [];

    if (fishShops != null && fishShops.length > 0) {
      fishShops.map((inShop) => {
        mapMarker.current.map((outShop) => {
          let shopClosed = true;
          if (inShop.shop._id === outShop._id) {
            shopClosed = false;
          }
          inShop.shop.closed = false;

          // mapMarker.current = latestShops;
          // console.log("latestShops",mapMarker.current);

        });
        latestShops.push(inShop.shop);
      });
      // latestShops.push(fishShops);
      originShopList.current = fishShops;
      shopList.current = fishShops;
      showShopList.current = true;
      polylineRef.current = [];
      // toggleVisibility("flex");
    } else {
      mapMarker.current.map((inShop) => {
        inShop.isactive = false;
        inShop.closed = true;
        latestShops.push(inShop);
      });

      originShopList.current = [];
      shopList.current = [];
      showShopList.current = false;
      showMessageDialog(
        translations,
        translations.alert,
        translations.fish_not_found
      );
      // toggleVisibility("none");
    }
    mapMarker.current = latestShops;
    setRefresh(!refresh);
    // setMapMarkers(latestShops);
    setProgressBar(false);
  }

  async function onMapReliginChangedApi(
    currenttopLeftLat,
    currenttopLeftLon,
    currenttopRightLat,
    currenttopRightLon,
    currentbottomLeftLat,
    currentbottomLeftLon,
    currentbottomRightLat,
    currentbottomRightLon
  ) {
    if (mapMarker.current.length === 0) {
      cancelMapApiToken();
      const shopsNearBySearchedShop = await service.shopOnMap(
        cancelMapApiSource,
        //  latitude,
        // longitude
        currenttopLeftLat,
        currenttopLeftLon,
        currenttopRightLat,
        currenttopRightLon,
        currentbottomLeftLat,
        currentbottomLeftLon,
        currentbottomRightLat,
        currentbottomRightLon
      );
      cancelSource = null;
      let markerlist = [];
      resetAll()
      if (
        shopsNearBySearchedShop != null &&
        shopsNearBySearchedShop.length > 0
      ) {
        shopsNearBySearchedShop.map((shop) => {
          if (originShopList.current.length > 0) {
            if (shop.closed === false) {
              let shopClosed = true;
              originShopList.current.map((inShop) => {
                if (inShop.id === shop.id) {
                  shopClosed = false;
                }
              });
              shop.closed = shopClosed;
            }
          } else {
            if (
              originShopList.current.length == 0 &&
              fishdDetail.current != null
            ) {
              shop.closed = true;
            }
          }
          if (
            shopCardDetailRef.current != null &&
            shop.id === shopCardDetailRef.current.id
          ) {
            if (shop.closed === false) {
              shop.isactive = true;
            } else {
              shop.isactive = false;
            }
          }
          markerlist.push(shop);
        });
      }
      mapMarker.current = markerlist;
      setRefresh(!refresh);
    }
  }

  function handlePressMap() {
    if (showCard.current === true || showShopList.current === true) {
      showCard.current = false;
      showShopList.current = false;
      setRefresh(!refresh);
    }
  }

  const ShopDetailCard = () => {
    const addressRef = useRef("");
    const [fishs, setFishs] = useState([]);
    const [directionActive, setDirectionActive] = useState(
      shopCardDetailRef.current != null &&
        shopCardDetailRef.current.directionActive != null
        ? shopCardDetailRef.current.directionActive
        : false
    );

    useEffect(() => {
      if (shopCardDetailRef.current != null) {
        NetInfo.fetch().then((state) => {
          if (state.isConnected) {
            setFishs([]);
            shopDetail();
          } else {
            showNoInternet(translations);
          }
        });
      }
    }, []);

    // shopCardDetailRef.current.directionActive=false
    function cancelShopDetailToken() {
      if (
        cancelShopDetailSource != undefined &&
        cancelShopDetailSource != null
      ) {
        cancelShopDetailSource.cancel();
      }
      cancelShopDetailSource = axios.CancelToken.source();
    }

    async function shopDetail() {
      cancelShopDetailToken();
      const result = await service.shopDetailCard(
        cancelShopDetailSource,
        shopCardDetailRef.current.id != undefined ? shopCardDetailRef.current?.id : shopCardDetailRef.current?._id
      );
      SetTel(result?.tel)
      SetRaisonSociale(result?.raisonSociale)

      if (result != null) {
        if (result.status && result.status != 200) {
          showMessageDialogWithCallback(
            translations,
            translations.error,
            result.message,
            (onPress = () => { })
          );
        } else {
          addressRef.current = result.adresse;
          let newFish = [];
          result.fishs.map((fish) => {
            if (fish.activated) {
              newFish.push(fish);
            }
          });
          setFishs(newFish);
        }
      } else {
        showApiError(translations);
      }
    }

    // console.log("RaisonSociale:::",String(RaisonSociale).replace('++',""));


    return (
      <Card
        style={{
          height: 240,
          position: "absolute",
          bottom: 8,
          width: windowWidth - 24,
          marginStart: 12,
          marginEnd: 12,
        }}
      >
        <Pressable
          style={styles.SDOuterContainer}
          onPress={() => {
            navigation.navigate("StoreDetail", {
              store: shopCardDetailRef.current,
              fish: fishdDetail.current,
              fishId:
                fishdDetail.current != null ? fishdDetail.current.id : null,
              onReturn: (item) => {
                onMapChanged(item);
              },
            });
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
                    text={shopCardDetailRef?.current?.raisonSociale}
                    textStyle={styles.SDShopName}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <Pressable
                    style={[styles.SDShopNameInnerContainer]}
                    onPress={() => {
                      shopCardDetailRef?.current?.tel != null ?
                        (
                          Linking.openURL(
                            `tel:${shopCardDetailRef?.current?.tel.split(" ").join("")}`
                          ))
                        : Linking.openURL(
                          `tel:${tel.split(" ").join("")}`
                        )
                    }}
                  >
                    <View style={[styles.SDShopNameInnerContainer]}>
                      <View style={[Style.rowDirection]}>
                        <PhoneOutGoingIcon width={16} height={16} />
                        <TextComponent
                          text={(shopCardDetailRef?.current?.tel) ? (shopCardDetailRef?.current?.tel) : tel}
                          textStyle={styles.shopContacts}
                        />
                      </View>
                    </View>
                  </Pressable>
                </View>
              </View>
              <View style={styles.shopCloseOpenContainer}>
                {shopCardDetailRef?.current?.closed ? (
                  <View style={[styles.storeCloseContainer]}>
                    <StoreCloseIcon width={14} height={14} />
                  </View>
                ) : (
                  <View style={[styles.storeOpenContainer]}>
                    <StoreOpenIcon width={14} height={14} />
                  </View>
                )}
              </View>
              {directionActive ? (
                <ShopDirectionActiveIcon
                  width={Platform.OS == "ios" ? 40 : 34}
                  height={Platform.OS == "ios" ? 40 : 34}
                  style={styles.SDLocationIcon}
                  onPress={() => {
                    shopCardDetailRef.current.directionActive = false;
                    showPolyline([]);
                    setDirectionActive(false);

                  }}
                />
              ) : (

                <ShopDirectionIcon
                  width={Platform.OS == "ios" ? 40 : 34}
                  height={Platform.OS == "ios" ? 40 : 34}
                  style={styles.SDLocationIcon}
                  onPress={() => {
                    let shopLatLong = {
                      latitude: parseFloat(shopCardDetailRef.current.lat),
                      longitude: parseFloat(shopCardDetailRef.current.long != undefined ? shopCardDetailRef.current.long : shopCardDetailRef.current.lon),
                      latitudeDelta: region.current.latitudeDelta,
                      longitudeDelta: region.current.longitudeDelta,
                    };
                    moveRegion(shopLatLong);

                    shopCardDetailRef.current.isactive = true;
                    if (
                      shopCoordinatesMap.current.has(
                        shopCardDetailRef.current?.id == undefined ? shopCardDetailRef.current?._id : shopCardDetailRef.current?.id
                      )
                    ) {
                      let decodeCoordinates = shopCoordinatesMap.current.get(
                        shopCardDetailRef.current?.id == undefined ? shopCardDetailRef.current?._id : shopCardDetailRef.current?.id
                      );

                      if (decodeCoordinates.length > 0) {
                        showPolyline(decodeCoordinates);
                      } else {
                        handleGetDirections(shopCardDetailRef.current, true);
                      }
                    } else {
                      handleGetDirections(shopCardDetailRef.current, true);
                    }
                    shopCardDetailRef.current.directionActive = true;
                    setDirectionActive(true);

                  }}
                />
              )}
              <ForwardIcon
                height={38}
                width={38}
                onPress={() => {
                  navigation.navigate("StoreDetail", {
                    store: shopCardDetailRef.current,
                    //fish: fishdDetail.current,
                    fish: null,
                    fishId:
                      fishdDetail.current != null
                        ? fishdDetail.current.id
                        : null,
                    onReturn: (item) => {
                      console.log("Items:::MAp:::", item);
                      onMapChanged(item);
                    },
                  });
                }}
              />
            </View>
            <View style={[styles.locationContainer]}>
              <LocationFillIcon width={24} height={24} />
              <TextComponent
                noOfLine={2}
                text={addressRef.current}
                textStyle={styles.SDLocationText}
              />
            </View>
            <View style={styles.SDLocationDivider} />

            {shopCardDetailRef?.current?.closed ? (
              <View style={styles.shopClosedContainer}>
                <TextComponent
                  text={translations.shop_closed_on_shop_map}
                  textStyle={[styles.shopClosedText]}
                />
              </View>
            ) : (
              <ShopFishList
                items={fishs}
                onItemClick={(item) => {
                  navigation.navigate("StoreDetail", {
                    store: shopCardDetailRef?.current,
                    fish: item,
                    fishId: item.fish,
                    onReturn: (item) => {
                      console.log("return Store details:::", item);
                      onMapChanged(item);
                    },
                  });
                }}
                loader={false}
              />
            )}
          </View>
        </Pressable>
      </Card>
    );
  };

  function moveRegion(latlong) {
    mapRef.current.animateToRegion(latlong, 1000);

    // var zoom=mapRef.current.getCamera();
    //  console.log("Zoom",zoom)
    //   mapRef?.current?.getCamera().then((cam) => {
    //     console.log("Camera",cam)
    //     cam.zoom += 1;`
    //     console.log("Camera zoom",cam)
    //     mapRef?.current?.animateCamera(cam);
    // });

  }

  const decodePolyline = (encoded) => {
    const polyline = require("@mapbox/polyline");
    return polyline.decode(encoded).map((point) => ({
      latitude: point[0],
      longitude: point[1],
    }));
  };
  ``
  async function showPolyline(decodedPoints) {
    if (decodedPoints.length === 0) {
      // polylineRef.current.setNativeProps({
      //   coordinates: [],
      // });

      polylineRef.current = [];
      setRefresh(!refresh);
    }
    else {

      // decodedPoints.map((e)=>{
      //   polylineRef.current.p(e);
      // })

      polylineRef.current = decodedPoints;
      setRefresh(!refresh);
      // console.log("decodedPoints:::",polylineRef.current);
      // polylineRef.current.setNativeProps({
      //   coordinates: decodedPoints.map((point) => ({
      //     latitude: point.latitude,
      //     longitude: point.longitude,
      //   })),
      // });
    }


  }

  async function onMapShopClickedApi(shopCardDetail) {
    cancelToken();
    const shopsNearBySearchedShop = await service.shopOnMap(
      cancelSource,
      parseFloat(shopCardDetail.lat),
      parseFloat(shopCardDetail.long)
    );
    cancelSource = null;
    let markerlist = [];
    if (shopsNearBySearchedShop != null && shopsNearBySearchedShop.length > 0) {
      shopsNearBySearchedShop.map((shop) => {
        if (originShopList.current.length > 0) {
          let shopClosed = true;
          originShopList.current.map((inShop) => {
            if (inShop.id === shop.id) {
              shopClosed = false;
            }
          });
          shop.closed = shopClosed;
        }
        if (shop.id === shopCardDetail.id) {
          if (shopCardDetail.closed === false) {
            shop.isactive = true;
          }
        }
        markerlist.push(shop);
      });
    }
    mapMarker.current = markerlist;
    setRefresh(!refresh);
    // setMapMarkers(markerlist);
    // setProgressBar(false);
  }

  const handleGetDirections = async (shopdetail, allowCoordinate) => {
    console.log("ShopDetails::allowCoordinate:::", shopdetail, allowCoordinate);
    try {
      const origin =
        userLocation.current.latitude + "," + userLocation.current.longitude; // Starting coordinates
      const destination = (shopdetail.long) ? shopdetail.shop == undefined ? shopdetail.lat + "," + shopdetail.long : shopdetail?.shop?.lat + "," + shopdetail?.shop?.lon : shopdetail.shop == undefined ? shopdetail.lat + "," + shopdetail.lon : shopdetail?.shop?.lat + "," + shopdetail?.shop?.lon; // Destination coordinates

      console.log("origin:::", origin);
      console.log("destination:::", destination);

      const apiKey = "AIzaSyDg8AX5xQgqdPlXfqIMRhL-iSP5T8MMD9M";
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
      );
      const { data } = response;
      console.log("data:::response", data);
      if (data.status === "OK") {
        const { routes } = data;
        const polylinePoints = routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(polylinePoints);
        shopCoordinatesMap.current.set(shopdetail._id == undefined ? shopdetail.id : shopdetail._id, decodedPoints);
        console.log("shopCoordinatesMap:::", shopCoordinatesMap);
        if (allowCoordinate) {
          console.log("allowCoordinate:::", allowCoordinate);
          showPolyline(decodedPoints);
        }
      } else {
        if (allowCoordinate) {
          showPolyline([]);
        }
        // console.log('Error getting directions:', data.status);
      }
    } catch (error) {
      console.log("error:::")
      if (allowCoordinate) {
        showPolyline([]);
      }
    }

  };

  function inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
  }
  function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;

    return dist;
  }
  async function getCoordinates(shop, allow) {

    if (!shopCoordinatesMap.current.has(shop._id)) {

      handleGetDirections(shop, allow);
    } else {
      if (
        shopCoordinatesMap.current.has(shop._id) &&
        shopCoordinatesMap.current.get(shop._id).length === 0
      ) {

        handleGetDirections(shop, allow);
      }
    }
  }

  function resetAll() {

   
    searchEnabled.current = false;
    // toggleVisibility("none");
    if (shopCardDetailRef.current != null) {
      shopCardDetailRef.current = null;
    }
    if (showCard.current === true) {
      showCard.current = false;
    }
    if (showShopList.current === true) {
      showShopList.current = false;
    }
    if (fishdDetail.current != null) {
      fishdDetail.current = null;
    }
    if (bestPriceFilterApplied.current === true) {
      bestPriceFilterApplied.current = false;
    }
    if (activeIndex.current != -1) {
      activeIndex.current = -1;
    }
    if (closetFilterApplied.current === true) {
      closetFilterApplied.current = false;
    }
    if (originShopList.current.length > 0) {
      originShopList.current = [];
    }
    if (shopList.current.length > 0) {
      shopList.current = [];
    }

    showPolyline([]);
  }

  const ZoomMapCountries = async () => {

    setProgressBar(true);

    const ZoomMapCountries = await service.Countries();
    console.log("ZoomMapCountries:::", ZoomMapCountries);
    mapMarker.current = [];
    resetAll();

    if (ZoomMapCountries != null && ZoomMapCountries.length > 0) {
      ZoomMapCountries.map((shop) => {
        mapMarker.current.push(shop);
      });
    }
    setProgressBar(false);

  };

  const ZoomMapCities = async (
    topLeftLat,
    topLeftLon,
    topRightLat,
    topRightLon,
    bottomLeftLat,
    bottomLeftLon,
    bottomRightLat,
    bottomRightLon
  ) => {
    mapMarker.current = [];
    setProgressBar(true);

    const ZoomMapCities = await service.Cities(
      topLeftLat,
      topLeftLon,
      topRightLat,
      topRightLon,
      bottomLeftLat,
      bottomLeftLon,
      bottomRightLat,
      bottomRightLon
    );

    mapMarker.current = [];
    resetAll();
    console.log("ZoomMApCities:::", ZoomMapCities)
    if (ZoomMapCities != null && ZoomMapCities.length > 0) {
      ZoomMapCities.map((shop) => {
        mapMarker.current.push(shop);
      });
    }
    setProgressBar(false);

  };

  useEffect(() => {
    //console.log("useEffect")
    if (enable == true) {
      onMapLoadShopsApi(
        currenttopLeftLat,
        currenttopLeftLon,
        currenttopRightLat,
        currenttopRightLon,
        currentbottomLeftLat,
        currentbottomLeftLon,
        currentbottomRightLat,
        currentbottomRightLon
      );
      //goToInitialLocation();
    }
  }, [enable]);


  const goToInitialLocation = (shopLatLong) => {
    let initialRegion = Object.assign({}, shopLatLong);
    initialRegion["latitudeDelta"] = 0.005;
    initialRegion["longitudeDelta"] = 0.005;
    mapRef.current.animateToRegion(initialRegion, 2000);
    // moveRegion(initialRegion)
    // this.mapRef.animateToRegion(initialRegion, 2000);
  }

  //console.log("region:::",region);

  // console.log("activeIndex::::",activeIndex);

  const onRegionChanges = (itm, ZoomMap, zoomLevel) => {
    SetZoom(ZoomMap);
    const { latitude, latitudeDelta, longitude, longitudeDelta } = itm;
    currentLat = latitude;
    currentLong = longitude;
    const minLatitude = latitude - latitudeDelta / 2;
    const maxLatitude = latitude + latitudeDelta / 2;
    const minLongitude = longitude - longitudeDelta / 2;
    const maxLongitude = longitude + longitudeDelta / 2;
    const topLeft = { latitude: maxLatitude, longitude: minLongitude };
    const topRight = { latitude: maxLatitude, longitude: maxLongitude };
    const bottomLeft = { latitude: minLatitude, longitude: minLongitude };
    const bottomRight = {
      latitude: minLatitude,
      longitude: maxLongitude,
    };
    currenttopLeftLat = topLeft.latitude;
    currenttopLeftLon = topLeft.longitude;
    currenttopRightLat = topRight.latitude;
    currenttopRightLon = topRight.longitude;
    currentbottomLeftLat = bottomLeft.latitude;
    currentbottomLeftLon = bottomLeft.longitude;
    currentbottomRightLat = bottomRight.latitude;
    currentbottomRightLon = bottomRight.longitude;

    console.log(
      "TopLeft:::TopRight::::bottomLeft:::bottomRight::::",
      topLeft,
      topRight,
      bottomLeft,
      bottomRight
    );
    console.log("ZoomLevel::::", zoomLevel);
    console.log("isZoom::::", isZoom);
    console.log("ZoomMap::::", ZoomMap);


    if (zoomLevel == 1) {

      console.log("Country::::");
      SetshowTheThing(false);
      if (!inRange(isZoom, 1, 7)) {
        ZoomMapCountries();


        isZoom = ZoomMap;
      } else if (
        isZoom == ZoomMap &&
        distance(isLat, isLong, itm.latitude, itm.longitude) > 100
      ) {
        // console.log("country else:::",ZoomMap);
        ZoomMapCountries();
      }
    }

    if (zoomLevel == 2) {
      console.log("Citiess::::");
      console.log('citi isZoom::::', isZoom, distance(isLat, isLong, itm.latitude, itm.longitude))
      SetshowTheThing(false);
      if (!inRange(isZoom, 8, 13)) {
        // console.log("city if:::",ZoomMap);
        ZoomMapCities(
          topLeft.latitude,
          topLeft.longitude,
          topRight.latitude,
          topRight.longitude,
          bottomLeft.latitude,
          bottomLeft.longitude,
          bottomRight.latitude,
          bottomRight.longitude
        );

        isZoom = ZoomMap;
      } else if (
        isZoom == ZoomMap &&
        distance(isLat, isLong, itm.latitude, itm.longitude) > 3
      ) {
        // console.log("city else:::",ZoomMap);
        ZoomMapCities(
          topLeft.latitude,
          topLeft.longitude,
          topRight.latitude,
          topRight.longitude,
          bottomLeft.latitude,
          bottomLeft.longitude,
          bottomRight.latitude,
          bottomRight.longitude
        );
      }
    }

    if (zoomLevel == 3) {
      console.log("area:::");
      if (!inRange(isZoom, 14, 25)) {
        SetshowTheThing(false);
        console.log("isZoom::::", isZoom);
        FishName='';
        //  onMapLoadShopsApi(latitude, longitude, isZoom);
        // onMapLoadShopsApi(latitude, longitude)
        enable == true
          ? onMapLoadShopsApi(
            currenttopLeftLat,
            currenttopLeftLon,
            currenttopRightLat,
            currenttopRightLon,
            currentbottomLeftLat,
            currentbottomLeftLon,
            currentbottomRightLat,
            currentbottomRightLon
          )
          : null;

        isZoom = ZoomMap;
      } else if (inRange(isZoom, 14, 25)) {
        isZoom = ZoomMap;
        SetshowTheThing(true);
      }
    }
    isLat = itm.latitude;
    isLong = itm.longitude;
  }

  return (
    <View style={[Style.introScreen]}>
      <MapNew
        navigation={navigation}
        mapRef={mapRef}
        polylineRef={polylineRef}
        currentLocation={currentLocation.current}
        //   initialRegion={region.current}
        onPressMap={handlePressMap}
        //  onMapReady={(itm)=>{

        //  }}
        searchEnabled={fishdDetail.current != null}
        markers={mapMarker}
        timer={timer}
        enable={(enable) => {
          setEnable(enable);
          // console.log("item enable::::", enable);
        }}
        onRegionChangeComplete={(itm, ZoomMap, zoomLevel) => {
          console.log('onRegionChangeComplete::::');
          onRegionChanges(itm, ZoomMap, zoomLevel)
        }}
        onRegionChange={(itm, ZoomMap, zoomLevel) => {

          console.log('onRegionChange::::');
          //SetZoomLevelData(zoomLevel);

          // isZoom = parseInt (Math.log2(360 * (windowWidth / 256 / itm.longitudeDelta)) + 1);
        }}

        onShopClicked={(shop) => {
          shop.directionActive = false;
          let shopLatLong = {
            latitude: parseFloat(shop.lat),
            longitude: parseFloat(shop.long == undefined ? shop.lon : shop.long),
            latitudeDelta: 0.0123,
            longitudeDelta: 0.0123,
          };
          showPolyline([]);
          moveRegion(shopLatLong);
          showShopList.current = false;
          if (searchEnabled.current && fishdDetail.current != null) {
            if (shop.closed) {
              showMessageDialog(
                translations,
                translations.alert,
                translations.shop_closed_on_shop_map
              );
              let newMap = [];
              mapMarker.current.map((sp) => {
                sp.isactive = false;
                newMap.push(sp);
              });
              mapMarker.current = newMap;
              setRefresh(!refresh);
              showPolyline([]);
            } else {
              console.log("shop::if", shopCardDetailRef.current);
              showCard.current = true;
              if (
                shopCardDetailRef != null &&
                shopCardDetailRef.current != null &&
                shopCardDetailRef.current.id === shop.id
              ) {
                // toggleVisibility("flex");

                shopCardDetailRef.current = shop;
                setRefresh(!refresh);
                showPolyline([]);

              } else if (
                shopCardDetailRef != null &&
                shopCardDetailRef.current != null &&
                shopCardDetailRef.current._id === shop._id
              ) {
                console.log("shop::elseif");
                shopCardDetailRef.current = shop;
                setRefresh(!refresh);
                showPolyline([]);

              }

              else {
                console.log("shop::else");


                let newMap = [];
                mapMarker.current.map((sp) => {
                  sp.isactive = false;
                  newMap.push(sp);
                });
                shop.isactive = true;
                shopCardDetailRef.current = shop;
                mapMarker.current = newMap;
                setRefresh(!refresh);
                showPolyline([]);

              }
              let a = [];
              (mapMarker.current.map((e) => {
                if (e._id == shop._id) {
                  e.isactive = true;
                }
                else {
                  e.isactive = false;
                }
                a.push(e);
              }))
              shop.isactive = true;
              shopCardDetailRef.current = shop;
              mapMarker.current = a;
              setRefresh(!refresh);
             showPolyline([]);

            }
          } else {
            showCard.current = true;
            if (
              shopCardDetailRef != null &&
              shopCardDetailRef.current != null &&
              shopCardDetailRef.current.id === shop.id
            ) {
              // toggleVisibility("flex");
              setRefresh(!refresh);
            } else {
              let newMap = [];
              mapMarker.current.map((sp) => {
                sp.isactive = false;
                newMap.push(sp);
              });
              shop.isactive = true;
              shopCardDetailRef.current = shop;
              // toggleVisibility("flex");
              mapMarker.current = newMap;
              setRefresh(!refresh);
              showPolyline([]);
            }
          }
          setRefresh(!refresh);
          getCoordinates(shop, false);
        }}
        onCurrentLocation={(
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta
        ) => {
          currentLocation.current = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          };
          userLocation.current = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          };
          // setRegion({
          //   latitude: latitude,
          //   longitude: longitude,
          //   latitudeDelta: latitudeDelta,
          //   longitudeDelta: longitudeDelta,
          // });
          region.current = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          };

          // onMapLoadShopsApi(latitude, longitude, 16);
          // onMapLoadShopsApi(latitude, longitude);
        }}
        onMapLocation={(
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta
        ) => { }}
      />

      <View style={styles.topContainer}>
        {searchEnabled.current ? (
          <Pressable
            onPress={() => {
              FishName = ''
              onResetMapLoadShopsApi(
                // region.current.latitude,
                // region.current.longitude
                currenttopLeftLat,
                currenttopLeftLon,
                currenttopRightLat,
                currenttopRightLon,
                currentbottomLeftLat,
                currentbottomLeftLon,
                currentbottomRightLat,
                currentbottomRightLon
              );
            }}
          >
            <Card style={styles.backContainer}>
              <BackIcon width={20} height={20} />
            </Card>
          </Pressable>
        ) : null}
        <Card style={styles.searchContainer}>
          <SearchView
            text={
              searchEnabled.current
                ?
                fishdDetail.current != null
                  ? fishdDetail.current.nameFr
                  : shopCardDetailRef.current != null
                    ? shopCardDetailRef.current.raisonSociale
                    : ""
                : ""
            }
            searchContainerStyle={styles.searchContainerStyle}
            showLeftIcon={true}
            showHint={true}
            hintTextColor={colors.search_hint}
            hint={translations.search_inventory_hint}
            leftIcon={require("../../../images/search.png")}
            onLeftIconClick={onLeftIconClicked}
            onSearchText={(text) => {
              // console.log("text::::SearchView",text);
            }}
            onFocusInput={() => {
              bestPriceFilterApplied.current = false;
              closetFilterApplied.current = false;
              activeIndex.current = -1;
              originShopList.current = [];
              shopList.current = [];
              fishdDetail.current = null;
              searchEnabled.current = false;
              navigation.navigate("SearchFishShop", {
                data: {
                  currenttopLeftLat,
                  currenttopLeftLon,
                  currenttopRightLat,
                  currenttopRightLon,
                  currentbottomLeftLat,
                  currentbottomLeftLon,
                  currentbottomRightLat,
                  currentbottomRightLon,
                },
                onReturn: (item) => {
                  //  resetAll();
                  console.log("Shop Item:::", item);
                  SetSearchViewText(item.name);
                  FishName = item.name;
                  onSearchedShopApi(item);
                  SetOrderId(item.id)
                  searchEnabled.current = true;
                  if (isShop(item)) {
                    showCard.current = false;
                    showShopList.current = true;
                    fishdDetail.current = item;
                    NetInfo.fetch().then((state) => {
                      if (state.isConnected) {
                        fishShopsOnMapChangedApi(item, 0, currenttopLeftLat,
                          currenttopLeftLon,
                          currenttopRightLat,
                          currenttopRightLon,
                          currentbottomLeftLat,
                          currentbottomLeftLon,
                          currentbottomRightLat,
                          currentbottomRightLon);

                      } else {
                        showNoInternet(translations);
                      }
                    });
                  } else {
                    showCard.current = true;
                    showShopList.current = false;
                    shopCardDetailRef.current = item;
                    currentLocation.current = {
                      latitude: parseFloat(item.lat),
                      longitude: parseFloat(item.long),
                      latitudeDelta: region.current.latitudeDelta,
                      longitudeDelta: region.current.longitudeDelta,
                    };
                    region.current = {
                      latitude: parseFloat(item.lat),
                      longitude: parseFloat(item.long),
                      latitudeDelta: region.current.latitudeDelta,
                      longitudeDelta: region.current.longitudeDelta,
                    };
                    //console.log("onReturn:::::");
                    // goToInitialLocation(currentLocation.current)
                    moveRegion(region.current);
                    // NetInfo.fetch().then((state) => {
                    //   if (state.isConnected) {
                    //     onSearchedShopApi(item);
                    //   } else {
                    //     showNoInternet(translations);
                    //   }
                    // });
                  }
                },
              });
            }}
          />
        </Card>
        <Card style={styles.scanContainer}>
          {isLoggedIn(authentication) ? (
            <ShopProfileIcon
              width={24}
              height={24}
              onPressIn={onStoreClicked}
            />
          ) : (
            <ScanIcon width={24} height={24} onPressIn={onScanClicked} />
          )}
        </Card>
        {showTheThing && (
          <View style={styles.btn}>
            {/* <Button
              onPress={() => {
                //onMapLoadShopsApi(currentLat, currentLong, isZoom)
                onMapLoadShopsApi(currenttopLeftLat,currenttopLeftLon,currenttopRightLat,currenttopRightLon,currentbottomLeftLat,currentbottomLeftLon,currentbottomRightLat,currentbottomRightLon);
                SetshowTheThing(false);
              }}
              title={translations.zoombtn}
              color={colors.black}
            /> */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
              
                console.log('FishName:::', FishName);
                if (FishName != '' && FishName != undefined) {
                  fishShopsOnMapChangedApi(fishdDetail.current, 0, currenttopLeftLat, currenttopLeftLon, currenttopRightLat, currenttopRightLon, currentbottomLeftLat, currentbottomLeftLon, currentbottomRightLat, currentbottomRightLon)

                } else {
               
                  onMapLoadShopsApi(
                    currenttopLeftLat,
                    currenttopLeftLon,
                    currenttopRightLat,
                    currenttopRightLon,
                    currentbottomLeftLat,
                    currentbottomLeftLon,
                    currentbottomRightLat,
                    currentbottomRightLon
                  );
                }
                SetshowTheThing(false);
              }}
              style={styles.appButtonContainer}
            >
              <Text style={styles.appButtonText}>{translations.zoombtn}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {showCard.current === true || showShopList.current === true ? (
        <View style={styles.bottomContainer}>
          <View
            style={{
              height: 300,
            }}
          >
            {shopCardDetailRef.current != null &&
              !isShop(shopCardDetailRef.current) &&
              showCard.current === true ? (
              <View
                style={{
                  height: 300,
                }}
              >
                <ShopDetailCard />
              </View>
            ) : null}
            {searchEnabled.current &&
              shopList.current.length > 0 &&
              showShopList.current === true ? (
              <>
                <View
                  style={{
                    marginBottom: 100,
                  }}
                >
                  <ActionButton
                    backgroundTappable={true}
                    size={48}
                    buttonColor={colors.white}
                    renderIcon={(active) =>
                      active ? (
                        <CloseFloatingIcon width={24} height={24} />
                      ) : closetFilterApplied.current ||
                        bestPriceFilterApplied.current ? (
                        <FilterFloatingIcon width={48} height={48} />
                      ) : (
                        <FilterIcon width={24} height={24} />
                      )
                    }
                  >
                    <ActionButton.Item
                      textContainerStyle={{
                        backgroundColor: colors.shop_name,
                      }}
                      size={48}
                      textStyle={{
                        color: colors.white,
                      }}
                      buttonColor={
                        closetFilterApplied.current
                          ? colors.white
                          : colors.bg_floating_button
                      }
                      title={translations.the_closet}
                      onPress={() => {
                        NetInfo.fetch().then((state) => {
                          if (fishdDetail.current != null) {
                            if (state.isConnected) {
                              shopCardDetailRef.current = null;
                              bestPriceFilterApplied.current = false;
                              closetFilterApplied.current =
                                !closetFilterApplied.current;
                              fishShopsOnMapChangedApi(fishdDetail.current, 0, currenttopLeftLat,
                                currenttopLeftLon,
                                currenttopRightLat,
                                currenttopRightLon,
                                currentbottomLeftLat,
                                currentbottomLeftLon,
                                currentbottomRightLat,
                                currentbottomRightLon);
                            } else {
                              showNoInternet(translations);
                            }
                          }
                        });
                      }}
                    >
                      {closetFilterApplied.current ? (
                        <LocationSelectedIcon height={48} width={48} />
                      ) : (
                        <LocationFloatingIcon width={24} height={24} />
                      )}
                    </ActionButton.Item>
                    <ActionButton.Item
                      textContainerStyle={{
                        backgroundColor: colors.shop_name,
                      }}
                      size={48}
                      textStyle={{
                        color: colors.white,
                      }}
                      buttonColor={
                        bestPriceFilterApplied.current
                          ? colors.white
                          : colors.bg_floating_button
                      }
                      title={translations.best_price}
                      onPress={() => {
                        NetInfo.fetch().then((state) => {
                          if (fishdDetail.current != null) {
                            if (state.isConnected) {
                              shopCardDetailRef.current = null;
                              closetFilterApplied.current = false;
                              bestPriceFilterApplied.current =
                                !bestPriceFilterApplied.current;
                              fishShopsOnMapChangedApi(fishdDetail.current, 1, currenttopLeftLat,
                                currenttopLeftLon,
                                currenttopRightLat,
                                currenttopRightLon,
                                currentbottomLeftLat,
                                currentbottomLeftLon,
                                currentbottomRightLat,
                                currentbottomRightLon);
                            } else {
                              showNoInternet(translations);
                            }
                          }
                        });
                      }}
                    >
                      {bestPriceFilterApplied.current ? (
                        <DTSelectedFloatingIcon height={48} width={48} />
                      ) : (
                        <DTFloatingIcon width={24} height={24} />
                      )}
                    </ActionButton.Item>
                  </ActionButton>
                </View>
                <SearchShopList
                  items={shopList.current}
                  activeIndexFrom={activeIndex.current}
                  onDirectionClick={(item, index) => {
                   console.log("shopList.currentData::::",shopList.current);
                    console.log("MapItems:::", item,index);
                    shopCardDetailRef.current=item;
                    //shopList.current=item;
                    console.log("shopCardDetailRef.current:::::1",shopCardDetailRef.current);
                    activeIndex.current = index;
                    if (index != -1) {
                     
                      if (shopCardDetailRef.current != null && shopCardDetailRef.current != undefined) {
                            shopCardDetailRef.current.directionActive = true;
                      }
                    
                      // currentLocation.current = {
                      //   latitude: parseFloat(item.shop==undefined ? item.lat : item.shop.lat),
                      //   longitude: parseFloat(item.shop==undefined ? item.lon : item.shop.lon),
                      //   latitudeDelta: region.current.latitudeDelta,
                      //   longitudeDelta: region.current.longitudeDelta,
                      // };
                      // region.current = {
                      //   latitude: parseFloat(item.shop==undefined ? item.lat : item.shop.lat),
                      //   longitude: parseFloat(item.shop==undefined ? item.lon : item.shop.lon),
                      //   latitudeDelta: region.current.latitudeDelta,
                      //   longitudeDelta: region.current.longitudeDelta,
                      // };
                      let shopLatLong = {
                        latitude: parseFloat(item.shop == undefined ? item?.lat : item?.shop?.lat),
                        longitude: parseFloat(item.shop == undefined ? item?.lon : item?.shop?.lon),
                        latitudeDelta: region.current.latitudeDelta,
                        longitudeDelta: region.current.longitudeDelta,

                      };
                      console.log("SearchShopList::::", shopCoordinatesMap.current, item._id)
                      moveRegion(shopLatLong);
                      if (shopCoordinatesMap.current.has(item._id)) {
                        let decodeCoordinates = shopCoordinatesMap.current.get(
                          item._id
                        );
                        if (decodeCoordinates.length > 0) {
                          showPolyline(decodeCoordinates);
                        } else {
                          handleGetDirections(item, true);
                        }
                      } else {
                        handleGetDirections(item, true);
                      }
                      setRefresh(!refresh);
                      // onMapReliginChangedApi(
                      //   // parseFloat(item.lat),
                      //   //parseFloat(item.long)
                      //   currenttopLeftLat,
                      //   currenttopLeftLon,
                      //   currenttopRightLat,
                      //   currenttopRightLon,
                      //   currentbottomLeftLat,
                      //   currentbottomLeftLon,
                      //   currentbottomRightLat,
                      //   currentbottomRightLon
                      // );
                    } else {
                      if (shopCardDetailRef.current != null) {
                        if (shopCardDetailRef.current != undefined) {
                          shopCardDetailRef.current.directionActive = false;
                        } else {
                          shopCardDetailRef.current.directionActive = false;
                        }
                      }
                      showPolyline([]);
                      setRefresh(!refresh);

                    }
                  }}
                  onItemClick={(item) => {
                    console.log("MapStore:::", fishdDetail);

                    navigation.navigate("StoreDetail", {
                      store: item,
                      fish: null,
                      fishId: null,
                      //   fishId:fishdDetail?.current?.id,
                      onReturn: (item) => {
                        console.log("returnItem::::", item);
                        onMapChanged(item);
                        shopList.current=item;
                      },
                    });
                  }}
                  loader={false}
                />
              </>
            ) : null}
          </View>
        </View>
      ) : null}
      <ProgressDialogView visible={progress} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 15,
    color: "black",
    // fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  hello: {
    color: colors.hello_color,
  },
  lorem: {
    color: colors.white,
    textAlign: "center",
    paddingTop: 8,
    paddingBottom: 24,
  },
  topContainer: {
    top: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    position: "absolute",
  },
  btn: {
    top: 95,
    marginLeft: 70,
    paddingHorizontal: 40,
    position: "absolute",
    // backgroundColor: Platform.OS == "ios" ? "white" : "white",
    alignItems: "center",
    //borderWidth: Platform.OS == "ios" ? 1 : 0,
  },
  searchContainer: {
    flex: 1,
    marginStart: 8,
    marginTop: 40,
    marginEnd: 8,
  },
  backContainer: {
    height: 48,
    marginEnd: 8,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    width: 48,
  },
  scanContainer: {
    height: 48,
    marginStart: 8,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    width: 48,
  },
  searchContainerStyle: {
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
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
  shopName: {
    color: colors.shop_name,
    fontFamily: Style.font.semiBold,
    fontSize: 14,
  },
  shopContacts: {
    color: colors.shop_name,
    fontFamily: Style.font.regular,
    marginStart: 4,
    fontSize: 12,
  },
  SDOuterContainer: {
    flex: 1,
  },
  SDInnerContainer: {
    flexDirection: "row",
    alignSelf: "baseline",
    alignItems: "center",
    marginStart: 16,
    marginEnd: 16,
    marginTop: 16,
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
  SDLocationIcon: {
    marginEnd: 8,
  },
  SDShopNameInnerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginStart: 16,
    marginEnd: 16,
    marginVertical: 8,
  },
  SDLocationText: {
    color: colors.black,
    fontFamily: Style.font.medium,
    marginStart: 8,
    marginRight: 8,
    fontSize: 14,
  },
  SDLocationDivider: {
    height: 1,
    marginHorizontal: 16,
    backgroundColor: colors.card_shop_price_divider,
  },
  searchDialogContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: colors.white,
  },
  searchDialogSearchContainer: {
    paddingTop: 40,
    height: 100,
    width: "100%",
    paddingHorizontal: 16,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  searchDialogSearchContainerStyle: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderRadius: 48,
    borderColor: colors.card_shop_price_divider,
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
  shopCloseOpenContainer: {
    marginEnd: 8,
  },
  shopClosedContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  shopClosedText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: Style.font.medium,
  },
});

export default MapScreen;
