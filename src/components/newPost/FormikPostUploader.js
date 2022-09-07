import { View, Text, StyleSheet, Image, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Divider } from 'react-native-elements'
import validUrl from 'valid-url'
const PLACEHOLDER_IMG = 'http://www.persefone.it/blog/wp-content/themes/photobook/images/blank.png'
import { db, firebase } from '../../../firebase'


const uploadPostSchema = Yup.object().shape({
    imageUrl: Yup.string().url().required('A URL is required'),
    caption: Yup.string().max(2200, 'Caption must be less than 2200 characters').required('A caption is required'),

})


export default function FormikPostUploader({ navigation }) {
    const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMG)
    const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)

    const getUsername = () => {
        const user = firebase.auth().currentUser
        const unsubscribe = db.collection('users')
            .where('owner_uid', '==', user.uid).limit(1)
            .onSnapshot(snapshot => snapshot.docs.map(doc => {
                setCurrentLoggedInUser(
                    {
                        username: doc.data().username,
                        profilePicture: doc.data().profile_picture

                    })
            }))
        return unsubscribe
    }

    useEffect(() => {
        getUsername()
    }, [])

    //Upload the post to the database FIREBASE
    const uploadPostToFirebase = (imageUrl, caption) => {
        const unsubscribe = db.collection('users')
            .doc(firebase.auth().currentUser.email)
            .collection('posts')
            .add({
                imageUrl: imageUrl,
                username: currentLoggedInUser.username,
                profile_picture: currentLoggedInUser.profilePicture,
                owner_uid: firebase.auth().currentUser.uid,
                owner_email: firebase.auth().currentUser.email,
                caption: caption,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                likes_by_users: [],
                comments: []
            })
            .then(() => { navigation.goBack() })
    }
    return (
        /* 
        validareOnMount=true es para que active el boton unicamente cuando
        los campos esten completados */
        <Formik
            initialValues={{ caption: '', imageUrl: '' }}
            onSubmit={
                (values) => { uploadPostToFirebase(values.imageUrl, values.caption) }}

            validationSchema={uploadPostSchema}
            validateOnMount={true}
        >
            {/* Estos valores los trae el formik y 
                pueden ser manejados mediante una funcion  */}
            {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
                <>
                    <View style={{
                        margin: 20,
                        justifyContent: 'space-between',
                        flexDirection: 'row'
                    }}>
                        <Image
                            source={{ uri: validUrl.isUri(imageUrl) ? imageUrl : PLACEHOLDER_IMG }}
                            style={{ width: 100, height: 100 }} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <TextInput
                                style={{ color: 'white', fontSize: 20 }}
                                placeholder='Write a caption...'
                                placeholderTextColor='gray'
                                multiline={true}
                                onChangeText={handleChange('caption')}
                                onBlur={handleBlur('caption')}
                                value={values.caption}
                            />
                            {/*errors.caption && (
                                <Text style={{ fontSize: 10, color: 'red' }}>{errors.caption}</Text>
                            )*/}

                        </View>

                    </View>
                    <Divider width={0.2} orientation='vertical' />
                    <TextInput
                        onChange={(img) => setImageUrl(img.nativeEvent.text)}
                        style={{ color: 'white', fontSize: 18 }}
                        placeholder='Enter Image Url'
                        placeholderTextColor='gray'
                        onChangeText={handleChange('imageUrl')}
                        onBlur={handleBlur('imageUrl')}
                        value={values.imageUrl}
                    />
                    {errors.imageUrl && (
                        <Text style={{ fontSize: 10, color: 'red' }}>{errors.imageUrl}</Text>
                    )}

                    <Button onPress={handleSubmit} title='Share' disabled={!isValid} />
                </>
            )}

        </Formik>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5
    }
})