import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

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
        return err
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