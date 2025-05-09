<!-- src/components/FormModal.vue -->
<template>
  <Dialog :open="true" @close="$emit('close')">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>

      <Alert v-if="error" variant="destructive" class="mb-4">
        <AlertCircleIcon class="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4 py-4">
          <div v-for="field in fields" :key="field.name" class="grid grid-cols-4 items-center gap-4">
            <Label :for="field.name" class="text-right">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </Label>

            <!-- Text input -->
            <Input
              v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'"
              :id="field.name"
              :name="field.name"
              :type="field.type"
              :placeholder="field.placeholder"
              :required="field.required"
              v-model="formData[field.name]"
              class="col-span-3"
              :disabled="loading"
            />

            <!-- Textarea -->
            <Textarea
              v-else-if="field.type === 'textarea'"
              :id="field.name"
              :name="field.name"
              :placeholder="field.placeholder"
              :required="field.required"
              v-model="formData[field.name]"
              class="col-span-3"
              :disabled="loading"
            />

            <!-- Select -->
            <Select
              v-else-if="field.type === 'select'"
              :name="field.name"
              :required="field.required"
              v-model="formData[field.name]"
              :disabled="loading"
            >
              <SelectTrigger class="col-span-3">
                <SelectValue :placeholder="field.placeholder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>

            <!-- Multiselect -->
            <div v-else-if="field.type === 'multiselect'" class="col-span-3">
              <div class="flex flex-wrap gap-2 mb-2">
                <Badge
                  v-for="selectedValue in formData[field.name] || []"
                  :key="selectedValue"
                  variant="secondary"
                  class="flex items-center gap-1"
                >
                  {{ getOptionLabel(field, selectedValue) }}
                  <button
                    type="button"
                    @click="removeMultiSelectValue(field.name, selectedValue)"
                    class="text-xs"
                    :disabled="loading"
                  >
                    <XIcon class="h-3 w-3" />
                  </button>
                </Badge>
              </div>
              <Select
                :name="field.name"
                :disabled="loading"
                @update:modelValue="(value) => addMultiSelectValue(field.name, value as string)"
              >
                <SelectTrigger>
                  <SelectValue :placeholder="field.placeholder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in getAvailableOptions(field)"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Checkbox -->
            <div v-else-if="field.type === 'checkbox'" class="col-span-3 flex items-center space-x-2">
              <Checkbox
                :id="field.name"
                :name="field.name"
                v-model:checked="formData[field.name]"
                :disabled="loading"
              />
              <Label :for="field.name">{{ field.placeholder }}</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="$emit('close')" :disabled="loading">
            Cancel
          </Button>
          <Button type="submit" :disabled="loading">
            <Loader2Icon v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ submitLabel }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertCircleIcon, Loader2Icon, XIcon } from 'lucide-vue-next';
import type { FormField, FormFieldOption } from '@/types/form';

interface Props {
  title: string;
  description?: string;
  fields: FormField[];
  values?: Record<string, any>;
  loading?: boolean;
  error?: string | null;
  submitLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  values: () => ({}),
  loading: false,
  error: null,
  submitLabel: 'Save'
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', values: Record<string, any>): void;
}>();

// Form data
const formData = reactive<Record<string, any>>({});

// Initialize form data with provided values
onMounted(() => {
  // Initialize form data with default values
  props.fields.forEach(field => {
    if (field.type === 'multiselect') {
      formData[field.name] = props.values[field.name] || [];
    } else {
      formData[field.name] = props.values[field.name] !== undefined ? props.values[field.name] : '';
    }
  });
});

// Update form data when values prop changes
watch(() => props.values, (newValues) => {
  props.fields.forEach(field => {
    if (newValues[field.name] !== undefined) {
      formData[field.name] = newValues[field.name];
    }
  });
}, { deep: true });

// Handle form submission
const handleSubmit = (): void => {
  emit('submit', formData);
};

// Helper methods for multiselect
const addMultiSelectValue = (fieldName: string, value: string): void => {
  if (!formData[fieldName]) {
    formData[fieldName] = [];
  }

  if (!formData[fieldName].includes(value)) {
    formData[fieldName].push(value);
  }
};

const removeMultiSelectValue = (fieldName: string, value: string): void => {
  if (formData[fieldName]) {
    formData[fieldName] = formData[fieldName].filter((v: string) => v !== value);
  }
};

const getOptionLabel = (field: FormField, value: string): string => {
  const option = field.options?.find(opt => opt.value === value);
  return option ? option.label : value;
};

const getAvailableOptions = (field: FormField): FormFieldOption[] => {
  if (!field.options) return [];

  if (!formData[field.name] || !Array.isArray(formData[field.name])) {
    return field.options;
  }

  // Filter out already selected options
  return field.options.filter(option => !formData[field.name].includes(option.value));
};
</script>