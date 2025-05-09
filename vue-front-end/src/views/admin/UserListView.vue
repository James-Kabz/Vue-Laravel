<!-- src/views/admin/UserListView.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">Users</h1>
            <Button @click="openCreateModal">
              <PlusIcon class="h-4 w-4 mr-2" />
              Add User
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
          <div v-else-if="users.length === 0" class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <UsersIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <h3 class="text-lg font-medium text-gray-900">No users found</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
            <Button @click="openCreateModal" class="mt-4">
              <PlusIcon class="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <!-- Users table -->
          <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="user in users" :key="user.id">
                  <TableCell class="font-medium">{{ user.name }}</TableCell>
                  <TableCell>{{ user.email }}</TableCell>
                  <TableCell>
                    <Badge v-if="user.role" variant="outline">
                      {{ user.role.name }}
                    </Badge>
                    <span v-else class="text-gray-500">No role</span>
                  </TableCell>
                  <TableCell>
                    <Badge :variant="user.email_verified_at ? 'success' : 'destructive'">
                      {{ user.email_verified_at ? 'Verified' : 'Unverified' }}
                    </Badge>
                    <Badge v-if="user.blocked === 'Y'" variant="destructive" class="ml-1">
                      Blocked
                    </Badge>
                  </TableCell>
                  <TableCell>{{ formatDate(user.created_at) }}</TableCell>
                  <TableCell class="text-right">
                    <div class="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" @click="openEditModal(user)">
                        <PencilIcon class="h-4 w-4" />
                        <span class="sr-only">Edit</span>
                      </Button>
                      <Button
                        v-if="user.blocked === 'Y'"
                        variant="outline"
                        size="sm"
                        @click="unblockUser(user)"
                      >
                        <UnlockIcon class="h-4 w-4" />
                        <span class="sr-only">Unblock</span>
                      </Button>
                      <Button
                        v-else-if="user.id !== currentUserId"
                        variant="outline"
                        size="sm"
                        @click="blockUser(user)"
                      >
                        <LockIcon class="h-4 w-4" />
                        <span class="sr-only">Block</span>
                      </Button>
                      <Button
                        v-if="user.id !== currentUserId"
                        variant="outline"
                        size="sm"
                        @click="confirmDelete(user)"
                      >
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

    <!-- Create/Edit User Modal -->
    <FormModal
      v-if="showModal"
      :title="isEditing ? 'Edit User' : 'Create User'"
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
            This will permanently delete the user "{{ userToDelete?.name }}".
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="deleteUser" class="bg-red-600 hover:bg-red-700">
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
  AlertCircleIcon, UsersIcon, LockIcon, UnlockIcon
} from 'lucide-vue-next';
import AdminService from '@/services/AdminService';
import authStore from '@/stores/auth';
import type { FormField } from '@/types/form';
import type { User, Role } from '@/types/admin';

// State
const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const currentUserId = computed<number | undefined>(() => authStore.state.user?.id);

// Form state
const showModal = ref<boolean>(false);
const isEditing = ref<boolean>(false);
const formLoading = ref<boolean>(false);
const formError = ref<string | null>(null);
const formValues = reactive<Partial<User>>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role_id: undefined
});

// Delete dialog state
const showDeleteDialog = ref<boolean>(false);
const userToDelete = ref<User | null>(null);
const deleteLoading = ref<boolean>(false);

// Form fields definition
const formFields = computed<FormField[]>(() => {
  const fields: FormField[] = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter email address',
      required: true
    },
    {
      name: 'role_id',
      label: 'Role',
      type: 'select',
      placeholder: 'Select a role',
      required: true,
      options: roles.value.map(role => ({
        value: role.id.toString(),
        label: role.name
      }))
    }
  ];

  // Only show password fields when creating a new user
  if (!isEditing.value) {
    fields.push(
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter password',
        required: true
      },
      {
        name: 'password_confirmation',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirm password',
        required: true
      }
    );
  }

  return fields;
});

// Fetch users and roles on component mount
onMounted(async () => {
  try {
    // Fetch roles first
    const rolesResponse = await AdminService.getRoles();
    roles.value = rolesResponse.data;

    // Then fetch users
    const usersResponse = await AdminService.getUsers();
    users.value = usersResponse.data;
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
    email: '',
    password: '',
    password_confirmation: '',
    role_id: roles.value.length > 0 ? roles.value[0].id : undefined
  });

  formError.value = null;
  showModal.value = true;
};

const openEditModal = (user: User): void => {
  isEditing.value = true;

  // Set form values from user
  Object.assign(formValues, {
    id: user.id,
    name: user.name,
    email: user.email,
    role_id: user.role?.id
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
      // Update existing user
      const response = await AdminService.updateUser(formValues.id, values as Partial<User>);

      // Update the user in the list
      const index = users.value.findIndex(u => u.id === formValues.id);
      if (index !== -1) {
        users.value[index] = response.data;
      }
    } else {
      // Create new user
      const response = await AdminService.createUser(values as Partial<User>);
      users.value.push(response.data);
    }

    // Close the modal
    showModal.value = false;
  } catch (err: any) {
    console.error('Form submission error:', err);

    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      const errorMessages = [];

      if (errors.name) errorMessages.push(errors.name[0]);
      if (errors.email) errorMessages.push(errors.email[0]);
      if (errors.password) errorMessages.push(errors.password[0]);
      if (errors.role_id) errorMessages.push(errors.role_id[0]);

      formError.value = errorMessages.join(' ') || 'Failed to save user';
    } else {
      formError.value = err.response?.data?.message || 'Failed to save user';
    }
  } finally {
    formLoading.value = false;
  }
};

// Delete handlers
const confirmDelete = (user: User): void => {
  userToDelete.value = user;
  showDeleteDialog.value = true;
};

const deleteUser = async (): Promise<void> => {
  if (!userToDelete.value) return;

  deleteLoading.value = true;

  try {
    await AdminService.deleteUser(userToDelete.value.id);

    // Remove the user from the list
    users.value = users.value.filter(u => u.id !== userToDelete.value?.id);

    // Close the dialog
    showDeleteDialog.value = false;
    userToDelete.value = null;
  } catch (err: any) {
    console.error('Delete error:', err);
    error.value = err.response?.data?.message || 'Failed to delete user';
  } finally {
    deleteLoading.value = false;
  }
};

// Block/Unblock handlers
const blockUser = async (user: User): Promise<void> => {
  try {
    const response = await AdminService.blockUser(user.id);

    // Update the user in the list
    const index = users.value.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users.value[index] = response.data;
    }
  } catch (err: any) {
    console.error('Block error:', err);
    error.value = err.response?.data?.message || 'Failed to block user';
  }
};

const unblockUser = async (user: User): Promise<void> => {
  try {
    const response = await AdminService.unblockUser(user.id);

    // Update the user in the list
    const index = users.value.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users.value[index] = response.data;
    }
  } catch (err: any) {
    console.error('Unblock error:', err);
    error.value = err.response?.data?.message || 'Failed to unblock user';
  }
};
</script>