import React, { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native";
import { Keyboard } from "react-native";
import { TextInput } from "react-native";
import { Platform } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, FontAwesome, Ionicons } from "react-native-vector-icons";
import { db, auth } from "../firebase";
import * as constants from "../constants";
import firebase from "firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleStyle}>
          <Avatar
            rounded
            source={{
              uri: messages[0]?.data.photoURL
            }}
          />
          <Text style={styles.headerTitleTxtStyle}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.headerRightStyle}>
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  useLayoutEffect(() => {
    const unsubscribe = db
    .collection('chats')
    .doc(route.params.id)
    .collection('messages')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => setMessages(
      snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }))
    )) //real time listener
    
    return unsubscribe
  }, [route])

  const sendMessage = () => {
    const { displayName, email, photoURL } = auth.currentUser;
    Keyboard.dismiss();
    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(), // For different timestamps by countries
      message: input,
      displayName,
      email,
      photoURL,
    });
    setInput("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView style={styles.contentContainerStyle}>
              {messages.map(({id, data}) => (
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      position="absolute"
                      bottom={-15}
                      right={-5}
                      rounded
                      size={30}
                      containerStyle={styles.contentContainerRight}
                      source={{
                        uri: data?.photoURL || constants.ANONYMOUS_URL
                      }}
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.receiver}>
                    <Avatar 
                      position="absolute"
                      bottom={-15}
                      left={-5}
                      rounded
                      size={30}
                      containerStyle={styles.contentContainerLeft}
                      source={{
                        uri: data?.photoURL || constants.ANONYMOUS_URL
                      }}
                    />
                    <Text style={styles.receiverText}>{data.message}</Text>
                    <Text style={styles.receiverName}>{data.displayName}</Text>
                  </View>
                )
              ))}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                style={styles.textInput}
                placeholder="Signum Message"
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage} // press enter from keyboard
              />
              <TouchableOpacity onPress={sendMessage}>
                <Ionicons name="send" size={24} color="#2C6BED" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingTop: 15
  },
  sender: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative"
  },
  senderText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10
  },
  receiver:{
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative"
  },
  receiverText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15
  },
  receiverName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white"
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  headerTitleStyle: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerTitleTxtStyle: {
    color: "white",
    marginLeft: 10,
    fontWeight: "700"
  },
  headerRightStyle:{
    flexDirection: "row",
    justifyContent: "space-between",
    width: 80,
    marginRight: 10
  },
  contentContainerRight:{
    position:"absolute",
    bottom:-15,
    right:-5
  },
  contentContainerLeft:{
    position:"absolute",
    bottom:-15,
    left:-5
  }
});
