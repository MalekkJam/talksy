<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 p-4">
    <!-- Blur Background -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-20 backdrop-blur-sm" @click="close"></div>
    
    <!-- Modal Content -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl dark:bg-gray-800 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        <span v-if="type === 'sendRequest'">Send To</span>
        <span v-else>Friend Requests</span>
      </h3>
        <button @click="close" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="overflow-y-auto flex-1">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
              <tr>
                <th scope="col" class="px-6 py-3">Username</th>
                <th scope="col" class="px-6 py-3">Email</th>
                <th scope="col" class="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in data" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {{ user.username }}
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded-full text-xs font-semibold text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30">
                    {{ user.email }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex space-x-2">
                    <button 
                      @click="acceptRequest(user.username)"
                      class="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200 rounded-md hover:bg-green-50 dark:hover:bg-green-900/30"
                      title="Accept request"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button 
                    v-if="type == 'manageRequest'"
                      @click="rejectRequest(user.username)"
                      class="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
                      title="Reject request"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex items-center justify-end p-4 border-t dark:border-gray-700">
        <button @click="close" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    data: Array, 
    type : "", // Action type : sendRequest or manageRequest
  },
  methods: {
    close() {
      this.$emit('close');
    },
    acceptRequest(username) {
      this.$emit('accept', this.type, username);
    },
    rejectRequest(username) {
      this.$emit('reject', username);
    }
  }
}
</script>