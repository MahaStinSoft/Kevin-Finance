OpenMenu=(navigation)=>{
    navigation.openDrawer();
    }
   export default function Header({navigation,title}) {
         return (
     <View  style={styles.container}>
   <MaterialIcons name="menu" size={28} onPress={()=> this.OpenMenu(navigation)} style={styles.icon}/> 
            <View  style={styles.header}>
          <View style={{alignItems:'center'}}>
          <Text style={styles.headerText}> {title} </Text>
          </View>
          </View>
         </View>  );}