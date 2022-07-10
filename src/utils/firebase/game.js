import { collection, doc, getDoc, limit, orderBy, query, setDoc, where, getDocs } from 'firebase/firestore'
import md5 from 'md5'
import { db } from '../../lib/firebase'

export const getHistory = async (uid) => {
    try {
        const historyRef = collection(db, "history")
        const historyQuery = query(historyRef, where('uid', '==', uid), orderBy('startTime', 'desc'), limit(10))
        const historySnap = await getDocs(historyQuery)
        return historySnap.docs.map(doc => doc.data())
    } catch (err) {
        console.log(err)
        return undefined
    }
}

export const addHistory = async (game) => {
    try {
        const historyRef = doc(db, "history", game.uid + game.startTime)
        await setDoc(historyRef, game)
    } catch (err) {
        console.log(err)
    }
}

export const getStatistic = async (uid, level) => {
    try {
        const statRef = doc(db, "stat", md5(uid + level))
        const statSnap = await getDoc(statRef)
        if (statSnap.exists()) {
            return statSnap.data()
        } else {
            return undefined
        }
    } catch (err) {
        console.log(err)
        return err
    }
}

export const getRanking = async (level) => {
    try {
        const statRef = collection(db, "stat")
        const statQuery = query(statRef, where('level', '==', level), where('totalWin', '!=', 0), orderBy('totalWin', 'desc'), orderBy('totalTime', 'asc'), limit(10))
        const statSnap = await getDocs(statQuery)
        return statSnap.docs.map(doc => doc.data())
    } catch (err) {
        console.log(err)
        return undefined
    }
}

export const setStatistic = async (stat) => {
    try {
        const statRef = doc(db, "stat", md5(stat.uid + stat.level))
        await setDoc(statRef, stat)
    } catch (err) {
        console.log(err)
    }
}