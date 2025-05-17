import db from "../config/database.ts";
import{get_chatID_by_chatName} from "./Chat.ts"

export interface Message {
    chat_id : number ;// foreign key
    sender_id : number;// foreign key
    content : string;
    timestamp : Date ; 
}

export const addMessage = async (message : Message) => {
    const query = `INSERT INTO Message (chat_id, sender_id, content,timestamp) VALUES (?,?,?,?)`;
    
    try {
        const result = await db.prepare(query).run(message.chat_id, message.sender_id, message.content, message.timestamp.toISOString());
        return result;
    } catch (error) {
        console.error("Error adding message:", error);
        throw error;
    }
}

export const getMessages = async(chat_id : string ) => {
    const query = "SELECT sender_id,content,timestamp  FROM Message WHERE chat_id =?" 

    try {
        const result = db.prepare(query).all(chat_id) as {sender_id : number, content : string, timestamp : Date}[]; 
        return result
    }catch(error) {
        throw (error)
    }
}

export const getMessageId = async (chat_id: string, sender_id : string, content : string ) => {
    const query = "SELECT message_id FROM Message WHERE chat_id = ? AND sender_id = ? AND content = ?"
    try {
        const result = await db.prepare(query).all(chat_id,sender_id,content) as {message_id : string } [] 
        return result[0].message_id
    }
    catch (error) {
        console.error("Error while trying to fetch the message") 
        throw error 
    }
}

