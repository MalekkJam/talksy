# 🗨️ Talksy

## 📌 Project Overview
Chat App is a real-time messaging application where users can **sign up, log in, and send messages** to their friends. It supports both **private chats** and **group chats**. The app also includes features like **friend requests**, **user management**, and **admin controls**. The project is built using **Vue.js** for the frontend and **Deno** for the backend, with **SQLite** as the database.

---

## 🛠️ Tech Stack
- **Frontend:** Vue.js (Vite, Vue Router, TailwindCSS)
- **Backend:** Deno (Oak framework)
- **Database:** SQLite
- **Authentication:** JWT (JSON Web Tokens) with bcrypt for password hashing
- **WebSocket:** Real-time communication for messaging and notifications

---

## 🚀 Features
### User Features:
- **Registration and Login**: Secure user authentication with JWT.
- **Friend Requests**: Send, accept, or reject friend requests.
- **Private and Group Chats**: Real-time messaging with WebSocket.
- **Profile Management**: Update username, email, and password.

### Admin Features:
- **User Management**: View, delete, or manage user accounts.
- **Chat Management**: Create, delete, or manage group chats.
- **Analytics**: View KPIs like total users, new users, and active chats.

---

## 📂 Database Schema
The project consists of **six main tables**:

1. **User** - Stores user credentials and profile information.
2. **Friendship** - Manages friendships between users.
3. **RequestFriendship** - Tracks pending friend requests.
4. **Chat** - Represents chat sessions (private or group).
5. **ChatParticipant** - Links users to chats.
6. **Message** - Stores messages exchanged in chats.

### **Entity-Relationship Diagram (ERD)**

```plaintext
User (user_id, username, email, password_hash)
│
├── Friendship (friendship_id, user_id1, user_id2, created_at)
│
├── RequestFriendship (request_id, sender_id, receiver_id, status)
│
├── Chat (chat_id, chat_type, created_at)
│
├── ChatParticipant (chat_id, user_id, joined_at)
│
└── Message (message_id, chat_id, sender_id, content, timestamp)
