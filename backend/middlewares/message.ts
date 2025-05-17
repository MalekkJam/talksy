import { AuthenticatedWebSocket } from "../models/Websocket.ts"
import { jwtVerify } from "npm:jose@5.9.6/jwt/verify";
import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {find_userId_by_username} from"../models/User.ts" 
import { addMessage, getMessageId, Message } from "../models/Message.ts";
import { get_chatID_by_chatName } from "../models/Chat.ts";
import { setReaction } from "../models/MessageReactions.ts";

const secret = new TextEncoder().encode("ed5a207a8e88013ab968eaf43d0017507508e5efa2129248b713a223eaf66864");


export const _addMessage = async (socket : AuthenticatedWebSocket ,message : string,chat : string ) => {
    
    try{
        const userID = await find_userId_by_username(socket.username); 
        const chat_id = await get_chatID_by_chatName(chat)  ; 
        const _message: Message = {
            chat_id: Number(chat_id), 
            sender_id: Number(userID),
            content: message,
            timestamp: new Date()
        };

        await addMessage(_message) 

    }
    catch(error) {
        console.log("Error while adding the message to the database", error)
    }
} 

export const addReaction = async(authSocket : AuthenticatedWebSocket , message : string , reaction : string, conversation : string) => {
    
    try {
        
        const username = authSocket.username ; 
        // get the user_id 
        const user_id = await find_userId_by_username(username) ; 

        // get the chat_id 
        const chat_id = await get_chatID_by_chatName(conversation) ; 
        // get the message id 

        const message_id = await getMessageId(chat_id,"1",message) ; 

        // set the emoji 
        await setReaction(message_id,user_id,reaction)        
    }catch(error) {
        throw error 
    }
    
}