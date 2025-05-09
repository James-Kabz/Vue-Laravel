<!-- src/views/admin/RoleListView.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">Roles</h1>
            <Button @click="openCreateModal">
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <!-- Loading state -->
          <div v-if="loading" class="flex justify-center py-8">
            <Loader2Icon class="h-8 w-8 animate-spin text-primary" />
          </div>

          <!-- Error state -->
          <Alert v-else-if="error" variant="destructive" class="mb-4">
            <AlertCircleIcon class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>

          <!-- Empty state -->
          <div v-else-if="roles.length === 0" class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <ShieldIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <h3 class="text-lg font-medium text-gray-900">No roles found</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new role.</p>
            <Button @click="openCreateModal" class="mt-4">
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>

          <!-- Roles table -->
          <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="role in roles" :key="role.id">
                  <TableCell class="font-medium">{{ role.name }}</TableCell>
                  <TableCell>{{ role.slug }}</TableCell>
                  <TableCell>{{ role.description || 'N/A' }}</TableCell>
                  <TableCell>
                    <div class="flex flex-wrap gap-1">
                      <Badge
                        v-for="permission in role.permissions.slice(0, 3)"
                        :key="permission.id"
                        variant="outline"
                        class="mr-1"
                      >
                        {{ permission.name }}
                      </Badge>
                      <Badge
                        v-if="role.permissions.length > 3"
                        variant="outline"
                      >
                        +{{ role.permissions.length - 3 }} more
                      </Badge>
                      <span v-if="role.permissions.length === 0" class="text-gray-500">
                        No permissions
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{{ formatDate(role.created_at) }}</TableCell>
                  <TableCell class="text-right">
                    <div class="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" @click="openEditModal(role)">
                        <PencilIcon class="h-4 w-4" />
                        <span class="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="sm" @click="confirmDelete(role)">
                        <TrashIcon class="h-4 w-4" />
                        <span class="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>

    <!-- Create/Edit Role Modal -->
    <FormModal
      v-if="showModal"
      :title="isEditing ? 'Edit Role' : 'Create Role'"
      :fields="formFields"
      :values="formValues"
      :loading="formLoading"
      :error="formError"
      @close="closeModal"
      @submit="submitForm"
    />

    <!-- Delete Confirmation Dialog -->
    <AlertDialog :open="showDeleteDialog" @close="showDeleteDialog = false">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the role "{{ roleToDelete?.name }}".
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="deleteRole" class="bg-red-600 hover:bg-red-700">
            <Loader2Icon v-if="deleteLoading" class="mr-2 h-4 w-4 animate-spin" />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import Navbar from '@/components/layout/NavbarComp.vue';
import FormModal from '@/components/FormModalView.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  PlusIcon, PencilIcon, TrashIcon, Loader2Icon,
  AlertCircleIcon, ShieldIcon
} from 'lucide-vue-next';
import AdminService from '@/services/AdminService';
import type { FormField } from '@/types/form';
import type { Role, Permission } from '@/types/admin';

// State
const roles = ref<Role[]>([]);
const permissions = ref<Permission[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

// Form state
const showModal = ref<boolean>(false);
const isEditing = ref<boolean>(false);
const formLoading = ref<boolean>(false);
const formError = ref<string | null>(null);
const formValues = reactive<Partial<Role & { permission_ids: number[] }>>({
  name: '',
  slug: '',
  description: '',
  permission_ids: []
});

// Delete dialog state
const showDeleteDialog = ref<boolean>(false);
const roleToDelete = ref<Role | null>(null);
const deleteLoading = ref<boolean>(false);

// Form fields definition
const formFields = computed<FormField[]>(() => [
  {
    name: 'name',
    label: 'Role Name',
    type: 'text',
    placeholder: 'Enter role name',
    required: true
  },
  {
    name: 'slug',
    label: 'Role Slug',
    type: 'text',
    placeholder: 'Enter role slug (e.g., admin)',
    required: true
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter role description',
    required: false
  },
  {
    name: 'permission_ids',
    label: 'Permissions',
    type: 'multiselect',
    placeholder: 'Select permissions',
    required: false,
    options: permissions.value.map(permission => ({
      value: permission.id.toString(),
      label: permission.name
    }))
  }
]);

// Fetch roles and permissions on component mount
onMounted(async () => {
  try {
    // Fetch permissions first
    const permissionsResponse = await AdminService.getPermissions();
    permissions.value = permissionsResponse.data;

    // Then fetch roles
    const rolesResponse = await AdminService.getRoles();
    roles.value = rolesResponse.data;
  } catch (err: any) {
    console.error('Failed to fetch data:', err);
    error.value = err.response?.data?.message || 'Failed to load data';
  } finally {
    loading.value = false;
  }
});

// Format date for display
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Modal handlers
const openCreateModal = (): void => {
  isEditing.value = false;

  // Reset form values
  Object.assign(formValues, {
    name: '',
    slug: '',
    description: '',
    permission_ids: []
  });

  formError.value = null;
  showModal.value = true;
};

const openEditModal = (role: Role): void => {
  isEditing.value = true;

  // Set form values from role
  Object.assign(formValues, {
    id: role.id,
    name: role.name,
    slug: role.slug,
    description: role.description,
    permission_ids: role.permissions.map(p => p.id)
  });

  formError.value = null;
  showModal.value = true;
};

const closeModal = (): void => {
  showModal.value = false;
  formError.value = null;
};

// Form submission
const submitForm = async (values: Record<string, any>): Promise<void> => {
  formLoading.value = true;
  formError.value = null;

  try {
    if (isEditing.value && formValues.id) {
      // Update existing role
      const response = await AdminService.updateRole(formValues.id, values as Partial<Role & { permission_ids: number[] }>);

      // Update the role in the list
      const index = roles.value.findIndex(r => r.id === formValues.id);
      if (index !== -1) {
        roles.value[index] = response.data;
      }
    } else {
      // Create new role
      const response = await AdminService.createRole(values as Partial<Role & { permission_ids: number[] }>);
      roles.value.push(response.data);
    }

    // Close the modal
    showModal.value = false;
  } catch (err: any) {
    console.error('Form submission error:', err);
    formError.value = err.response?.data?.message || 'Failed to save role';
  } finally {
    formLoading.value = false;
  }
};

// Delete handlers
const confirmDelete = (role: Role): void => {
  roleToDelete.value = role;
  showDeleteDialog.value = true;
};

const deleteRole = async (): Promise<void> => {
  if (!roleToDelete.value) return;

  deleteLoading.value = true;

  try {
    await AdminService.deleteRole(roleToDelete.value.id);

    // Remove the role from the list
    roles.value = roles.value.filter(r => r.id !== roleToDelete.value?.id);

    // Close the dialog
    showDeleteDialog.value = false;
    roleToDelete.value = null;
  } catch (err: any) {
    console.error('Delete error:', err);
    error.value = err.response?.data?.message || 'Failed to delete role';
  } finally {
    deleteLoading.value = false;
  }
};
</script>