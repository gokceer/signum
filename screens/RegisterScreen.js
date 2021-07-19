import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements"
import * as constants from "../constants";
import { auth } from "../firebase"

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const register = () => {
    auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: imageUrl ? imageUrl : constants.ANONYMOUS_URL
            })
        })
        .catch((err) => alert(err.message))
  }

  return (
    <View style= {styles.container}>
      <Text h3 style={styles.txtStyle}>
        Create a Signum Account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
          autoFocus
        />
        <Input 
          placeholder="Email" 
          type="email" 
          value={email} 
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          autoCapitalize="none"
        />
        <Input
          placeholder="Profile Picture URL (optional)"
          type="text"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={register}
          autoCapitalize="none"
        />
      </View>
      <Button containerStyle={styles.button} raised title="Register" onPress={register}/>
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
    button: {
        width: 200,
        marginTop: 10
    },
    txtStyle:{
      marginBottom: 50
    }
});

export default RegisterScreen;
