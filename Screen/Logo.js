import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Logo = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/applogo.png')}
                style={styles.logo}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,  
        height: 100,
        marginRight: -15
    },
    logo: {
        width: 140, 
        height: '100%', 
        resizeMode: "cover" 
    },
});

export default Logo;
