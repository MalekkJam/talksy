
import db from "../config/database.ts";  

export const sendRequest = (sender_id: string, target_id: string) => {
    const query = "INSERT INTO RequestFriendship (sender_id, receiver_id, status) VALUES (?, ?, 'pending');";

    try {
        const result = db.prepare(query).run(sender_id, target_id); // Use .run() for INSERT
        return result; // Return the result of the execution
    } catch (error) {
        console.error("Error while inserting in request friendship table:", error);
        throw error;
    }
};

export const _getNonFriendUsers = (username: string) => {
    const query = `
        SELECT u.username, u.email
        FROM User u
        WHERE u.username != ? -- Exclude the current user
          AND u.user_id NOT IN (
            SELECT CASE 
                     WHEN r.sender_id = u1.user_id THEN r.receiver_id
                     WHEN r.receiver_id = u1.user_id THEN r.sender_id
                   END
            FROM RequestFriendship r
            JOIN User u1 ON u1.username = ? -- Find the user_id of the given username
            WHERE (r.sender_id = u1.user_id OR r.receiver_id = u1.user_id)
              AND r.status IN ('pending', 'accepted') -- Check only pending or accepted requests
          );
    `;

    try {
        const result = db.prepare(query).all(username, username);
        return result;
    } catch (error) {
        console.error("Error while fetching non-friend users:", error);
        throw error;
    }
};

export const getRequests = (user_id: string) => {
    const query = `
        SELECT r.id, r.sender_id, r.receiver_id, r.status, 
               u.username AS username, u.email AS email
        FROM RequestFriendship r
        JOIN User u ON r.sender_id = u.user_id
        WHERE r.receiver_id = ? AND r.status = 'pending';
    `;

    try {
        const result = db.prepare(query).all(user_id);
        return result;
    } catch (error) {
        console.error("Error while fetching friend requests:", error);
        throw error;
    }
};

export const acceptRequest = (sender_id : string , target_id : string ) => {
    const query = "UPDATE RequestFriendship SET status = 'accepted' WHERE sender_id = ? AND receiver_id = ? AND status = 'pending';"

    try {
        const result = db.prepare(query).run(sender_id,target_id) ; 
        return result 
    }catch (error) {
        console.error("Error while accepting the invitation"); 
        throw error 
    }
}

export const rejectRequest = (sender_id : string , user_id : string ) => {
    const query = "UPDATE RequestFriendship SET status = 'accepted' WHERE sender_id = ? AND receiver_id = ? AND status = 'pending';"

    try {
        const result = db.prepare(query).run(sender_id,user_id) ; 
        return result 
    }catch (error) {
        console.error("Error while rejecting the invitation"); 
        throw error 
    }
}