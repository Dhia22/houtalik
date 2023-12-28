import React from 'react';
import { View, StyleSheet } from 'react-native';
const Card = props => {
    return (
        <View style={{ ...styles.card, ...props.style }}
        >{props.children}</View>
    );
};
const styles = StyleSheet.create({
    card: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        height: 48,
        shadowRadius: 12,
        shadowOpacity: 0.26,
        elevation: 8,
        backgroundColor: 'white',
        overflow: 'hidden',
        borderRadius: 24
    }
});
export default Card;