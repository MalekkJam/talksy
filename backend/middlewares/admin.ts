import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { jwtVerify } from "npm:jose@5.9.6/jwt/verify";
import { get_Nb_Conversations , get_All_chats , get_chat_participants , get_chatID_by_chatName, add_chat} from "../models/Chat.ts";
import { get_Nb_Users, get_all_users, get_Nb_new_users , find_userId_by_username} from "../models/User.ts";
import {kick_user_from_chat , get_users_not_in_chat, add_user_to_chat, delete_chat_with_participants , add_admin_to_new_chat} from "../models/ChatParticipant.ts"

const secret = new TextEncoder().encode("ed5a207a8e88013ab968eaf43d0017507508e5efa2129248b713a223eaf66864");

export const getKpis = async (ctx : Context) => {
    try {const token = await ctx.cookies.get("auth_token") ; 

    if (!token) {
        ctx.response.status = 401 ; 
        ctx.response.body = {message : "Not authorized"} ; 
        return ; 
    }

    const {payload} = await jwtVerify(token,secret) ; 
    const role = payload.role as string

    if (role != "admin") {
        ctx.response.status = 403 ; 
        ctx.response.body = {message : "Not authorized you are not the admin"} ; 
        return ; 
    }

    // Get the nbConversations 
    const nbConversations = await get_Nb_Conversations() ; 

    // Get the nbTotalUsers 
    const nbTotalUsers = await get_Nb_Users() ; 

    // Get the new users (users added today) 
    const nbNewUsers = await get_Nb_new_users() ; 

    const data = {nbConversations,nbTotalUsers,nbNewUsers} ; 

    ctx.response.status = 200 ; 
    ctx.response.body = data;}

    catch(error) {
        throw error ; 
    }

}

export const getAllUsers = async (ctx: Context) => {
    try {   
        const token = await ctx.cookies.get("auth_token") ; 

        if (!token) {
            ctx.response.status = 401 ; 
            ctx.response.body = {message : "Not authorized"} ; 
            return ; 
        }
    
        const {payload} = await jwtVerify(token,secret) ; 
        const role = payload.role as string
    
        if (role != "admin") {
            ctx.response.status = 403 ; 
            ctx.response.body = {message : "Not authorized you are not the admin"} ; 
            return ; 
        }

        const result = await get_all_users() ; 
        
        ctx.response.status =200 ;
        ctx.response.body = result ; 

    }catch(error) {
        throw error ; 
    }
}

export const getAllChats = async (ctx : Context) => {
    try {const token = await ctx.cookies.get("auth_token") ; 

    if (!token) {
        ctx.response.status = 401 ; 
        ctx.response.body = {message : "Not authorized"} ; 
        return ; 
    }

    const {payload} = await jwtVerify(token,secret) ; 
    const role = payload.role as string

    if (role != "admin") {
        ctx.response.status = 403 ; 
        ctx.response.body = {message : "Not authorized you are not the admin"} ; 
        return ; 
    }

    const result = await get_All_chats() ; 
    ctx.response.status =200 ;
    ctx.response.body = result ; }

    catch(error) {
        throw error ; 
    }

}   

export const getChatParticipants = async (ctx: Context) => {
    try {const token = await ctx.cookies.get("auth_token") ; 

        if (!token) {
            ctx.response.status = 401 ; 
            ctx.response.body = {message : "Not authorized"} ; 
            return ; 
        }
    
        const {payload} = await jwtVerify(token,secret) ; 
        const role = payload.role as string
    
        if (role != "admin") {
            ctx.response.status = 403 ; 
            ctx.response.body = {message : "Not authorized you are not the admin"} ; 
            return ; 
        }

        const body = await ctx.request.body().value;
        const { conversation_name } = body;


        const result = await get_chat_participants(conversation_name)  

        ctx.response.status = 200 
        ctx.response.body = result 
    }
    catch(error) {
        console.error("Error in the middlewware")
        throw(error)
    }
}

export const kickUserFromChat = async (ctx : Context) => {
    try {const token = await ctx.cookies.get("auth_token") ; 

        if (!token) {
            ctx.response.status = 401 ; 
            ctx.response.body = {message : "Not authorized"} ; 
            return ; 
        }
    
        const {payload} = await jwtVerify(token,secret) ; 
        const role = payload.role as string
    
        if (role != "admin") {
            ctx.response.status = 403 ; 
            ctx.response.body = {message : "Not authorized you are not the admin"} ; 
            return ; 
        }

        const {username , conversation_name} = await ctx.request.body().value;
        const conversation_id = await get_chatID_by_chatName(conversation_name) ; 
        const user_id = await find_userId_by_username(username) ; 
        await kick_user_from_chat(conversation_id,user_id) ; 
        
        ctx.response.status = 200 ; 
        ctx.response.body = {message : "User kicked out succefully"}
    }
    catch(error ) {
        throw error 
    }   

}

export const getAvailableParticipants = async (ctx: Context) => {
    try {const token = await ctx.cookies.get("auth_token") ; 

        if (!token) {
            ctx.response.status = 401 ; 
            ctx.response.body = {message : "Not authorized"} ; 
            return ; 
        }
    
        const {payload} = await jwtVerify(token,secret) ; 
        const role = payload.role as string
    
        if (role != "admin") {
            ctx.response.status = 403 ; 
            ctx.response.body = {message : "Not authorized you are not the admin"} ; 
            return ; 
        }

        const { conversation_name} = await ctx.request.body().value;

        const conversation_id = await get_chatID_by_chatName(conversation_name) ; 

        const result = await get_users_not_in_chat(conversation_id) ; 
        ctx.response.status = 200 ; 
        ctx.response.body = result
    }
    catch(error ) {
        throw error 
    }   
}

export const addUserToChat = async(ctx : Context) => {
    try {const token = await ctx.cookies.get("auth_token") ; 

        if (!token) {
            ctx.response.status = 401 ; 
            ctx.response.body = {message : "Not authorized"} ; 
            return ; 
        }
    
        const {payload} = await jwtVerify(token,secret) ; 
        const role = payload.role as string
    
        if (role != "admin") {
            ctx.response.status = 403 ; 
            ctx.response.body = {message : "Not authorized you are not the admin"} ; 
            return ; 
        }

        const { username , conversation_name} = await ctx.request.body().value;

        const conversation_id = await get_chatID_by_chatName(conversation_name) ; 
        const user_id = await find_userId_by_username(username) ; 

        await  add_user_to_chat(conversation_id, user_id) ; 
        ctx.response.status = 200 ; 
    }
    catch(error ) {
        throw error 
    }   
}

export const deleteConversation = async (ctx : Context) => {
    try {const token = await ctx.cookies.get("auth_token") ; 

        if (!token) {
            ctx.response.status = 401 ; 
            ctx.response.body = {message : "Not authorized"} ; 
            return ; 
        }
    
        const {payload} = await jwtVerify(token,secret) ; 
        const role = payload.role as string
    
        if (role != "admin") {
            ctx.response.status = 403 ; 
            ctx.response.body = {message : "Not authorized you are not the admin"} ; 
            return ; 
        }

        const { conversation_name} = await ctx.request.body().value;

        const chat_id = await get_chatID_by_chatName(conversation_name) ; 

        await delete_chat_with_participants(chat_id)

        ctx.response.status = 200 ; 
        ctx.response.body = {message : "Deletion completed ! "}
    }
    catch(error ) {
        throw error 
    }   
}

export const addNewConversation = async (ctx : Context) => {
    try {const token = await ctx.cookies.get("auth_token") ; 

        if (!token) {
            ctx.response.status = 401 ; 
            ctx.response.body = {message : "Not authorized"} ; 
            return ; 
        }
    
        const {payload} = await jwtVerify(token,secret) ; 
        const role = payload.role as string
    
        if (role != "admin") {
            ctx.response.status = 403 ; 
            ctx.response.body = {message : "Not authorized you are not the admin"} ; 
            return ; 
        }

        const { newChat_name  } = await ctx.request.body().value;

        try {
            await get_chatID_by_chatName(newChat_name)
            ctx.response.status = 401
            ctx.response.body = { message : "Chat name already exists find another one !"}
            return
        }
        catch(error) {
            // only the admin can create Groups 
            const result = await add_chat(newChat_name,"group") ; 
            const chat_id = await get_chatID_by_chatName(newChat_name)
            await add_admin_to_new_chat(chat_id) ; 
            ctx.response.status = 200 ; 
        }

        
    }
    catch(error ) {
        throw error 
    }
}

export const verifyAdminRole = async(ctx : Context) => {
    try {const token = await ctx.cookies.get("auth_token") ; 

        if (!token) {
            ctx.response.status = 401 ; 
            ctx.response.body = {message : "Not authorized"} ; 
            return ; 
        }
    
        const {payload} = await jwtVerify(token,secret) ; 
        const role = payload.role as string
    
        if (role != "admin") {
            ctx.response.status = 403 ; 
            ctx.response.body = {message : "Not authorized you are not the admin"} ; 
            return ; 
        }
        ctx.response.status = 200 
    }
    catch(error) {
        console.error("Error while verifying admin role")
        throw error 
    }
}


