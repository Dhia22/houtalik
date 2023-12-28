import Geolocation from "@react-native-community/geolocation";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Linking,
  Platform,
  View,
  Dimensions,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import ShopFishAvailable from "../../../images/ic_fish_shop_available.svg";
import ShopFishClickedAvailable from "../../../images/ic_fish_shop_clicked.svg";
import ShopFishUnavailable from "../../../images/ic_fish_shop_unavailable.svg";
import MarkerUser from "../../../images/ic_marker_user.svg";
import UserShopMarker from "../../../images/ic_shop_clicked_marker.svg";
import ShopClosedMarker from "../../../images/ic_store_closed.svg";
import ShopOpenMarker from "../../../images/ic_store_without_outline.svg";
import ProgressDialogView from "../../appcomponents/ProgressDialogView";
import { colors } from "../../css/colors";
import { LocalizationContext } from "../../locale/LocalizationContext";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import { isNullOrEmpty } from "../../validators/EmailValidator";

var ZoomMap = 0;
var isZoom = 1;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


const MapNew = ({
  enable,
  navigation,
  mapRef,
  polylineRef,
  initialRegion,
  currentLocation,
  searchEnabled,
  markers,
  onShopClicked,
  onCurrentLocation,
  onMapLocation,
  onPressMap,
  timer,
  onRegionChange,
  onRegionChangeComplete
}) => {
  const { translations } = useContext(LocalizationContext);
  const [progress, setProgressBar] = useState(false);
  const userMarker = useRef(null);
  Geolocation.setRNConfiguration(
    (config = {
      skipPermissionRequests: true,
      authorizationLevel: "auto",
      locationProvider: "auto",
    })
  );
  function showAgainSettingDialog() {
      
    Alert.alert(
      translations.location_permission,
      translations.get_current_location_msg,
      [
        {
          text: translations.go_to_settings,
          onPress: () => {
            Linking.openSettings();
          },
        },
        {
          text: translations.ok,
          cancelable: true,
          onDismiss: () => {
           // showAgainSettingDialog();
          },
        }
      
      ],
      // {
      //   cancelable: true,
      //   onDismiss: () => {
      //    // showAgainSettingDialog();
      //   },
      // }
    );
  }

  const _enableGPS = async () => {
    try {
      const result =
        await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        });
      // do some action after the gps has been activated by the user
    } catch (error) {}
  };


  function askForPermission() {
    Geolocation.requestAuthorization(
      (success = () => {
        Geolocation.getCurrentPosition(
          (info) => {
           enable(true)
            const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
            const circumference = (40075 / 360) * 1000;
            const latDelta = info.coords.accuracy * (1 / (Math.cos(info.coords.latitude) * circumference));
            const lonDelta = info.coords.accuracy / oneDegreeOfLongitudeInMeters;
           
           // console.log("info::::", latDelta,lonDelta);
           

            // userMarker.current = {
            //   latitude: 35.776159,
            //   longitude: 10.826581,
            //   latitudeDelta: 0.0123,
            //   longitudeDelta: 0.0123,
            // };


            userMarker.current = {
              latitude: info.coords.latitude,
              longitude: info.coords.longitude,
              latitudeDelta:Math.max(0, latDelta),
              longitudeDelta: Math.max(0, lonDelta),
            };

            onCurrentLocation(
              userMarker.current.latitude,
              userMarker.current.longitude,
              userMarker.current.latitudeDelta,
              userMarker.current.longitudeDelta
            );
          },
          async (error) => {
            
            await _enableGPS();
          }
        );
      }),
      (error = (error) => {
         showAgainSettingDialog();
      })
    );
  }

  useEffect(() => {
    if (Platform.OS === "android") {
      if (AppState.currentState === "active") {
        if (userMarker.current === null) {
          askForPermission();
        }
      }else{
        askForPermission();
      }
    } else {
      askForPermission();
    }
    const subscription = AppState.addEventListener("change", (nextAppState) => {
     
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleRegionChange = (newRegion, details) => {
    if (details.isGesture) {
      onMapLocation(
        newRegion.latitude,
        newRegion.longitude,
        newRegion.latitudeDelta,
        newRegion.longitudeDelta
      );
    }
  };

  const handleRegion = (newRegion, details) => {
    clearTimeout(timer);
  //  setRegion(newRegion);
  };

  const changeRegion = async (region) => {
    
    ZoomMap = parseInt(
      Math.log2(360 * (windowWidth / 256 / region.longitudeDelta)) + 1
    );

    if (ZoomMap > 1 && ZoomMap < 8) {
      isZoom = 1;
    } else if (ZoomMap >= 8 && ZoomMap <= 13) {
      isZoom = 2;
    } else if (ZoomMap >13) {
      isZoom = 3;
    }
    onRegionChange(region, ZoomMap, isZoom);
    
  };

  const changeRegionComplete = async (region) => {

    ZoomMap = parseInt(
      Math.log2(360 * (windowWidth / 256 / region.longitudeDelta)) + 1
    );

    if (ZoomMap > 1 && ZoomMap < 8) {
      isZoom = 1;
    } else if (ZoomMap >= 8 && ZoomMap <= 13) {
      isZoom = 2;
    } else if (ZoomMap >13) {
      isZoom = 3;
    }
    
    onRegionChangeComplete(region,ZoomMap,isZoom);
  };

  console.log("PolyLine",polylineRef);
  console.log("Markers:::MApNew::::",markers);
  console.log("SearchEnabled:::::",searchEnabled);
  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={(ref) => {
          mapRef = ref;
        }}
        style={{
          flex: 1,
        }}
        optimizeWaypoints={true}
       showsUserLocation={true}
        scrollEnabled={true}
        onRegionChange={changeRegion}
        // onRegionChangeComplete={handleRegionChange}
        onRegionChangeComplete={changeRegionComplete}
        region={currentLocation}
        initialRegion={initialRegion}
        onTouchStart={onPressMap}
        minZoomLevel={1}
        maxZoomLevel={25}
        liteMode={false}
      >
   
      {

      (isZoom == 1 || isZoom == 2 ? 
        <>
        {markers.current.map((marker, index) =>
          //console.log("Datat lat",marker?.lat,marker?.lon)
          marker.lat != null && marker.lon != null ? (
            <Marker
              key={index}
              tracksViewChanges={false}
              coordinate={{
                latitude: parseFloat(marker?.lat),
                longitude: parseFloat(marker?.lon),
              }}
            >
              <ShopOpenMarker height={24} width={24} />
            </Marker>
          ) : null
          
        )}
        </>
        
        :
        <>
      {userMarker.current != null ? (
        <Marker
          tracksViewChanges={false}
          key={userMarker.current?.latitude.toString()}
          coordinate={{
            latitude: parseFloat(userMarker.current?.latitude),
            longitude: parseFloat(userMarker.current?.longitude),
          }}
        >
          <MarkerUser height={24} width={24} />
        </Marker>
      ) : null}

    {!markers.isNullOrEmpty && markers.current.map((marker, index) => (
      // console.log("Marker:::::::::::",marker)
            <Marker
              key={marker.id}
              onPress={(event) => {
                if (marker.closed) {
                  onShopClicked(marker);
                } else {
                  if (
                    marker.isactive != undefined &&
                    marker.isactive === true
                  ) {
                    onShopClicked(marker);
                  } else {
                    marker.isactive = true;
                    onShopClicked(marker);
                   
                  }
                 
                }
              }}
              coordinate={{
                latitude: parseFloat(marker.lat),
                longitude: parseFloat((!("lon" in Object(marker))) ? marker.long :marker.lon ),
              }}
            >
              {marker.isactive != undefined && marker.isactive === true ? (
                searchEnabled ? (
                  <ShopFishClickedAvailable height={32} width={32} />
                ) : (
                  <UserShopMarker height={24} width={24} />
                )
              ) : marker.closed ? (
                searchEnabled ? (
                  <ShopFishUnavailable height={32} width={32} />
                ) : (
                  <ShopClosedMarker height={24} width={24} />
                )
              ) : searchEnabled ? (
                <ShopFishAvailable height={32} width={32} />
              ) : (
                <ShopOpenMarker height={24} width={24} />
              )}
            </Marker>
          ))}
      </>
        
        )
      }

      { polylineRef.current != null? ( 
        <Polyline
               coordinates={polylineRef.current}
               strokeColor="#000"
               fillColor="rgba(255,0,0,0.5)"
               strokeWidth={3}
             />  ) : 
            null}
      
      </MapView>
      <ProgressDialogView visible={progress} />
    </View>
  );
  
};

export default MapNew;
