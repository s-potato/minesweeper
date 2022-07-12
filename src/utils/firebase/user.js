import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
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
        return undefined
    }
}

export const getAllUser = async () => {
    try {
        const userRef = collection(db, "user")
        const userSnap = await getDocs(userRef)
        return userSnap.docs.map(data => {
            const {password, ...newData} = data.data()
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