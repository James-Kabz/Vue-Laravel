<!-- src/views/admin/PermissionListView.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">Permissions</h1>
            <Button @click="openCreateModal">
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Permission
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
          <div v-else-if="permissions.length === 0" class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <FolderIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <h3 class="text-lg font-medium text-gray-900">No permissions found</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new permission.</p>
            <Button @click="openCreateModal" class="mt-4">
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Permission
            </Button>
          </div>

          <!-- Permissions table -->
          <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="permission in permissions" :key="permission.id">
                  <TableCell class="font-medium">{{ permission.name }}</TableCell>
                  <TableCell>{{ permission.slug }}</TableCell>
                  <TableCell>{{ permission.description || 'N/A' }}</TableCell>
                  <TableCell>{{ formatDate(permission.created_at) }}</TableCell>
                  <TableCell class="text-right">
                    <div class="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" @click="openEditModal(permission)">
                        <PencilIcon class="h-4 w-4" />
                        <span class="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="sm" @click="confirmDelete(permission)">
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

    <!-- Create/Edit Permission Modal -->
    <FormModal
      v-if="showModal"
      :title="isEditing ? 'Edit Permission' : 'Create Permission'"
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
            This will permanently delete the permission "{{ permissionToDelete?.name }}".
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="deletePermission" class="bg-red-600 hover:bg-red-700">
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
  AlertCircleIcon, FolderIcon
} from 'lucide-vue-next';
import AdminService from '@/services/AdminService';
import type { FormField } from '@/types/form';
import type { Permission } from '@/types/admin';

// State
const permissions = ref<Permission[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

// Form state
const showModal = ref<boolean>(false);
const isEditing = ref<boolean>(false);
const formLoading = ref<boolean>(false);
const formError = ref<string | null>(null);
const formValues = reactive<Partial<Permission>>({
  name: '',
  slug: '',
  description: ''
});

// Delete dialog state
const showDeleteDialog = ref<boolean>(false);
const permissionToDelete = ref<Permission | null>(null);
const deleteLoading = ref<boolean>(false);

// Form fields definition
const formFields = computed<FormField[]>(() => [
  {
    name: 'name',
    label: 'Permission Name',
    type: 'text',
    placeholder: 'Enter permission name',
    required: true
  },
  {
    name: 'slug',
    label: 'Permission Slug',
    type: 'text',
    placeholder: 'Enter permission slug (e.g., manage-users)',
    required: true
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter permission description',
    required: false
  }
]);

// Fetch permissions on component mount
onMounted(async () => {
  try {
    const response = await AdminService.getPermissions();
    permissions.value = response.data;
  } catch (err: any) {
    console.error('Failed to fetch permissions:', err);
    error.value = err.response?.data?.message || 'Failed to load permissions';
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
    description: ''
  });

  formError.value = null;
  showModal.value = true;
};

const openEditModal = (permission: Permission): void => {
  isEditing.value = true;

  // Set form values from permission
  Object.assign(formValues, {
    id: permission.id,
    name: permission.name,
    slug: permission.slug,
    description: permission.description
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
      // Update existing permission
      const response = await AdminService.updatePermission(formValues.id, values as Partial<Permission>);

      // Update the permission in the list
      const index = permissions.value.findIndex(p => p.id === formValues.id);
      if (index !== -1) {
        permissions.value[index] = response.data;
      }
    } else {
      // Create new permission
      const response = await AdminService.createPermission(values as Partial<Permission>);
      permissions.value.push(response.data);
    }

    // Close the modal
    showModal.value = false;
  } catch (err: any) {
    console.error('Form submission error:', err);
    formError.value = err.response?.data?.message || 'Failed to save permission';
  } finally {
    formLoading.value = false;
  }
};

// Delete handlers
const confirmDelete = (permission: Permission): void => {
  permissionToDelete.value = permission;
  showDeleteDialog.value = true;
};

const deletePermission = async (): Promise<void> => {
  if (!permissionToDelete.value) return;

  deleteLoading.value = true;

  try {
    await AdminService.deletePermission(permissionToDelete.value.id);

    // Remove the permission from the list
    permissions.value = permissions.value.filter(p => p.id !== permissionToDelete.value?.id);

    // Close the dialog
    showDeleteDialog.value = false;
    permissionToDelete.value = null;
  } catch (err: any) {
    console.error('Delete error:', err);
    error.value = err.response?.data?.message || 'Failed to delete permission';
  } finally {
    deleteLoading.value = false;
  }
};
</script>