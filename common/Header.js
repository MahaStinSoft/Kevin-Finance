// // HeaderComponent.js
// import React from 'react';
// import { TouchableOpacity, Text, View, StyleSheet, StatusBar } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { textColor } from '../Screen/constant/color';

// const HeaderComponent = (props) => {
//   const { onPress, titleText, onIconPress } = props;

//   return (
//     <>
//     <StatusBar/>
//     <View style={styles.headercontainer}>
//       <TouchableOpacity style={styles.iconButton} onPress={onPress}>
//         <Ionicons name="chevron-back" size={40} color="#fff" />
//       </TouchableOpacity>
//       <Text style={styles.accountText}>{titleText}</Text>
//     </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   headercontainer: {
//     flexDirection: 'row',
//     backgroundColor: 'red',
//   },
//   iconButton: {
//     marginRight: 16,
//   },
//   accountText: {
//     flex: 1,
//     textAlign: 'center',
//     color: textColor,
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 10,
//     marginRight: 50,
//   },
// });

// export default HeaderComponent;


// HeaderComponent.js
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { textColor } from '../Screen/constant/color';

const HeaderComponent = (props) => {
  const { onPress, titleText, onIconPress, screenIcon } = props;

  return (
    <>
      <StatusBar />
      <View style={styles.headercontainer}>
        <TouchableOpacity style={styles.iconButton} onPress={onPress}>
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.accountText}>{titleText}</Text>

        {onIconPress && (
          <TouchableOpacity style={styles.iconButton} onPress={onIconPress}>
            <Ionicons name={screenIcon} size={30} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headercontainer: {
    flexDirection: 'row',
    backgroundColor: 'red',
    height: 40
  },
  iconButton: {
    marginRight: 16,
    // marginTop: 15
  },
  accountText: {
    flex: 1,
    textAlign: 'center',
    color: textColor,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginRight: 50,
  },
});

export default HeaderComponent;
