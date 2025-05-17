<template>
    <div class="p-4 md:p-6">
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div class="p-6 bg-white dark:bg-gray-800 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Create New Chat
          </h3>
          
          <form @submit.prevent="createChat" class="space-y-4">
            <div>
              <label for="chatName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chat Name
              </label>
              <input
                v-model="newChat.name"
                type="text"
                id="chatName"
                required
                class="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter chat name"
              >
            </div>
  
  
            <ErrorMessage v-if="showErrorMessage" :message="errorMessage" class="mt-2 text-red-500" />
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="cancelCreate"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"
              >
                Reset
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Chat
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ErrorMessage from '../common/ErrorMessage.vue';
  
  export default {
    components: {
      ErrorMessage
    },
    data() {
      return {
        newChat: {
          name: '',
          type: 'private'
        },
        url: "http://localhost:3000",
        showErrorMessage: false,
        errorMessage: ""
      }
    },
    methods: {
      async createChat() {
        try {
          const response = await fetch(this.url + "/addNewConversation", {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
              newChat_name: this.newChat.name,
            })
          });
  
          if (response.status === 200) {
            this.showErrorMessage = false;
            this.$emit('newChatAdded');
            this.resetForm();
          } else {
            const data = await response.json();
            this.showErrorMessage = true;
            this.errorMessage = data.message;
            setTimeout(() => {
              this.showErrorMessage = false;
            }, 10000);
          }
        } catch (error) {
          console.error("Error creating chat:", error);
          this.showErrorMessage = true;
          this.errorMessage = "Failed to create chat";
        }
      },
      cancelCreate() {
        this.resetForm();
        this.$emit('cancel');
      },
      resetForm() {
        this.newChat = {
          name: '',
        };
        this.showErrorMessage = false 
      }
    }
  }
  </script>