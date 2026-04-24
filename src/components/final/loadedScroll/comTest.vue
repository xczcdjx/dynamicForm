<script setup lang="ts">
import {reactive, ref} from "vue";
import {LoadedScroll} from "@/index";

type Row = {
  id: number;
  name: string;
};
type pageModal = {
  pageNo: number, pageSize: number
}

const tableData = ref<Row[]>([]);
const loading = ref(true);
const finished = ref(false);
const isError = ref(false);
const pageModal = reactive({
  pageNo: 1,
  pageSize: 20,
  total: 100
})

async function fetchData() {
  try {
    const list = await mockApi(pageModal);

    if (tableData.value.length >= pageModal.total) {
      finished.value = true;
      return
    }

    tableData.value.push(...list);
    pageModal.pageNo++;
  } catch (e) {
    throw e;
  }
}

function mockApi(pm: pageModal): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (pm.pageNo === 3) {
        // test fail
        pageModal.pageNo += 1
        return reject("error");
      }
      const start = (pm.pageNo - 1) * pm.pageSize + 1;

      resolve(
          Array.from({length: pm.pageSize}, (_, i) => ({
            id: start + i,
            name: `Data ${start + i}`,
          }))
      );
    }, 1500);
  });
}

async function refreshData() {
  pageModal.pageNo = 1
  finished.value = false;
  isError.value = false;
  tableData.value = [];

  await fetchData();
}
</script>

<template>
  <LoadedScroll
      v-model:loading="loading"
      v-model:is-error="isError"
      :load-data="fetchData"
      :finished="finished"
      scroll-node=".native-table-body"
      pull-refresh
      :refresh-data="refreshData"
      support-mode="all"
  >
    <template #default="{ hintHeight }">
      <div class="native-table-wrap">
        <div
            class="native-table-body"
        >
          <table class="native-table">
            <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="row in tableData" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
            </tr>

            <tr v-if="!tableData.length && !loading">
              <td colspan="2" class="empty-cell">
                No Data
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </LoadedScroll>
</template>

<style scoped>
.native-table-wrap {
  height: 420px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.native-table-body {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.native-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14px;
}

.native-table thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f8fafc;
}

.native-table th,
.native-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.native-table th {
  font-weight: 600;
  color: #374151;
}

.native-table td {
  color: #111827;
}

.empty-cell {
  height: 220px;
  text-align: center !important;
  color: #999;
}
</style>