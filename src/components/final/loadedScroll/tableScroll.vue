<script setup lang="ts">
import {NButton, NDataTable} from "naive-ui";
import {NaiZealCard} from "@/naiveUi";
import {onMounted, onBeforeUnmount, nextTick, ref, watch, computed} from "vue";
import BottomTouchFetch from "@/components/final/loadedScroll/BottomTouchFetch.tsx";

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
const hintHeight = computed(() => (loading.value || finished.value || isError.value) ? 40 : 0)

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
      <BottomTouchFetch scroll-node=".n-scrollbar-container" :load-data="fetchData"
                        v-model:loading="loading"
                        v-model:is-error="isError"
                        :finished="finished">
        <n-data-table
            remote
            :rowKey="rowKey"
            :columns="columns"
            :data="tableData"
            :style="{ height: tableHeight-hintHeight+'px'}"
            :flex-height="true"
            :loading="loading"
        />
      </BottomTouchFetch>
    </template>


    <template #rest>
      <!-- 卡片下方扩展区（比如分页） -->
    </template>
  </NaiZealCard>
</template>