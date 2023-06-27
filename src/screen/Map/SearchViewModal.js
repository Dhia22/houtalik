import NetInfo from "@react-native-community/netinfo";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import SearchView from "../../appcomponents/SearchView";
import Card from "../../components/Card/Card";
import { colors } from "../../css/colors";
import BackIcon from "../../../images/ic_back.svg";
import { isShop, showNoInternet } from "../../utils/AppUtils";
import * as service from "../../utils/apis/services";
import SearchedList from "../Map/SearchedList";
import axios from "axios";

const SearchViewModal = ({
  navigation,
  showSearchDialog,
  onClose,
  onShopFishClick,
}) => {

  const [searchedData, setSearchedList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showDefaultPlaceholder, setShowDefaultPlaceholder] = useState(false);
  let cancelSource = axios.CancelToken.source();

  function onLeftIconClicked() {}

function debounce(fn, delay) {
    let timer;
    return function () {
      let context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    };
  }

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
    cancelSource = axios.CancelToken.source();
  }

  const delaySaveToDb = useCallback(debounce((val)=>{
    searchFish(val)
  }
, 300), []);

  async function searchFishAndShopApi(query) {
    setLoader(true);
    cancelToken();
    const result = await service.searchFishAndShop(cancelSource, query);
    cancelSource = null;
    if (result != null) {
      let filteredList = [];
      result.map((item) => {
        filteredList.push(item);
      });
      setSearchedList(filteredList);
      setLoader(false);
    } else {
      setLoader(false);
      setSearchedList([]);
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      presentationStyle="pageSheet"
      visible={showSearchDialog}
      onRequestClose={() => {
        onClose();
      }}
    >

      <View style={styles.searchDialogContainer}>
      <BackIcon
              width={20}
              height={20}
              onPress={() => {
                  
              }}
            />
        <Card style={styles.searchDialogSearchContainer}>
          <SearchView
            searchContainerStyle={styles.searchDialogSearchContainerStyle}
            showLeftIcon={true}
            showHint={true}
            hintTextColor={colors.search_hint}
            hint={""}
            showKeyboardOnFocus={true}
            leftIcon={require("../../../images/search.png")}
            onLeftIconClick={onLeftIconClicked}
            onSearchText={(text) => {
             if (text.trim() != "") {
                  setShowDefaultPlaceholder(true);
                  delaySaveToDb(text);
              } else {
                setSearchedList([]);
              }
            }}
            onFocusInput={() => {}}
          />
        </Card>
        <SearchedList
          items={loader ? [] : searchedData}
          showDefaultPlaceholder={false}
          onItemClick={(item) => {
            onShopFishClick(item);
          }}
          loader={loader}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  searchDialogContainer: {
    position: "absolute",
    width: "100%",
    flexDirection:'row',
    height: "100%",
    backgroundColor: colors.white,
  },
  searchDialogSearchContainer: {
    paddingTop: 40,
    height: 100,
    flex:1,
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
});

export default SearchViewModal;
