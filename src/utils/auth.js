import { getUser } from "./firebase/user"

export const getAuthorizedUser = async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || !user.id) {
        return {}
    }
    return await getUser(user.id).then(data=>{
        if (!data || data.password !== user.password) {
            localStorage.removeItem("user")
            return {}
        } else {
            localStorage.setItem("user", JSON.stringify(data))
            return data
        }
    })
}