import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import md5 from "md5"

import { db, auth } from '../../lib/firebase'

export const googleLogin = async () => {
    const provider = new GoogleAuthProvider()
    return await signInWithPopup(auth, provider).then((result) => {
        // The signed-in user info.
        const guser = result.user;
        let user = {
            id: md5(guser.uid),
            username: guser.displayName,
            email: guser.email,
            isGoogleAccount: true
        }
        return getUser(user.id).then((result)=>{
            if (result){
                return result
            } else {
                setUser(user)
                return user
            }
        })
    }).catch((error) => {
        console.log(error)
        return undefined
    });
}

export const getUser = async (uid) => {
    try {
        const userRef = doc(db, "user", uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
            return userSnap.data()
        } else {
            return undefined
        }
    } catch (err) {
        console.log(err)
        return undefined
    }
}

export const getAllUser = async () => {
    try {
        const userRef = collection(db, "user")
        const userSnap = await getDocs(userRef)
        return userSnap.docs.map(data => {
            const { password, ...newData } = data.data()
            return newData
        })
    } catch (err) {
        console.log(err)
        return []
    }
}

export const setUser = async (user) => {
    try {
        const userRef = doc(db, "user", user.id)
        await setDoc(userRef, user)
    } catch (err) {
        console.log(err)
    }
}