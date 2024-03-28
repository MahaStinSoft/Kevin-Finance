import React from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet } from 'react-native';
const CustomAlert = ({ visible, onClose, message, headerMessage ,style, modalHeaderStyle, textStyle, onConfirm, Button1, Button2  }) => {
  if (!visible) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={[styles.centeredView, ]}>
                <View style={[styles.modalView, style]}>
                    <Text style={[styles.modalHeaderText, modalHeaderStyle]}>{headerMessage}</Text>
                    <Text style={[styles.modalText, textStyle]}>{message}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: 'red', left: 20 }}
                            onPress={onClose}>
                            <Text style={styles.textStyle}>{Button1}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: 'red', left: 60 }}
                            onPress={onConfirm}>
                            <Text style={styles.textStyle}>{Button2}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        width: "75%",
        height: "20%"
    },
    modalHeaderText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "red",
        right: 100,
        marginBottom: 15
    },
    modalText: {
        marginBottom: 15,
        // textAlign: 'center',
        fontSize: 16
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        width: "30%",
        height: 30,
        marginTop: 10,
        borderRadius: 50
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: -5
    },
});
export default CustomAlert;