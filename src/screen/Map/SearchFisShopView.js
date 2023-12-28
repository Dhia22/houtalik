import 'react-native-reanimated';
import NetInfo from "@react-native-community/netinfo";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import SearchView from "../../appcomponents/SearchView";
import Card from "../../components/Card/Card";
import { colors } from "../../css/colors";
import { isShop, showNoInternet } from "../../utils/AppUtils";
import * as service from "../../utils/apis/services";
import SearchedList from "./SearchedList";
import axios from "axios";
import BackIcon from "../../../images/ic_back.svg";


const SearchFishShopView = ({
  navigation,
  route
}) => {

  const [searchedData, setSearchedList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [queryStr, setqueryStr] = useState('');
  // const [showDefaultPlaceholder, setShowDefaultPlaceholder] = useState(false);
  const showDefaultPlaceholder = useRef(false);
  let cancelSource = axios.CancelToken.source();
  const timer = useRef("");
  function onLeftIconClicked() {}
  let current=route?.params?.data;
  var currenttopLeftLat=current?.currenttopLeftLat;
  var currenttopLeftLon=current?.currenttopLeftLon;
  var currenttopRightLat=current?.currenttopRightLat;
  var currenttopRightLon=current?.currenttopRightLon;
  var currentbottomLeftLat=current?.currentbottomLeftLat;
  var currentbottomLeftLon=current?.currentbottomLeftLon;
  var currentbottomRightLat=current?.currentbottomRightLat;
  var currentbottomRightLon=current?.currentbottomRightLon;
  
  
  function searchFish(query){
    if (query.trim() != "") {
        NetInfo.fetch().then((state) => {
          if (state.isConnected) {
            searchFishAndShopApi(query);
          } else {
            showNoInternet(translations);
          }
        });
      }
  }

  function cancelToken(){
    if (cancelSource != undefined && cancelSource != null) {
       cancelSource.cancel();
    }
    cancelSource = null;
  }

  async function searchFishAndShopApi(query) {
    cancelSource = axios.CancelToken.source();
    setLoader(true);
    const result = await service.searchFishAndShop(cancelSource,query,currenttopLeftLat,currenttopLeftLon,currenttopRightLat,currenttopRightLon,currentbottomLeftLat,currentbottomLeftLon,currentbottomRightLat,currentbottomRightLon);
   console.log("resulf:::searchFishAndShop",result);
    cancelSource = null;
    if (result != null && result.length > 0) {
      let filteredList = [];
      result.map((item) => {
        if(isShop(item)){
          // if(item.nameFr.includes(query) ||item.nameAr.includes(query)){
            item.type = "1";
            item.name = item.nameFr;
            item.location = item.nameAr;
            filteredList.push(item);
          // }
        }else{
          // if(item.raisonSociale.includes(query)){
            item.type = "2";
            item.name = item.raisonSociale;
            item.location = item.adresse;
            filteredList.push(item);
          // }
        }
      });
      if(filteredList.length > 0){
        setSearchedList(filteredList);
      }else{
        setSearchedList([]);
        showDefaultPlaceholder.current = true;
      }
      setLoader(false);
    } else {
      showDefaultPlaceholder.current = true;
      setLoader(false);
      setSearchedList([]);
    }
  }

  return (
      <View style={styles.searchDialogContainer}>
        <Card style={styles.searchDialogSearchContainer}>
          <Pressable styles={{
            padding:20,
            backgroundColor:'red'
          }}
          onPress={() => {
          
            navigation.goBack();
        }}>
          <BackIcon
              width={20}
              height={20}
            />
          </Pressable>  
          <SearchView
            text={queryStr}
            searchContainerStyle={styles.searchDialogSearchContainerStyle}
            showLeftIcon={true}
            showHint={true}
            hintTextColor={colors.search_hint}
            hint={""}
            showKeyboardOnFocus={true}
            leftIcon={require("../../../images/search.png")}
            onLeftIconClick={onLeftIconClicked}
            onSearchText={(text) => {
            clearTimeout(timer.current);
            cancelToken();
            if(!loader){
              setLoader(true);
            }
            timer.current = this.setTimeout(() => {
              if (text.trim() != "") {
                searchFish(text);
            } else {
              showDefaultPlaceholder.current = false;
              setLoader(false);
              setSearchedList([]);
            }
            }, 1000);
            setqueryStr(text);
            }}
            onFocusInput={() => {
              setqueryStr("");
            }}
          />
        </Card>
        <SearchedList
          items={loader ? [] : searchedData}
          showDefaultPlaceholder={showDefaultPlaceholder.current}
          onItemClick={(item) => {
            navigation.goBack();
            route?.params?.onReturn(item);
          
          }}
          loader={loader}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  searchDialogContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: colors.white,
  },
  searchDialogSearchContainer: {
    paddingTop: 40,
    height: 100,
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
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
    marginLeft:12,
    flex:1,
    borderRadius: 48,
    borderColor: colors.card_shop_price_divider,
  },
});

export default SearchFishShopView;
