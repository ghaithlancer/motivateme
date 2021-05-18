/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import firebase from '../firebase'


const AuthContext = React.createContext();


export function useAuth() {
    return useContext(AuthContext)
}


export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [uname, setUname] = useState()
    const [pp, setPp] = useState()
    // const timestamp = firebase.firestore.Timestamp.now()
    // const newUserPP = firebase.storage().ref('images/avatar.png').getDownloadURL()


    async function userComment(comment, postID){
        await firebase.firestore().collection('posts').doc(postID).update(
            'comments', firebase.firestore.FieldValue.arrayUnion({
                uname,
                comment,
                timestamp: firebase.firestore.Timestamp.now(),
            })
        )
        return
    }

    async function userPost(post){
        await firebase.firestore().collection('posts').doc().set({
            pp,
            uname,
            post,
            timestamp: firebase.firestore.Timestamp.now(),
        })
        return
    }

    async function updatePP(file){
        const storageRef = firebase.storage().ref('images')
        const fileRef = storageRef.child(currentUser.uid + '-' + file.name + '-profilepicture')
        await fileRef.put(file)
        await fileRef.getDownloadURL()
        .then((url) => {
            firebase.firestore().collection('users').doc(currentUser.uid).update({
                pp: url 
            })
        })   
    }

    function updateFname(fname){
        return firebase.firestore().collection('users').doc(currentUser.uid).update({
            fname
        })
    }

    function updateLname(lname){
        return firebase.firestore().collection('users').doc(currentUser.uid).update({
            lname
        })
    }

    function updateUname(uname){
        return firebase.firestore().collection('users').doc(currentUser.uid).update({
            uname
        })
    }
    

    function signup(email, password, fname, lname, uname) {
        return firebase.auth().createUserWithEmailAndPassword(email, password).then( usr => {firebase.firestore().collection('users').doc(usr.user.uid).set({
            uname,
            fname, 
            lname, 
            email,
            pp: firebase.storage().ref('images/avatar.png').getDownloadURL()
        })})
    }

    function login(email, password) {
       return firebase.auth().signInWithEmailAndPassword(email, password)
    }

    function logout(){
        return firebase.auth().signOut()
    }

    function resetPass(email){
        return firebase.auth().sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
        .then(() => {
            firebase.firestore().collection('users').doc(currentUser.uid).update({
                email
            })
        })
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user)
            // console.log(user.uid)
            firebase.firestore().collection('users').doc(user.uid).get()
            .then((query) => {
                setUname(query.data().uname)
                setPp(query.data().pp) 
            })
            setLoading(false)
        })
        
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        uname,
        pp,
        signup,
        login,
        logout,
        resetPass,
        updateEmail,
        updatePassword,
        userPost,
        updatePP,
        updateFname,
        updateLname,
        updateUname,
        userComment,
    }
    
    return (
        <AuthContext.Provider value={value}>
            { !loading && children }
        </AuthContext.Provider>
    )
}
