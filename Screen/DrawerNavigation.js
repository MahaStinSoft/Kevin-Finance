import React from "react";
import { View, StyleSheet } from "react-native";
import {
      Drawer,
      Text,
      TouchableRipple,
      Switch
} from 'react-native-paper';
import {
      DrawerContentScrollView,
      DrawerItem
} from '@react-navigation/drawer';

import { AuthContext } from "../components/Context"; 

export function DrawerContentNavigation(props) {

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const { signOut } = React.useContext(AuthContext);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  }

      return (
      <View style={{flex:1}}>
        <DrawerContentScrollView {...props}>
          <View style={styles.drawerContent}>
          <Drawer.Section style={styles.drawerSection}>
                <DrawerItem 
                  label="HomeScreen" 
                  onPress={() => {props.navigation.navigate('HomeScreen')}}
                />
                <DrawerItem  style={styles.item}
                  label="Account" 
                  onPress={() => {props.navigation.navigate('Account')}}
                />
               <DrawerItem style={styles.item}
               label="Loans" 
                 onPress={() => {props.navigation.navigate('Loans')}}
               />
                <DrawerItem style={styles.item}
                  label="Settings"
                  onPress={() => {props.navigation.navigate('Settings')}}
                />
              </Drawer.Section>
              <Drawer.Section title="Preferences">
                <TouchableRipple onPress={() => {toggleTheme()}}>
                  <View style={styles.preference}>
                    <Text>Dark Theme</Text>
                    <View pointerEvents="none" >
                    <Switch value={isDarkTheme} />
                    </View>
                  </View>
                </TouchableRipple>
              </Drawer.Section>
          </View>
        </DrawerContentScrollView>
        <Drawer.Section style={styles.bottomDrawerSection}>
          <DrawerItem
          label="Sign Out"
          onPress={() =>{signOut()}}
          />
        </Drawer.Section>
      </View>
      );
}

const styles = StyleSheet.create({
      drawerContent: {
        flex: 1,
      },
      userInfoSection: {
        paddingLeft: 20,
      },
      title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
      },
      caption: {
        fontSize: 14,
        lineHeight: 14,
      },
      item: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
      },
      row: {
        marginTop: 20,
        flexDirection: 'row',
      },
      section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
      },
      paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
      },
      drawerSection: {
        marginTop: 15,
        alignContent: 'center'    
      },
      bottomDrawerSection: {
          marginBottom: 15,
          borderTopColor: '#f4f4f4',
          borderTopWidth: 1
      },
      preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
      },
    });
  