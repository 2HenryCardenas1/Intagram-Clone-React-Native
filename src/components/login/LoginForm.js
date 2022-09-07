import { Alert, View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Validator from 'email-validator'
import {firebase} from '../../../firebase'

const loginFormSchema = Yup.object().shape({
    user: Yup.string().email().required('Email is required'),
    password: Yup.string().required().min(8, 'Password must be at least 8 characters'),
})

export default function LoginForm({ navigation }) {

    const onLogin = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
            console.log('🔥 Firebase login success ✅', email, password)
        } catch (error) {
            Alert.alert('Sorry !😔', error.message + '\n\n What would you like to do next?',
                [
                    {
                        text: 'Try again',
                        onPress: () => console.log('Try again pressed'),
                        style: 'cancel'
                    },
                    {
                        text: 'Sign up',
                        onPress: () => navigation.push('SignupScreen')
                    }
                ])

            console.log('🔥 Firebase login error ❌', error)
        }
    }




    return (
        <View style={styles.wrapper}>
            <Formik
                initialValues={{ user: '', password: '' }}
                onSubmit={(values) => {
                    onLogin(values.user, values.password)
                }}
                validationSchema={loginFormSchema}
                validateOnMount={true}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
                    <>
                        <View style={[styles.inputField,
                        { borderColor: values.user.length < 1 || Validator.validate(values.user) ? '#ccc' : 'red', }
                        ]}>
                            <TextInput
                                placeholder='Phone number, username, or email'
                                placeholderTextColor='#444'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                textContentType='emailAddress'
                                autoFocus={true}

                                onChangeText={handleChange('user')}
                                onBlur={handleBlur('user')}
                                value={values.user}
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
                                value={values.password}
                            />

                        </View>
                        <View style={{ alignItems: 'flex-end', marginBottom: 30 }}>
                            <Text style={{ color: '#6BB0F5' }}>Forgot password?</Text>
                        </View>
                        <Pressable style={styles.button(isValid)} onPress={handleSubmit} disabled={!isValid}>
                            <Text style={styles.buttonText}>Login</Text>
                        </Pressable>

                        <View style={styles.signupContainer}>
                            <Text>Don't have an acount?</Text>
                            <TouchableOpacity onPress={() => navigation.push('SignupScreen')}>
                                <Text style={{ color: '#6BB0F5' }}> Sign up</Text>
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
    }),
    buttonText: {
        fontWeight: '600',
        color: '#fff',
        fontSize: 20
    },
    signupContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 50
    }
})