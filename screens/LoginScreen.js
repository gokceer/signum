import React, {useState, useEffect} from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { auth } from "../firebase"

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home")
      }
    })
    return unsubscribe
  }, [])

  const signIn = () =>{
    auth.signInWithEmailAndPassword(email, password).catch(err => alert(err))
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png",
        }}
        style={styles.imgStyle}
      />
      <View style={styles.inputContainer}>
        <Input 
          placeholder="Email" 
          type="email" 
          value={email} 
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          autoFocus/>
        <Input 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChangeText={(text) => setPassword(text)} 
          secureTextEntry
          autoCapitalize="none"
          />
      </View>
  
      <Button containerStyle={styles.button} title="Login" onPress={signIn}/>
      <Button containerStyle={styles.button} title="Register" type="outline" onPress={() => navigation.navigate("Register")}/>
      <View style={{ height: 100 }}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  inputContainer: {
    width: 300
  },
  button:{
    width: 200,
    marginTop: 10
  },
  imgStyle: {
    width: 200, 
    height: 200
  }
});

export default LoginScreen;

