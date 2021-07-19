import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button } from "react-native-elements";
import { AntDesign, SimpleLineIcons } from "react-native-vector-icons"
import { db } from "../firebase"

const AddChatScreen = ({ navigation }) => {
    const [input, setInput] = useState("")

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add a New Chat"
        })
    }, [navigation])

    const createChat = async () => {
        await db.collection('chats')
        .add({
            chatName: input
        })
        .then(() => navigation.goBack())
        .catch((err) => alert(err))
    }
    return (
        <View style={ styles.container }>
            <Input 
                placeholder="Enter a chat name"
                value={input}
                onChangeText={(text) => setInput(text)}
                leftIcon={
                    <AntDesign name="wechat" size={24} color="black"/>
                }
            />
            <Button 
                title="Create New Chat"
                disabled={!input}
                onPress={createChat}/>
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        padding: 30,
        height: "100%"
    }
})
