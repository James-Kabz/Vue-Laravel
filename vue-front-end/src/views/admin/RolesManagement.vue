<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="p-6">
      <data-table
        :columns="columns"
        :data="roles"
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
            Create Role
          </button>
        </template>

        <template #column-permissions="{ item }">
          <div v-if="item.permissions && item.permissions.length > 0">
            <span v-for="(perm, index) in item.permissions" :key="perm.id" class="inline-block">
              {{ perm.name }}<span v-if="index < item.permissions.length - 1">, </span>
            </span>
          </div>
          <span v-else class="text-gray-400">No permissions</span>
        </template>

        <template #actions-cell="{ item }">
          <button
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-2"
            @click="showPermissionsModal(item)"
          >
            Permissions
          </button>
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

      <!-- Role Form Modal -->
      <base-modal
        :show="modal.show"
        :title="modal.title"
        @close="closeModal"
        @submit="handleSubmit"
      >
        <template #body>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <label for="role-name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="role-name"
                v-model="form.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </form>
        </template>
      </base-modal>

      <!-- Permissions Modal -->
      <base-modal
        :show="permissionsModal.show"
        :title="permissionsModal.title"
        width="700px"
        @close="closePermissionsModal"
        @submit="saveRolePermissions"
      >
        <template #body>
          <div class="space-y-4">
            <div class="font-medium">Current Permissions:</div>
            <div v-if="currentRolePermissions.length > 0" class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="perm in currentRolePermissions"
                :key="perm.id"
                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {{ perm.name }}
              </span>
            </div>
            <div v-else class="text-gray-500 mb-4">No permissions assigned</div>

            <div class="font-medium">Available Permissions:</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="permission in allPermissions"
                :key="permission.id"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  :id="`perm-${permission.id}`"
                  :value="permission.id"
                  v-model="selectedPermissions"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label :for="`perm-${permission.id}`" class="ml-2 block text-sm text-gray-700">
                  {{ permission.name }}
                </label>
              </div>
            </div>
          </div>
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
        { field: 'permissions', label: 'Permissions' },
      ],
      roles: [],
      allPermissions: [],
      currentRolePermissions: [],
      selectedPermissions: [],
      pagination: null,
      currentPage: 1,
      search: '',
      modal: {
        show: false,
        title: '',
        mode: '',
      },
      permissionsModal: {
        show: false,
        title: '',
        roleId: null,
      },
      form: {
        id: null,
        name: '',
        permissions: [],
      },
    }
  },
  async created() {
    await this.fetchRoles()
    await this.fetchAllPermissions()
  },
  methods: {
    async fetchRoles() {
      try {
        const response = await AdminService.getRoles({
          page: this.currentPage,
          search: this.search,
        })

        if (response.data.success) {
          this.roles = response.data.data.roles || []
          // Ensure each role has a permissions array
          this.roles = this.roles.map((role) => ({
            ...role,
            permissions: role.permissions || [],
          }))
        } else {
          this.roles = []
        }
      } catch (error) {
        console.error('Error fetching roles:', error)
        this.$toast.error('Failed to fetch roles')
        this.roles = []
      }
    },
    async fetchAllPermissions() {
      try {
        const response = await AdminService.getPermissions()
        this.allPermissions = response.data || []
      } catch (error) {
        console.error('Error fetching permissions:', error)
        this.$toast.error('Failed to fetch permissions')
        this.allPermissions = []
      }
    },
    async fetchRolePermissions(roleId) {
      try {
        const response = await AdminService.getRolePermissions(roleId)
        return response.data || []
      } catch (error) {
        console.error('Error fetching role permissions:', error)
        this.$toast.error('Failed to fetch role permissions')
        return []
      }
    },
    showPermissionsModal(role) {
      this.permissionsModal.show = true
      this.permissionsModal.title = `Manage Permissions for ${role.name}`
      this.permissionsModal.roleId = role.id
      this.currentRolePermissions = [...role.permissions]
      this.selectedPermissions = role.permissions.map((p) => p.id)
    },
    closePermissionsModal() {
      this.permissionsModal.show = false
      this.permissionsModal.roleId = null
      this.currentRolePermissions = []
      this.selectedPermissions = []
    },
    async saveRolePermissions() {
      try {
        const roleId = this.permissionsModal.roleId
        await AdminService.syncPermissionsToRole(roleId, this.selectedPermissions)

        // Update the local roles data
        const roleIndex = this.roles.findIndex((r) => r.id === roleId)
        if (roleIndex !== -1) {
          const updatedPermissions = this.allPermissions.filter((p) =>
            this.selectedPermissions.includes(p.id),
          )
          this.roles[roleIndex].permissions = updatedPermissions
        }

        this.closePermissionsModal()
        this.$toast.success('Permissions updated successfully')
      } catch (error) {
        console.error('Error updating permissions:', error)
        this.$toast.error('Failed to update permissions')
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchRoles()
    },
    handleSearch(query) {
      this.search = query
      this.currentPage = 1
      this.fetchRoles()
    },
    showModal(mode, role = null) {
      this.modal.mode = mode
      this.modal.show = true

      if (mode === 'create') {
        this.modal.title = 'Create New Role'
        this.resetForm()
      } else if (mode === 'edit' && role) {
        this.modal.title = 'Edit Role'
        this.form.id = role.id
        this.form.name = role.name
      }
    },
    closeModal() {
      this.modal.show = false
    },
    resetForm() {
      this.form = {
        id: null,
        name: '',
        permissions: [],
      }
    },
    async handleSubmit() {
      try {
        if (this.modal.mode === 'create') {
          await AdminService.createRole(this.form)
        } else {
          await AdminService.updateRole(this.form.id, this.form)
        }

        this.closeModal()
        await this.fetchRoles()
        this.$toast.success('Role saved successfully')
      } catch (error) {
        console.error('Error saving role:', error)
        this.$toast.error('Error saving role')
      }
    },
    async confirmDelete(role) {
      if (confirm(`Are you sure you want to delete "${role.name}"?`)) {
        try {
          await AdminService.deleteRole(role.id)
          await this.fetchRoles()
          this.$toast.success('Role deleted successfully')
        } catch (error) {
          console.error('Error deleting role:', error)
          this.$toast.error('Error deleting role')
        }
      }
    },
  },
}
</script>
