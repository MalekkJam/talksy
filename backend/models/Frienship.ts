import db from "../config/database.ts";

export const addFriendship = (sender_id : string, target_id : string) => {
    const query = "INSERT INTO Friendship (user_id1, user_id2) VALUES (?,?);"

    try {
        const result = db.prepare(query).all(sender_id,target_id) 
        return result
    }catch (error) {
        console.error("Error while inserting in the friendship table");
        throw error 
    }
}

export const getMyFriends = (user_id : string) => {
    const query = `
        SELECT u.username
        FROM Friendship f
        JOIN User u ON (
            (f.user_id1 = ? AND u.user_id = f.user_id2) OR
            (f.user_id2 = ? AND u.user_id = f.user_id1)
        )
    `;

    try {
        const result = db.prepare(query).all(user_id, user_id);
        return result;
    } catch (error) {
        console.error("Error while fetching friends");
        throw error;
    }

}