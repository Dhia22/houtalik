import React, { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import ImageComponent from "../components/ImageComponent";
import { colors } from "../css/colors";

const SearchView = ({
  text = "",
  searchContainerStyle,
  showHint,
  hint,
  hintTextColor = "#000000",
  showLeftIcon,
  leftIcon,
  leftIconStyle,
  showRightIcon,
  onLeftIconClick,
  rightIcon,
  rightIconStyle,
  onRightIconClick,
  onSearchText,
  onFocusInput,
  showKeyboardOnFocus = false,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (showKeyboardOnFocus) {
      setTimeout(() => inputRef.current.focus(), 250);
    }
  }, []);

  return (
    <View style={[styles.container, searchContainerStyle]}>
      {showLeftIcon && (
        <TouchableOpacity
          onPress={() => {
            onLeftIconClick();
          }}
        >
          <ImageComponent
            resizeMode="contain"
            url={leftIcon}
            imgStyle={{
              height: 24,
              width: 32,
              marginStart: 8,
              marginEnd: 8,
            }}
          />
        </TouchableOpacity>
      )}
      <View style={[styles.textInput]} onTouchStart={() => onFocusInput()}>
        <TextInput
          ref={inputRef}
          value={text.toString()}
          placeholderTextColor={hintTextColor}
          placeholder={showHint ? hint : ""}
          style={[styles.textInput]}
          onChangeText={(text) => {
            onSearchText(text);
          }}
          numberOfLines={1}
          pointerEvents="none"
        />
      </View>
      {showRightIcon && (
        <TouchableOpacity
          onPress={() => {
            onRightIconClick();
          }}
        >
          <ImageComponent
            resizeMode="contain"
            url={rightIcon}
            imgStyle={{
              height: 24,
              width: 32,
              marginStart: 8,
              marginEnd: 8,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    width: "100%",
    flexDirection: "row",
    height: 48,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  textInput: {
    flex: 1,
    paddingHorizontal:8,
    writingDirection: "ltr",
    color: colors.shop_name,
  },
});
export default SearchView;
