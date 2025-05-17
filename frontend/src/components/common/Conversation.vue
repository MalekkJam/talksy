<template>
  <div class="p-4 md:p-6">
    <div class="relative overflow-hidden shadow-md sm:rounded-lg bg-white dark:bg-gray-800">
      <!-- Chat Header -->
      <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ activeConversation }} 
          </h3>
          <span class="text-xs px-2 py-1 rounded-full" 
                :class="chatType === 'private' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'">
            {{ chatType === 'private' ? 'Private Chat' : 'Group Chat' }}
          </span>
        </div>
              <div v-if="chatType === 'group'" class="flex space-x-2">
          <!-- Group-specific actions -->
          <button class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Messages Container -->
      <div class="h-[calc(100vh-300px)] overflow-y-auto p-4 space-y-4">
        <div 
          v-for="(message, index) in messages"
          :key="index"
          class="flex gap-3"
          :class="{'justify-end': message.isCurrentUser}"
        >
          <img
            v-if="!message.isCurrentUser"
            class="w-8 h-8 rounded-full mt-1"
            src="../../assets/images/profile.png"
            alt="User image"
          />
          
          <div class="flex flex-col" :class="{'items-end': message.isCurrentUser}">
            <div class="flex items-baseline gap-2">
              <span 
                class="text-sm font-semibold"
                :class="message.isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'"
              >
                {{ message.username }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(message.date) }}
              </span>
            </div>
            
            <div
              class="mt-1 p-3 rounded-lg max-w-[80%]"
              :class="message.isCurrentUser 
                ? 'bg-blue-100 dark:bg-blue-900/30 rounded-tr-none' 
                : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'"
            >
              <p class="text-sm text-gray-900 dark:text-white emoji-text">
                {{ message.content }}
              </p>
            </div>
            
            <span class="text-xs mt-1 text-gray-500 dark:text-gray-400">
              {{ message.status }}
            </span>
          </div>

          <img
            v-if="message.isCurrentUser"
            class="w-8 h-8 rounded-full mt-1"
            src="../../assets/images/current-user.png"
            alt="Your profile"
          />
        </div>
      </div>

      <!-- Message Input with Emoji Picker -->
      <div class="relative p-4 border-t dark:border-gray-700">
        <div class="flex gap-2 items-center">
          <!-- Emoji Picker Button -->
          <button 
            @click="toggleEmojiPicker"
            class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <!-- Emoji Picker (shown when button clicked) -->
          <div 
            v-if="showEmojiPicker"
            class="absolute bottom-16 left-16 z-50"
          >
            <emoji-picker @emoji-click="addEmojiToInput"></emoji-picker>
          </div>

          <!-- Message Input -->
          <input
            type="text"
            v-model="message_tosend"
            @keyup.enter="_sendMessage"
            class="flex-1 p-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Type your message..."
          />
          
          <!-- Send Button -->
          <button
            @click="_sendMessage"
            class="px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style>
.emoji-text {
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
  line-height: 1.5;
}

/* Optional: Style the emoji picker to match your theme */
emoji-picker {
  --background: white;
  --border-color: #e5e7eb;
  --category-emoji-padding: 0.5rem;
}

.dark emoji-picker {
  --background: #374151;
  --border-color: #4b5563;
  --text-color: #f3f4f6;
}
</style>
<script>
import { initWebSocket, sendMessage  } from '@/services/websocket.service';
import 'emoji-picker-element';


export default {
   data()  {
      return {
         message_tosend : "",
         messages : [], 
         activeConversation : "",
         showEmojiPicker : false , 
         chatType : ""
      }
   }, 
   async mounted()  {
      await this.determineChatType()
      await this.initializeConversation()
   },
   watch: {
    // Watch for changes in the route parameter
    "$route.params.conversation": {
      immediate: true, // Trigger the watcher immediately on component load
      handler() {
        this.determineChatType() ; 
        this.initializeConversation();
      },
    },
  },
   methods : { 
      determineChatType() {
        this.chatType = this.$route.path.includes('/private/') ? 'private' : 'group';
        console.log(this.chatType);
      },
      formatDate(date) {
         const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
         return new Date(date).toLocaleDateString(undefined, options);
      },
      async initializeConversation() {
         try {
          const socket = await initWebSocket();
          this.activeConversation = this.$route.params.conversation;
          
          const request = {
              type: "request",
              action: "loadMessages",
              conversation: this.activeConversation,
              chatType : this.chatType
          };
         sendMessage(JSON.stringify(request));

         socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (
               response.type === "response" &&
               response.action === "loadMessages" &&
               response.conversation === this.activeConversation
            ) {
               this.messages = response.data;
            }
            if (
              response.type === "broadcast" && 
              response.action === "newMessages" && 
              response.conversation === this.activeConversation 
            ){
              this.messages.push({
                username : response.username,
                content : response.data,
                date : new Date().toISOString()
              })
            }

         };
         } catch (error) {
         console.error("Error initializing conversation:", error);
         }
      },
      _sendMessage() {
        console.log(this.message_tosend);
         if (this.message_tosend.trim() !== "") {
           const request = {  type : "message"  , action: this.message_tosend , conversation : this.activeConversation};
            sendMessage(JSON.stringify(request));
            this.message_tosend = ""; 
         }
      },
      toggleEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker 
        console.log(this.showEmojiPicker);
      }, 
      addEmojiToInput(event) {
        this.message_tosend+=event.detail.unicode 
        this.showEmojiPicker = false 
      }
   }
};




</script>