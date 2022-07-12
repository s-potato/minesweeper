import { getUser } from "./firebase/user"

export const getAuthorizedUser = async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || !user.id) {
        return {}
    }
    return await getUser(user.id).then(data=>{
        if (!data || data.password !== user.password || data.isBlocked) {
            localStorage.removeItem("user")
            if (data.isBlocked)
                return {isBlocked: true}
            return {}
        } else {
            localStorage.setItem("user", JSON.stringify(data))
            return data
        }
    })
}