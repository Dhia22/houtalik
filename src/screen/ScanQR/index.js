import NetInfo from "@react-native-community/netinfo";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { useDispatch, useSelector } from "react-redux";
import ProgressDialogView from "../../appcomponents/ProgressDialogView";
import { colors } from "../../css/colors";
import { LocalizationContext } from "../../locale/LocalizationContext";
import { saveUser } from "../../state/slices/authenticationSlice";
import * as service from '../../utils/apis/services';
import { showApiError, showMessageDialog, showMessageDialogWithCallback, showNoInternet } from "../../utils/AppUtils";
import { isEmailValid, isNullOrEmpty } from "../../validators/EmailValidator";

const ScanQRScreen = ({ navigation }) => {

  const { translations } = useContext(LocalizationContext);
  const [progress, setProgressBar] = useState(false);
  const authentication = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  function onSuccess(e) {
    try {
      let scannedData = e.data;
      if (isNullOrEmpty(scannedData)) {
        showMessageDialog(translations, translations.error, translations.invalid_qr_code);
      } else if (isEmailValid(scannedData)) {
        showMessageDialog(translations, translations.error, translations.invalid_qr_code);
      } else {
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            scanQRDetail(scannedData);
          } else {
            showNoInternet(translations);
          }
        });
      }
    } catch (e) {
      showMessageDialog(translations, translations.error, translations.invalid_qr_code);
    }
  }

  async function scanQRDetail(data) {
    setProgressBar(true);
    const result = await service.scanQRDetail(translations, data);
    setProgressBar(false);
    if (result != null) {
      if (result.token && result.token != "") {
        dispatch(saveUser(result));
        navigation.replace("MyStore");
      } else {
        showMessageDialogWithCallback(translations, translations.error, result.message, onPress = () => {
          navigation.goBack();
        });
      }
    } else {
      showApiError(translations);
    }
  }

  return (<View style={{
    flex: 1,
    backgroundColor: colors.black
  }}>
    <QRCodeScanner
      style={{
        flex: 1
      }}
      checkAndroid6Permissions={true}
      showMarker={true}
      customMarker={(<View style={{
        borderColor: colors.price,
        height: Dimensions.get('window').width - 100,
        width: Dimensions.get('window').width - 100,
        borderWidth: 1,
        backgroundColor: colors.transparent,
        borderRadius: 12,
      }}></View>)}
      permissionDialogTitle={"Camera Permission"}
      permissionDialogMessage={"Camera Permission required to scan qr code"}
      onRead={onSuccess}
    />
    <ProgressDialogView visible={progress} />
  </View>
  );
}

const styles = StyleSheet.create({

});

export default ScanQRScreen;