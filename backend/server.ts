import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { registration , login, logout, verifyToken, getUsername, getUserInfo, updateUserData, deleteAccount , getNonFriendUsers} from "./middlewares/user.ts";
import { connectionUpgrade } from "./middlewares/websocket.ts";
import { getGroupConversations } from "./middlewares/chat.ts";
import {getKpis, getAllUsers, getAllChats , getChatParticipants , kickUserFromChat , getAvailableParticipants , addUserToChat, deleteConversation, addNewConversation , verifyAdminRole}  from "./middlewares/admin.ts" ; 
import { fetchFriendshipRequests } from "./middlewares/requestFriendship.ts";
import {fetchMyFriends} from "./middlewares/friendship.ts"

const router = new Router();
const app = new Application();
const port = Deno.args[0] ? Number(Deno.args[0]) : 3000;

// Connected websockets clients 
const clients = new Set<WebSocket>();


router.post("/registration", registration);
router.post("/login",login) ; 
router.post("/logout",(ctx)=>logout(ctx,clients)) ; 
router.post("/verifyToken",verifyToken) ; 
router.post("/verifyAdminRole", verifyAdminRole)
router.get("/getUsername",getUsername) ;
router.get("/getGroupConversations", getGroupConversations);
router.get("/getUserInfo", getUserInfo)
router.put("/updateUserData", updateUserData)
router.delete("/deleteAccount", (ctx)=>deleteAccount(ctx,clients)) 
router.get("/getKpis", getKpis) ; 
router.get("/getAllUsers",getAllUsers) ; 
router.get("/getAllChats", getAllChats) ; 
router.post("/getChatParticipants",getChatParticipants )
router.post("/kickUserFromChat" , kickUserFromChat)
router.post("/getAvailableParticipants", getAvailableParticipants)
router.post("/addUserToChat",addUserToChat) ; 
router.delete("/deleteConversation",deleteConversation) ;
router.post("/addNewConversation", addNewConversation) ; 
router.get("/fetchNonFriendUsers", getNonFriendUsers) ; 
router.get("/fetchFriendshipRequests", fetchFriendshipRequests) ; 
router.get("/getMyFriends", fetchMyFriends) ; 


// WebSocket endpoint
router.get("/ws", (ctx) => connectionUpgrade(clients, ctx));


app.use(
  oakCors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Oak server running on port ${port}`);

await app.listen({ port });
