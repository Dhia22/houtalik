//import liraries
import React, { Component, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import ShopFishClickedAvailable from "../../../images/ic_fish_shop_clicked.svg";
import UserShopMarker from "../../../images/ic_shop_clicked_marker.svg";
import ShopFishUnavailable from "../../../images/ic_fish_shop_unavailable.svg";
import ShopClosedMarker from "../../../images/ic_store_closed.svg";
import ShopFishAvailable from "../../../images/ic_fish_shop_available.svg";
import ShopOpenMarker from "../../../images/ic_store_without_outline.svg";

const CarMarker = (props) => {
  return (
    <Marker
    tracksViewChanges={false}
      key={props.data.id.toString()}
      onPress={(event) => {
        if(props.data.closed){
         props.onShopClicked(props.data); 
        }else{
          if(props.data.isactive != undefined && props.data.isactive === true){
            props.onShopClicked(props.data);
          }else{
            props.data.isactive = true;
            props.onShopClicked(props.data);
          }
        }
      }}
      coordinate={{
        latitude: parseFloat(props.data.lat),
        longitude: parseFloat(props.data.long),
      }}
    >
     {props.data.isactive != undefined && props.data.isactive === true ? 
     (props.searchEnabled ? <ShopFishClickedAvailable height={32} width={32} /> :<UserShopMarker height={24} width={24} />) : 
     (props.data.closed ? 
     (props.searchEnabled ? <ShopFishUnavailable height={32} width={32} />  : <ShopClosedMarker height={24} width={24} />) :
     (props.searchEnabled ? <ShopFishAvailable height={32} width={32} />: <ShopOpenMarker height={24} width={24} />))  }
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

export default React.memo(CarMarker);
