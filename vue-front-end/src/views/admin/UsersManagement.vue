<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="p-6">
      <data-table
        :columns="columns"
        :data="users"
        :pagination="pagination"
        :current-page="currentPage"
        @page-change="handlePageChange"
        @search="handleSearch"
      >
        <template #actions>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            @click="showModal('create')"
          >
            Create User
          </button>
        </template>

        <template #column-roles="{ item }">
          <div v-if="item.roles && item.roles.length > 0" class="flex flex-wrap gap-1">
            <span
              v-for="role in item.roles"
              :key="role.id"
              class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
            >
              {{ role.name }}
            </span>
          </div>
          <span v-else class="text-gray-400">No roles</span>
        </template>

        <template #actions-cell="{ item }">
          <button
            class="px-3 py-1 bg-yellow-400 text-gray-800 rounded hover:bg-yellow-500 transition-colors mr-2"
            @click="showModal('edit', item)"
          >
            Edit
          </button>
          <button
            class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            @click="confirmDelete(item)"
          >
            Delete
          </button>
        </template>
      </data-table>

      <base-modal
        :show="modal.show"
        :title="modal.title"
        width="600px"
        @close="closeModal"
        @submit="handleSubmit"
      >
        <template #body>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="user-name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  id="user-name"
                  v-model="form.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div class="space-y-2">
                <label for="user-email" class="block text-sm font-medium text-gray-700"
                  >Email</label
                >
                <input
                  id="user-email"
                  v-model="form.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="user-password" class="block text-sm font-medium text-gray-700"
                  >Password</label
                >
                <input
                  id="user-password"
                  v-model="form.password"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  :required="modal.mode === 'create'"
                />
                <p v-if="modal.mode === 'edit'" class="text-xs text-gray-500">
                  Leave blank to keep current password
                </p>
              </div>

              <div class="space-y-2">
                <label
                  for="user-password-confirmation"
                  class="block text-sm font-medium text-gray-700"
                  >Confirm Password</label
                >
                <input
                  id="user-password-confirmation"
                  v-model="form.password_confirmation"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  :required="modal.mode === 'create'"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Roles</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="role in allRoles" :key="role.id" class="flex items-center">
                  <input
                    type="checkbox"
                    :id="`role-${role.id}`"
                    :value="role.id"
                    v-model="form.roles"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label :for="`role-${role.id}`" class="ml-2 block text-sm text-gray-700">
                    {{ role.name }}
                  </label>
                </div>
              </div>
            </div>
          </form>
        </template>
      </base-modal>
    </div>
  </div>
</template>

<script>
import DataTable from '../../components/custom/DataTable.vue'
import BaseModal from '../../components/custom/BaseModal.vue'
import AdminService from '../../services/AdminSevice'
import Navbar from '../../components/layout/NavbarComp.vue'

export default {
  components: {
    DataTable,
    BaseModal,
    Navbar,
  },
  data() {
    return {
      columns: [
        { field: 'id', label: 'ID' },
        { field: 'name', label: 'Name' },
        { field: 'email', label: 'Email' },
        { field: 'roles', label: 'Roles' },
      ],
      users: [],
      allRoles: [],
      pagination: null,
      currentPage: 1,
      search: '',
      modal: {
        show: false,
        title: '',
        mode: '',
      },
      form: {
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
      },
    }
  },
  async created() {
    await this.fetchUsers()
    await this.fetchAllRoles()
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await AdminService.getUsers({
          page: this.currentPage,
          search: this.search,
        })

        // Check if response.data exists and has users property
        if (response.data && response.data.users) {
          this.users = response.data.users
        } else if (response.data && Array.isArray(response.data)) {
          // Fallback if response.data is directly the array
          this.users = response.data
        } else {
          this.users = []
        }

        // Set pagination if available
        this.pagination = response.data.meta || null
      } catch (error) {
        console.error('Error fetching users:', error)
        this.$toast.error('Failed to fetch users')
        this.users = []
      }
    },
    async fetchAllRoles() {
      try {
        const response = await AdminService.getRoles()
        // Handle both response structures
        if (response.data && response.data.roles) {
          this.allRoles = response.data.roles
        } else if (Array.isArray(response.data)) {
          this.allRoles = response.data
        } else {
          this.allRoles = []
        }
      } catch (error) {
        console.error('Error fetching roles:', error)
        this.$toast.error('Failed to fetch roles')
        this.allRoles = []
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchUsers()
    },
    handleSearch(query) {
      this.search = query
      this.currentPage = 1
      this.fetchUsers()
    },
    showModal(mode, user = null) {
      this.modal.mode = mode
      this.modal.show = true

      if (mode === 'create') {
        this.modal.title = 'Create New User'
        this.resetForm()
      } else if (mode === 'edit' && user) {
        this.modal.title = 'Edit User'
        this.form.id = user.id
        this.form.name = user.name
        this.form.email = user.email
        this.form.roles = user.roles ? user.roles.map((r) => r.id) : []
      }
    },
    closeModal() {
      this.modal.show = false
    },
    resetForm() {
      this.form = {
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
      }
    },
    async handleSubmit() {
      try {
        const data = { ...this.form }

        // Remove password fields if they're empty in edit mode
        if (this.modal.mode === 'edit' && !data.password) {
          delete data.password
          delete data.password_confirmation
        }

        if (this.modal.mode === 'create') {
          await AdminService.createUser(data)
        } else {
          await AdminService.updateUser(data.id, data)
        }

        this.closeModal()
        await this.fetchUsers()
        this.$toast.success('User saved successfully')
      } catch (error) {
        console.error('Error saving user:', error)
        this.$toast.error('Error saving user')
      }
    },
    async confirmDelete(user) {
      if (confirm(`Are you sure you want to delete "${user.name}"?`)) {
        try {
          await AdminService.deleteUser(user.id)
          await this.fetchUsers()
          this.$toast.success('User deleted successfully')
        } catch (error) {
          console.error('Error deleting user:', error)
          this.$toast.error('Error deleting user')
        }
      }
    },
  },
}
</script>
