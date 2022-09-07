import { Alert,View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Validator from 'email-validator'
import { firebase, db } from '../../../firebase'




export default function SignupForm({ navigation }) {

    const signupFormSchema = Yup.object().shape({
        email: Yup.string().email().required('Email is required'),
        username: Yup.string().required().min(2, 'Username is required'),
        password: Yup.string().required().min(8, 'Password must be at least 8 characters'),

    })

    const getRandomProfilePicture = async () => {
        const response = await fetch('https://randomuser.me/api/')
        const data = await response.json()
        return data.results[0].picture.large
    }

    const onSignup = async (email, password, username) => {
        try {
            const authUser = await firebase.auth().createUserWithEmailAndPassword(email, password)
            console.log('🔥 Firebase user created successfully ✅', email, password)

            db.collection('users')
            .doc(authUser.user.email)
            .set({
                owner_uid: authUser.user.uid,
                username: username,
                email: authUser.user.email,
                profile_picture: await getRandomProfilePicture(),
            })

            
        } catch (error) {
            Alert.alert(error.message)

            console.log('🔥 Firebase  error ❌', error)
        }
    }



    return (
        <View style={styles.wrapper}>
            <Formik
                initialValues={{ email: '', username: '', password: '' }}
                onSubmit={(values) => { onSignup(values.email, values.password, values.username) }}
                validationSchema={signupFormSchema}
                validateOnMount={true}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
                    <>
                        <View style={[styles.inputField,
                        { borderColor: values.email.length < 1 || Validator.validate(values.email) ? '#ccc' : 'red' }
                        ]}>
                            <TextInput
                                placeholder='Email'
                                placeholderTextColor='#444'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                textContentType='emailAddress'
                                autoFocus={true}

                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                            />


                        </View>
                        <View style={[styles.inputField,
                        { borderColor: values.username.length < 1 || values.username.length >= 2 ? '#ccc' : 'red' }
                        ]}>
                            <TextInput
                                placeholder='Username'
                                placeholderTextColor='#444'
                                autoCapitalize='none'
                                textContentType='username'

                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                value={values.username}
                            />


                        </View>
                        <View style={[styles.inputField,
                        { borderColor: values.password.length < 1 || values.password.length >= 8 ? '#ccc' : 'red', }
                        ]}>
                            <TextInput
                                placeholder='Password'
                                placeholderTextColor='#444'
                                autoCapitalize='none'
                                autoCorrect={false}
                                textContentType='password'
                                secureTextEntry={true}

                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                            />

                        </View>

                        <Pressable style={styles.button(isValid)} onPress={handleSubmit} disabled={!isValid}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </Pressable>

                        <View style={styles.loginContainer}>
                            <Text>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={{ color: '#6BB0F5' }}> Log in</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 60,

    },
    inputField: {
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#FAFAFA',
        marginBottom: 10,
        borderWidth: 1,

    },
    button: isValid => ({
        backgroundColor: isValid ? '#0096F6' : '#9ACAF7',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        borderRadius: 5,
        marginTop: 50
    }),
    buttonText: {
        fontWeight: '600',
        color: '#fff',
        fontSize: 20
    },
    loginContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 30
    }
})