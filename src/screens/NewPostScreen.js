import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import AddNewPost from '../components/newPost/AddNewPost'



export default function NewPostScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <AddNewPost navigation={navigation}/>        
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
    }
})