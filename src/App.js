import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { persistStore } from "redux-persist";
import { PersistGate } from 'redux-persist/integration/react';
import { colors } from './css/colors';
import { AppTheme } from './css/theme';
import { navigationRef } from './navigation/RootNavigation';
import MapScreen from './screen/Map';
import MyStoreScreen from './screen/MyStore';
import ScanQRScreen from './screen/ScanQR';
import StoreDetailScreen from './screen/StoreDetail';
import FullImageFishScreen from './screen/StoreDetail/FullImageFish';
import { store } from './state/store';
import SearchFishShopView from './screen/Map/SearchFisShopView';

const Stack = createNativeStackNavigator();

const App = () => {

  let persistor = persistStore(store);
  const [initialScreen, setInitialScreen] = useState("Map");

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1, }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
          <SafeAreaProvider>
            <SafeAreaView style={[styles.backgroundStyle]}>
              <NavigationContainer theme={AppTheme} ref={navigationRef} initialScreen={initialScreen}  >
                <Stack.Navigator screenOptions={headerStyle}  >
                  <Stack.Screen name="Map" component={MapScreen} />
                  <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />
                  <Stack.Screen name="MyStore" component={MyStoreScreen} />
                  <Stack.Screen name="ScanQRScreen" component={ScanQRScreen} />
                  <Stack.Screen name="FullImage" component={FullImageFishScreen} />
                  <Stack.Screen name="SearchFishShop" component={SearchFishShopView} />
                </Stack.Navigator>
              </NavigationContainer>
            </SafeAreaView>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const headerStyle = {
  headerShown: false
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    color: colors.splash_bg_color,
  },
});

export default App;
