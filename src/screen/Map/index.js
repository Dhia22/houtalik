import NetInfo from "@react-native-community/netinfo";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ActionButton from "react-native-action-button";
import { useSelector } from "react-redux";
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
import MapViewDirections from "react-native-maps-directions";
import { useIsFocused } from "@react-navigation/native";

const MapScreen = ({ navigation, route }) => {
  const windowWidth = Dimensions.get("window").width;
  const { translations } = useContext(LocalizationContext);
  const authentication = useSelector((state) => state.authentication);
  const [progress, setProgressBar] = useState(false);
  const mapMarker = useRef([]);
  // const [mapMarker, setMapMarkers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
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
  const polylineRef = useRef(new Polyline());
  // const showShopCardDetail = useRef(null);
  const shopCardDetailRef = useRef(null);
  const showCard = useRef(false);
  const showShopList = useRef(false);
  const currentLocation = useRef({
    latitude: 35.776159,
    longitude: 10.826581,
    latitudeDelta: 0.0123,
    longitudeDelta: 0.0123,
  });
  const userLocation = useRef({
    latitude: 35.776159,
    longitude: 10.826581,
    latitudeDelta: 0.0123,
    longitudeDelta: 0.0123,
  });
  const region = useRef({
    latitude: 35.776159,
    longitude: 10.826581,
    latitudeDelta: 0.0123,
    longitudeDelta: 0.0123,
  });
  const shopCoordinatesMap = useRef(new Map());
  let cancelSource = axios.CancelToken.source();
  let cancelMapApiSource = axios.CancelToken.source();
  let cancelShopDetailSource = axios.CancelToken.source();

  async function onMapChanged(storeDetail) {
    // if (storeDetail != null) {
    //   currentLocation.current = {
    //     latitude: parseFloat(storeDetail.lat),
    //     longitude: parseFloat(storeDetail.long),
    //     latitudeDelta: region.current.latitudeDelta,
    //     longitudeDelta: region.current.longitudeDelta,
    //   };
    //   shopCardDetailRef.current = storeDetail;
    //   if (shopCardDetailRef.current.directionActive === true) {
    //     if (shopCoordinatesMap.current.has(shopCardDetailRef.current.id.toString())) {
    //       let decodeCoordinates =
    //         shopCoordinatesMap.current.get(shopCardDetailRef.current.id.toString());
    //       if (decodeCoordinates.length > 0) {
    //         showPolyline(decodeCoordinates);
    //         setRefresh(!refresh);
    //       } else {
    //         handleGetDirections(shopCardDetailRef.current, true);
    //         setRefresh(!refresh);
    //       }
    //     } else {
    //       handleGetDirections(shopCardDetailRef.current, true);
    //       setRefresh(!refresh);
    //     }
    //   } else {
    //     showPolyline([]);
    //     setRefresh(!refresh);
    //   }
    // }
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
      parseFloat(shopCardDetail.lat),
      parseFloat(shopCardDetail.long)
    );
    cancelSource = null;
    let markerList = [];
    if (searchShopResult != null && searchShopResult.length > 0) {
      searchShopResult.map((marker) => {
        marker.isactive = false;
        if (marker.id === shopCardDetail.id) {
          if (shopCardDetail.closed === false) {
            marker.isactive = true;
          }
          markerList.push(marker);
        } else {
          markerList.push(marker);
        }
      });
    }
    mapMarker.current = markerList;
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

  async function onMapLoadShopsApi(latitude, longitude) {
    setProgressBar(true);
    cancelToken();
    const shopsNearBySearchedShop = await service.shopOnMap(
      cancelSource,
      latitude,
      longitude
    );
    cancelSource = null;
    mapMarker.current = [];
    if (shopsNearBySearchedShop != null && shopsNearBySearchedShop.length > 0) {
      shopsNearBySearchedShop.map(shop => {
        mapMarker.current.push(shop);
      })
    }
    setProgressBar(false);
  }

  async function onResetMapLoadShopsApi(latitude, longitude) {
    setProgressBar(true);
    cancelToken();
    const shopsNearBySearchedShop = await service.shopOnMap(
      cancelSource,
      latitude,
      longitude
    );
    cancelSource = null;
    mapMarker.current = [];
    resetAll();
    if (shopsNearBySearchedShop != null && shopsNearBySearchedShop.length > 0) {

      shopsNearBySearchedShop.map(shop => {
        mapMarker.current.push(shop);
      })
    }
    setProgressBar(false);
  }

  // Function to add a new marker to the array
  async function fishShopsOnMapChangedApi(fishdDetail, order) {
    setProgressBar(true);
    const fishShops = await service.fishShops(fishdDetail.id, order);
    let latestShops = [];
    if (fishShops != null && fishShops.length > 0) {
      mapMarker.current.map((outShop) => {
        outShop.isactive = false;
        let shopClosed = true;
        fishShops.map((inShop) => {
          if (inShop.id === outShop.id) {
            shopClosed = false;
          }
        });
        outShop.closed = shopClosed;
        latestShops.push(outShop);
      });
      originShopList.current = fishShops;
      shopList.current = fishShops;
      showShopList.current = true;
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
      // toggleVisibility("none");
    }
    mapMarker.current = latestShops;
    // setMapMarkers(latestShops);
    setProgressBar(false);
  }

  async function onMapReliginChangedApi(latitude, longitude) {
    if (mapMarker.current.length === 0) {
      cancelMapApiToken();
      const shopsNearBySearchedShop = await service.shopOnMap(
        cancelMapApiSource,
        latitude,
        longitude
      );
      cancelSource = null;
      let markerlist = [];
      if (shopsNearBySearchedShop != null && shopsNearBySearchedShop.length > 0) {
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
      setRefresh(!refresh)
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
          if(isFocused){
          if (state.isConnected) {
            setFishs([]);
            shopDetail();
          } else {
            showNoInternet(translations);
          }
          }
        });
      }
    }, [isFocused]);

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
        shopCardDetailRef.current.id
      );
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
              fishId: (fishdDetail.current != null) ? fishdDetail.current.id : null,
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
                    text={shopCardDetailRef.current.raisonSociale}
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
                      Linking.openURL(`tel:${shopCardDetailRef.current.tel}`);
                    }}
                  >
                    <View style={[styles.SDShopNameInnerContainer]}>
                      <View style={[Style.rowDirection]}>
                        <PhoneOutGoingIcon width={16} height={16} />
                        <TextComponent
                          text={shopCardDetailRef.current.tel}
                          textStyle={styles.shopContacts}
                        />
                      </View>
                    </View>
                  </Pressable>
                </View>
              </View>
              <View style={styles.shopCloseOpenContainer}>
                {shopCardDetailRef.current.closed ? (
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
                  width={34}
                  height={34}
                  style={styles.SDLocationIcon}
                  onPress={() => {
                    shopCardDetailRef.current.directionActive = false;
                    showPolyline([]);
                    setDirectionActive(false);
                  }}
                />
              ) : (
                <ShopDirectionIcon
                  width={34}
                  height={34}
                  style={styles.SDLocationIcon}
                  onPress={() => {
                    let shopLatLong = {
                      latitude: parseFloat(shopCardDetailRef.current.lat),
                      longitude: parseFloat(shopCardDetailRef.current.long),
                      latitudeDelta: region.current.latitudeDelta,
                      longitudeDelta: region.current.longitudeDelta,
                    };
                    moveRegion(shopLatLong);
                    shopCardDetailRef.current.directionActive = true;
                    if (
                      shopCoordinatesMap.current.has(
                        shopCardDetailRef.current.id.toString()
                      )
                    ) {
                      let decodeCoordinates =
                        shopCoordinatesMap.current.get(
                          shopCardDetailRef.current.id.toString());
                      if (decodeCoordinates.length > 0) {
                        showPolyline(decodeCoordinates);
                      } else {
                        handleGetDirections(shopCardDetailRef.current, true);
                      }
                    } else {
                      handleGetDirections(shopCardDetailRef.current, true);
                    }
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
                    fish: fishdDetail.current,
                    fishId: (fishdDetail.current != null) ? fishdDetail.current.id : null,
                    onReturn: (item) => {
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

            {shopCardDetailRef.current.closed ? (
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
                    store: shopCardDetailRef.current,
                    fish: item,
                    fishId: item.fish,
                    onReturn: (item) => {
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
  }

  const decodePolyline = (encoded) => {
    const polyline = require("@mapbox/polyline");
    return polyline.decode(encoded).map((point) => ({
      latitude: point[0],
      longitude: point[1],
    }));
  };

  async function showPolyline(decodedPoints) {
    if (decodedPoints.length === 0) {
      polylineRef.current.setNativeProps({
        coordinates: [],
      });
    } else {
      polylineRef.current.setNativeProps({
        coordinates: decodedPoints.map((point) => ({
          latitude: point.latitude,
          longitude: point.longitude,
        })),
      });
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
    try {
      const origin =
        userLocation.current.latitude + "," + userLocation.current.longitude; // Starting coordinates
      const destination =
        shopdetail.lat + "," + shopdetail.long; // Destination coordinates
      const apiKey = "AIzaSyDg8AX5xQgqdPlXfqIMRhL-iSP5T8MMD9M";
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
      );
      const { data } = response;
      if (data.status === "OK") {
        const { routes } = data;
        const polylinePoints = routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(polylinePoints);
        shopCoordinatesMap.current.set(shopdetail.id.toString(), decodedPoints);
        if (allowCoordinate) {
          showPolyline(decodedPoints);
        }
      } else {
        if (allowCoordinate) {
          showPolyline([]);
        }
        // console.log('Error getting directions:', data.status);
      }
    } catch (error) {
      if (allowCoordinate) {
        showPolyline([]);
      }
    }
  };

  async function getCoordinates(shop, allow) {
    if (!shopCoordinatesMap.current.has(shop.id.toString())) {
      handleGetDirections(shop, allow);
    } else {
      if (
        shopCoordinatesMap.current.has(shop.id.toString()) &&
        shopCoordinatesMap.current.get(shop.id.toString()).length === 0
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

  return (
    <View style={[Style.introScreen]}>
      <MapNew
        navigation={navigation}
        mapRef={mapRef}
        polylineRef={polylineRef}
        currentLocation={currentLocation.current}
        initialRegion={region.current}
        onPressMap={handlePressMap}
        searchEnabled={fishdDetail.current != null}
        markers={mapMarker}
        timer={timer}
        onShopClicked={(shop) => {
          let shopLatLong = {
            latitude: parseFloat(shop.lat),
            longitude: parseFloat(shop.long),
            latitudeDelta: 0.0123,
            longitudeDelta: 0.0123,
          };
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
              mapMarker.current.map(sp => {
                sp.isactive = false;
                newMap.push(sp);
              })
              mapMarker.current = newMap;
              setRefresh(!refresh);
              showPolyline([]);
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
                mapMarker.current.map(sp => {
                  sp.isactive = false;
                  newMap.push(sp);
                })
                shop.isactive = true;
                shopCardDetailRef.current = shop;
                mapMarker.current = newMap;
                // toggleVisibility("flex");
                showPolyline([]);
                setRefresh(!refresh);
              }
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
              mapMarker.current.map(sp => {
                sp.isactive = false;
                newMap.push(sp);
              })
              if (shop.closed) {
                shop.isactive = false;
              } else {
                shop.isactive = true;
              }
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
          onMapLoadShopsApi(latitude, longitude);
        }}
        onMapLocation={(latitude, longitude, latitudeDelta, longitudeDelta) => {
          // clearTimeout(timer.current);
          // cancelMapApiToken();
          // timer.current = this.setTimeout(() => {
          //   region.current = {
          //     latitude: latitude,
          //     longitude: longitude,
          //     latitudeDelta: latitudeDelta,
          //     longitudeDelta: longitudeDelta,
          //   };
          //   // setRegion({
          //   //   latitude: latitude,
          //   //   longitude: longitude,
          //   //   latitudeDelta: latitudeDelta,
          //   //   longitudeDelta: longitudeDelta,
          //   // });
          //   onMapReliginChangedApi(latitude, longitude);
          // }, 3000);
        }}
      />
      <View style={styles.topContainer}>
        {searchEnabled.current ? (
          <Pressable onPress={() => {
            onResetMapLoadShopsApi(
              region.current.latitude,
              region.current.longitude
            );
          }}>
            <Card style={styles.backContainer}>
              <BackIcon
                width={20}
                height={20}
              />
            </Card>
          </Pressable>
        ) : null}
        <Card style={styles.searchContainer}>
          <SearchView
            text={
              searchEnabled.current
                ? fishdDetail.current != null
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
            onSearchText={(text) => { }}
            onFocusInput={() => {
              bestPriceFilterApplied.current = false;
              closetFilterApplied.current = false;
              activeIndex.current = -1;
              originShopList.current = [];
              shopList.current = [];
              fishdDetail.current = null;
              searchEnabled.current = false;

              navigation.navigate("SearchFishShop", {
                onReturn: (item) => {
                  setTimeout(() => {
                    searchEnabled.current = true;
                    if (isShop(item)) {
                      showCard.current = false;
                      showShopList.current = true;
                      fishdDetail.current = item;
                      NetInfo.fetch().then((state) => {
                        if (state.isConnected) {
                          fishShopsOnMapChangedApi(item, 0);
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
                      moveRegion(currentLocation.current);
                      NetInfo.fetch().then((state) => {
                        if (state.isConnected) {
                          onSearchedShopApi(item);
                        } else {
                          showNoInternet(translations);
                        }
                      });
                    }
                  }, 100);

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
      </View>
      {showCard.current === true || showShopList.current === true ? (<View
        style={styles.bottomContainer}>
        <View
          style={{
            height: 300,
          }}
        >
          {shopCardDetailRef.current != null &&
            !isShop(shopCardDetailRef.current) && showCard.current === true ? (
            <View
              style={{
                height: 300,
              }}>
              <ShopDetailCard />
            </View>
          ) : null}
          {
            searchEnabled.current &&
              shopList.current.length > 0 && showShopList.current === true ? (
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
                              fishShopsOnMapChangedApi(
                                fishdDetail.current,
                                0
                              );
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
                              fishShopsOnMapChangedApi(
                                fishdDetail.current,
                                1
                              );
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
                    activeIndex.current = index;
                    if (index != -1) {
                      if (shopCardDetailRef.current != null) {
                        if (shopCardDetailRef.current != undefined) {
                          shopCardDetailRef.current.directionActive = true;
                        } else {
                          shopCardDetailRef.current.directionActive = true;
                        }
                      }
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
                      let shopLatLong = {
                        latitude: parseFloat(item.lat),
                        longitude: parseFloat(item.long),
                        latitudeDelta: region.current.latitudeDelta,
                        longitudeDelta: region.current.longitudeDelta,
                      };
                      moveRegion(shopLatLong);
                      if (shopCoordinatesMap.current.has(item.id.toString())) {
                        let decodeCoordinates =
                          shopCoordinatesMap.current.get(item.id.toString());
                        if (decodeCoordinates.length > 0) {
                          showPolyline(decodeCoordinates);
                        } else {
                          handleGetDirections(item, true);
                        }
                      } else {
                        handleGetDirections(item, true);
                      }
                      setRefresh(!refresh);
                      onMapReliginChangedApi(
                        parseFloat(item.lat),
                        parseFloat(item.long)
                      );
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
                    navigation.navigate("StoreDetail", {
                      store: item,
                      fish: null,
                      fishId: fishdDetail.current.id,
                      onReturn: (item) => {
                        onMapChanged(item);
                      },
                    });
                  }}
                  loader={false}
                />
              </>
            ) : null
          }
        </View>
      </View>) : null}
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
    bottom: 0
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
