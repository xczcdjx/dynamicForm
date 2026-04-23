<script setup lang="ts">
import {ref} from "vue";
import BottomTouchFetch from "@/components/final/loadedScroll/BottomTouchFetch.tsx";
import EleZealCard from "@/elementPlus/EleZealCard.tsx";
import {EleZealTable} from "@/elementPlus/EleZealTableTool.tsx";

type Row = {
  id: number
  name: string
}

const columns = [
  {label: "ID", prop: "id"},
  {label: "名称", prop: "name"}
]

const tableData = ref<Row[]>([])
const loading = ref(true)
const finished = ref(false)
const isError = ref(false)
const page = ref(1)
const pageSize = 20

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
      // if (page === 3) {
      //   reject('error')
      //   return;
      // }
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
  <EleZealCard title="User List">
    <template #searchForm>
      <!-- 你的筛选表单 -->
    </template>

    <template #controlBtn>
      <el-button size="small" type="primary">New</el-button>
    </template>

    <template #default="{ tableHeight }">
      <BottomTouchFetch scroll-node=".el-scrollbar__wrap" :load-data="fetchData"
                        v-model:loading="loading"
                        v-model:is-error="isError"
                        :finished="finished">
        <template #default="h">
          <EleZealTable :data="tableData" :columns="columns" :max-height="tableHeight-h" :loading="loading">
            <template #empty>
              <p> no data</p>
            </template>
          </EleZealTable>
        </template>
      </BottomTouchFetch>
    </template>


    <template #rest>
      <!-- 卡片下方扩展区（比如分页） -->
    </template>
  </EleZealCard>
</template>