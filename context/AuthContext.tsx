import React, {useContext, useEffect, useState, useRef} from 'react'
import {auth, db} from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import {doc, getDoc} from 'firebase/firestore'
import { CidrAuthorizationContext } from 'aws-sdk/clients/ec2'
import { createContext } from 'react'

const AuthContext = React.createContext(undefined)

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvier({children} : any){
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const userInfo = useRef()

    function signup(email: string, password: string){
        createUserWithEmailAndPassword(auth, email,password)
        return
    }

    function login(email: string, password: string){
        return signInWithEmailAndPassword(auth, email,password)
    }

    function logout(){
        return signOut(auth)
    }

    useEffect(()=> {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            setCurrentUser(user as any)
            setLoading(false)
        })

        return unsubscribe
    },[])

    const value = [
        currentUser,
        login,
        signup,
        logout,
        userInfo
    ]

    return (
        <AuthContext.provider value={value}>
            {!loading && children}
        </AuthContext.provider>
    )
}
