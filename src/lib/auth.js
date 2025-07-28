import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function getAuthStatus() {
    const cookiesStore = cookies();
    const token = cookiesStore.get('accessToken')?.value;

    if(!token){
        return null;
    }
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decoded; 

    }catch{
        return null
    }
}