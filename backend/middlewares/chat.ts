import { _getConversations } from "../models/Chat.ts";
import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { jwtVerify } from "npm:jose@5.9.6";

const secret = new TextEncoder().encode("ed5a207a8e88013ab968eaf43d0017507508e5efa2129248b713a223eaf66864");

export const getGroupConversations = async (ctx : Context) => {
  try {
    const token = await ctx.cookies.get("auth_token");
    
    if (!token) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Unauthorized" };
      return
    }

    const {payload} = await jwtVerify(token,secret) ; 
    const username = payload.username as string

    const result = await _getConversations(username,"group") ; 
    ctx.response.status = 200 ; 
    ctx.response.body = result ; 


  } catch (_error) {
      ctx.response.status = 500;
      ctx.response.body = { message: "Internal server error" };    
  }
}  