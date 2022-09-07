import React, { useEffect, useState } from 'react'
import { SignedInStack, SignedOutStack } from '../navigations/Navigation'
import {firebase} from '../../firebase'
const AuthNavigation = () => {
    //To check if user is signed in or not
    const [currentUser, setCurrentUser] = useState(null)

    //To set the current user
    const userHandler = user => user ? setCurrentUser(user) : setCurrentUser(null)

    useEffect(
        () =>
            firebase.auth().onAuthStateChanged(user => { userHandler(user) })
        , [])

    return (
        <>{currentUser ? <SignedInStack /> : <SignedOutStack />}</>
    )
}

export default AuthNavigation