import React, { useLayoutEffect, useState, useEffect } from 'react'
import { StyleSheet, ScrollView, SafeAreaView, View, TouchableOpacity } from 'react-native'
import CustomListItem from '../components/CustomListItem'
import { Avatar } from "react-native-elements";
import { auth, db } from "../firebase"
import { AntDesign, SimpleLineIcons } from "react-native-vector-icons"


const HomeScreen = ({ navigation }) => {
    const [chats, setChats] = useState([])

    const signOut = () => {
        auth.signOut().then(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
        })
    }

    useEffect(() => {
      const unsubscribe = db.collection('chats').onSnapshot(snapshot => (
          setChats(snapshot.docs.map(doc => ({
              id: doc.id,
              data: doc.data()
          })))
      ))

      return unsubscribe
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Signum',
            headerStyle: {backgroundColor: "white"},
            headerTitleStyle: {color: "black"},
            headerLeft: () => (
                <View style={styles.headerLeftStyle}>
                    <TouchableOpacity onPress={signOut}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }}/>
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style= {styles.headerRightStyle}>
                    <TouchableOpacity>
                        <AntDesign name="camerao" size={24} color="black"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("AddChat")}>
                        <SimpleLineIcons name="pencil" size={24} color="black"/>
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", {
            id, 
            chatName
        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({id, data: {chatName}}) => (
                    <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat}/>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: "100%"
    },
    headerRightStyle:{
        flexDirection: "row",
        justifyContent: 'space-between',
        width: 80,
        marginRight: 20
    },
    headerLeftStyle: {
        marginLeft: 20 
    }
})
