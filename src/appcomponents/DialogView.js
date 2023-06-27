import React, { useContext } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { colors } from "../css/colors";
import Card from "../components/Card/Card";
import TextComponent from "../components/TextComponent";
import { LocalizationContext } from "../locale/LocalizationContext";
import { Style } from "../css/styles";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const DialogView = ({ visible = false, message, onCancel, onValidate, }) => {

    const { translations } = useContext(LocalizationContext);

    return (
        <Modal
            visible={visible}
            transparent={true}>
            <View style={styles.centeredView}>
                <View style={[{ width: '86%', padding: 16, marginTop: '20%' }]}>
                    <Card style={[styles.card]}>
                        <AntDesign name="closecircle" size={24} color={colors.hello_color}
                            style={[styles.closeIcon]}
                            onPress={onCancel} />

                        <TextComponent
                            noOfLine={8}
                            text={message}
                            textStyle={[styles.message, Style.text22Style, Style.boldTextStyle]}
                        />
                        <Pressable onPress={(event) => {
                            onValidate();
                        }}>
                            <View style={[styles.addProductContainer]}>
                                <TextComponent
                                    text={translations.validate}
                                    textStyle={[Style.boldTextStyle, Style.text16Style, styles.validButton]}
                                />
                            </View>
                        </Pressable>
                        <Pressable onPress={(event) => {
                            onCancel();
                        }}>
                            <View style={[styles.addWholeListContainer]}>
                                <TextComponent
                                    text={translations.annuler}
                                    textStyle={[Style.boldTextStyle, Style.text16Style, styles.confirmerButton]}
                                />
                            </View>
                        </Pressable>
                    </Card >
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: colors.bg_dialog_color,
        alignItems: "center",
    },
    card: {
        marginTop: '30%',
        alignItems: 'center',
    },
    closeIcon: {
        position: 'absolute',
        right: 4,
        zIndex: 1,
        marginTop: 4,
    },
    addProductContainer: {
        backgroundColor: colors.home_top_bg_color,
        borderRadius: 8,
        paddingVertical: 16,
        color: colors.white,
        marginTop: 12,
        marginHorizontal: 16,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    validButton: {
        color: colors.home_username_color,
    },
    confirmerButton: {
        color: colors.white,
    },
    addWholeListContainer: {
        backgroundColor: colors.home_username_color,
        borderRadius: 8,
        paddingVertical: 16,
        color: colors.white,
        marginTop: 6,
        marginHorizontal: 16,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        marginTop: 32,
        marginHorizontal: 16,
        marginBottom: 12,
        color: colors.hello_color,
        alignSelf: 'center',
        textAlign: 'center',
    },
});

export default DialogView;