<script setup lang="ts">
import {NButton, NDataTable} from "naive-ui";
import {NaiZealCard} from "@/naiveUi";
import {onMounted, onBeforeUnmount, nextTick, ref, watch, computed} from "vue";
import BottomTouchFetch from "@/components/final/loadedScroll/BottomTouchFetch.tsx";
import PullDownRefresh from "@/components/final/loadedScroll/PullDownRefresh.tsx";
import {LoadedScroll} from "@/index";

type Row = {
  id: number
  name: string
}

const columns = [
  {title: "ID", key: "id"},
  {title: "名称", key: "name"}
]

const tableData = ref<Row[]>([])
const loading = ref(true)
const finished = ref(false)
const isError = ref(false)
const page = ref(1)
const pageSize = 20

function rowKey(row: Row) {
  return row.id
}

async function fetchData() {
  try {
    const list = await mockApi(page.value, pageSize)

    if (list.length < pageSize) {
      finished.value = true
    }

    tableData.value.push(...list)
    page.value++
    console.log(tableData.value)
  } catch (e) {
    page.value++
    throw e
  }
}

function mockApi(page: number, pageSize: number): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject('error')
      if (page === 3) {
        reject('error')
        return;
      }
      if (page > 5) {
        resolve([])
        return
      }

      const start = (page - 1) * pageSize + 1
      resolve(
          Array.from({length: pageSize}, (_, i) => ({
            id: start + i,
            name: `数据 ${start + i}`
          }))
      )
    }, 1500)
  })
}

async function refreshData() {
  page.value = 1
  finished.value = false
  tableData.value = []
  await fetchData()
}
</script>
<template>
  <NaiZealCard title="User List">
    <template #searchForm>
      <!-- 你的筛选表单 -->
    </template>

    <template #controlBtn>
      <n-button size="small" type="primary">New</n-button>
    </template>

    <template #default="{ tableHeight }">
      <LoadedScroll
          v-model:loading="loading"
          v-model:is-error="isError"
          :load-data="fetchData"
          :finished="finished"
          scroll-node=".n-scrollbar-container"
          pull-refresh
          :refresh-data="refreshData"
          support-mode="all"
      >
        <template #default="h">
          <n-data-table
              remote
              :rowKey="rowKey"
              :columns="columns"
              :data="tableData"
              :style="{ height: tableHeight-h+'px'}"
              :flex-height="true"
              :loading="loading"
          />
        </template>
      </LoadedScroll>
    </template>


    <template #rest>
      <!-- 卡片下方扩展区（比如分页） -->
    </template>
  </NaiZealCard>
</template>