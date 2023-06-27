import Geolocation from "@react-native-community/geolocation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, AppState, Linking, Platform, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
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
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import CarMarker from "./CarMarker";

const MapNew = ({
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
  timer
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
      ],
      {
        cancelable: true,
        onDismiss: () => {
          showAgainSettingDialog();
        },
      }
    );
  }

  const _enableGPS = async () => {
    try {
     const result = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000
      });
      // do some action after the gps has been activated by the user
      
    } catch (error) {
    }
  };

  function askForPermission() {
    Geolocation.requestAuthorization(
      (success = () => {
        Geolocation.getCurrentPosition((info) => {
          userMarker.current = {
            latitude: 35.776159,
            longitude: 10.826581,
            latitudeDelta: 0.0123,
            longitudeDelta: 0.0123,
          };
        //   userMarker.current = {
        //     latitude: info.coords.latitude,
        //     longitude: info.coords.longitude,
        //     latitudeDelta:0.0123,
        //     longitudeDelta:0.0123,
        // };
          onCurrentLocation(
            userMarker.current.latitude,
            userMarker.current.longitude,
            0.0123,
            0.0123
          );
        },
        async error => {
          await _enableGPS();
        },);
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
      }
    } else {
      askForPermission();
    }
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (Platform.OS === "android") {
        if (AppState.currentState === "active") {
          if (userMarker.current === null) {
            askForPermission();
          }
        }
      } else {
        askForPermission();
      }
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

  const handleRegion =  (newRegion, details) => {
    clearTimeout(timer);
  };


 

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={ref => { mapRef = ref; }}
        style={{
          flex: 1,
        }}
        onRegionChange={handleRegion}
        onRegionChangeComplete={handleRegionChange}
        region={currentLocation}
        initialRegion={initialRegion}
        onTouchStart={onPressMap}
      >
        {userMarker.current != null && 
          <Polyline ref={polylineRef} coordinates={[]} strokeWidth={3} strokeColor={colors.polyline} />
         }
        
        {userMarker.current != null ? (
          <Marker
            key={userMarker.current.latitude.toString()}
            coordinate={{
              latitude: userMarker.current.latitude,
              longitude: userMarker.current.longitude,
            }}
            tracksViewChanges={false} 
            
          >
            <MarkerUser height={24} width={24} />
          </Marker>
        ) : null}
        { markers.current.map((marker,index) => (
            
            // <CarMarker data={marker} searchEnabled={searchEnabled} key={index} onShopClicked={onShopClicked}/>

              <Marker
              tracksViewChanges={false}
                key={marker.id.toString()}
                onPress={(event) => {
                  if(marker.closed){
                    onShopClicked(marker); 
                  }else{
                    if(marker.isactive != undefined && marker.isactive === true){
                      onShopClicked(marker);
                    }else{
                      marker.isactive = true;
                      onShopClicked(marker);
                    }
                  }
                }}
                coordinate={{
                  latitude: parseFloat(marker.lat),
                  longitude: parseFloat(marker.long),
                }}
              >
               {marker.isactive != undefined && marker.isactive === true ? 
               (searchEnabled ? <ShopFishClickedAvailable height={32} width={32} /> :<UserShopMarker height={24} width={24} />) : 
               (marker.closed ? 
               (searchEnabled ? <ShopFishUnavailable height={32} width={32} />  : <ShopClosedMarker height={24} width={24} />) :
               (searchEnabled ? <ShopFishAvailable height={32} width={32} />: <ShopOpenMarker height={24} width={24} />))  }
              </Marker>
          ))}
        {/* {searchEnabled &&
          markers &&
          markers.map((marker) =>
            marker.isactive != undefined && marker.isactive === true ? (
              <Marker
                key={marker.id.toString()}
                onPress={(event) => {
                  let newmarkerList = [];
                  markers.map((mark) => {
                    newmarkerList.push(mark);
                  });
                  onShopClicked(newmarkerList, marker);
                }}
                coordinate={{
                  latitude: parseFloat(marker.lat),
                  longitude: parseFloat(marker.long),
                }}
              >
                <ShopFishClickedAvailable height={32} width={32} />
              </Marker>
            ) : marker.closed ? (
              <Marker
                key={marker.id.toString()}
                onPress={(event) => {
                  onShopClicked([], marker);
                }}
                coordinate={{
                  latitude: parseFloat(marker.lat),
                  longitude: parseFloat(marker.long),
                }}
              >
                <ShopFishUnavailable height={32} width={32} />
              </Marker>
            ) : (
              <Marker
                key={marker.id.toString()}
                onPress={(event) => {
                  let newmarkerList = [];
                  markers.map((mark) => {
                    if (marker.id === mark.id) {
                      mark.isactive = true;
                    } else {
                      mark.isactive = false;
                    }
                    newmarkerList.push(mark);
                  });
                  onShopClicked(newmarkerList, marker);
                }}
                coordinate={{
                  latitude: parseFloat(marker.lat),
                  longitude: parseFloat(marker.long),
                }}
              >
                <ShopFishAvailable height={32} width={32} />
              </Marker>
            )
          )}
        {!searchEnabled &&
          markers &&
          markers.map((marker) =>
            marker.isactive != undefined && marker.isactive === true ? (
              <Marker
                key={marker.id.toString()}
                onPress={(event) => {
                  let newmarkerList = [];
                  markers.map((mark) => {
                    newmarkerList.push(mark);
                  });
                  onShopClicked(newmarkerList, marker);
                }}
                coordinate={{
                  latitude: parseFloat(marker.lat),
                  longitude: parseFloat(marker.long),
                }}
              >
                <UserShopMarker height={24} width={24} />
              </Marker>
            ) : marker.closed ? (
              <Marker
                onPress={(event) => {
                  onShopClicked([], marker);
                }}
                key={marker.id.toString()}
                coordinate={{
                  latitude: parseFloat(marker.lat),
                  longitude: parseFloat(marker.long),
                }}
              >
                <ShopClosedMarker height={24} width={24} />
              </Marker>
            ) : (
              <Marker
                key={marker.id.toString()}
                onPress={(event) => {
                  let newmarkerList = [];
                  markers.map((mark) => {
                    if (marker.id === mark.id) {
                      mark.isactive = true;
                    } else {
                      mark.isactive = false;
                    }
                    newmarkerList.push(mark);
                  });
                  onShopClicked(newmarkerList, marker);
                }}
                coordinate={{
                  latitude: parseFloat(marker.lat),
                  longitude: parseFloat(marker.long),
                }}
              >
                <ShopOpenMarker height={24} width={24} />
              </Marker>
            )
          )} */}
      </MapView>
      <ProgressDialogView visible={progress} />
    </View>
  );
};

export default MapNew;
