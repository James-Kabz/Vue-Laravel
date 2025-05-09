<template>
  <div class="data-table-container">
    <div class="table-header">
      <div class="table-actions">
        <slot name="actions"></slot>
      </div>
      <div class="table-search">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search..."
          @input="$emit('search', searchQuery)"
        />
      </div>
    </div>

    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.field">
              {{ column.label }}
            </th>
            <th v-if="hasActions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="item.id">
            <td v-for="column in columns" :key="column.field">
              <slot :name="`column-${column.field}`" :item="item">
                {{ item[column.field] }}
              </slot>
            </td>
            <td v-if="hasActions" class="actions-cell">
              <slot name="actions-cell" :item="item" :index="index"></slot>
            </td>
          </tr>
          <tr v-if="data.length === 0">
            <td :colspan="columns.length + (hasActions ? 1 : 0)" class="no-data">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer" v-if="pagination">
      <div class="pagination-info">Showing {{ from }} to {{ to }} of {{ total }} entries</div>
      <div class="pagination-controls">
        <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ lastPage }}</span>
        <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage === lastPage">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    pagination: {
      type: Object,
      default: null,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    hasActions: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      searchQuery: '',
    }
  },
  computed: {
    from() {
      if (!this.pagination) return 1
      return (this.currentPage - 1) * this.pagination.per_page + 1
    },
    to() {
      if (!this.pagination) return this.data.length
      const to = this.currentPage * this.pagination.per_page
      return to > this.pagination.total ? this.pagination.total : to
    },
    total() {
      return this.pagination ? this.pagination.total : this.data.length
    },
    lastPage() {
      return this.pagination ? this.pagination.last_page : 1
    },
  },
}
</script>

<style scoped>
.data-table-container {
  width: 100%;
  margin-top: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.table-actions {
  display: flex;
  gap: 10px;
}

.table-search input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.pagination-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pagination-controls button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
