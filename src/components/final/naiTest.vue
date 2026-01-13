<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {DataTableColumns, NButton, NDataTable,NPagination} from "naive-ui";
import {NaiPopupModal, useDecorateForm,NaiZealCard, NaiDynamicForm} from "@/naiveUi";
import {PageModal, SongType, zealData} from "./dataTest";
const tableData = ref<SongType[]>([])
const naiPopupModalRef = ref<InstanceType<typeof NaiPopupModal> | null>(null)
const toggleShow = () => {
  naiPopupModalRef.value?.toggle(true);
}
const onCancel = async () => {
  return undefined
}
const onSubmit = async () => {
  return await new Promise(resolve => setTimeout(() => {
    resolve(true)
  }, 2000))
}



// search
const searchFormItems = useDecorateForm([
  {
    key: "name",
    label: "Name",
  },
  {
    key: "age",
    label: "Age",
  },
].map(it => ({
  ...it, value: null,
  clearable: true,
  renderType: 'renderInput',
  span: 12
})))
// table
const columns: DataTableColumns<SongType> = [
  {
    title: 'No',
    key: 'no'
  },
  {
    title: 'Title',
    key: 'title'
  },
  {
    title: 'Length',
    key: 'length'
  },
]
const pageModal = reactive<PageModal>({pageNo: 1, pageSize: 10})
// pagination
const pagedData = computed(() => {
  const {pageNo, pageSize} = pageModal
  const start = (pageNo - 1) * pageSize
  return tableData.value.slice(start, start + pageSize)
})
onMounted(()=>{
  tableData.value=zealData
})
</script>

<template>
  <NaiZealCard title="zeal test">
    <template #searchForm>
      <NaiDynamicForm :items="searchFormItems" ref="searchDynamicFormRef" preset="grid"/>
    </template>
    <template #controlBtn>
      <n-button type="success" size="small" @click="()=>{}">Add</n-button>
    </template>
    <template #default="{tableHeight}">
      <n-data-table
          :columns="columns"
          :data="pagedData"
          :bordered="false"
          :style="{ height: tableHeight+'px'}"
          :flex-height="true"
          :scroll-x="900"
      />
    </template>
    <template #footer>
      <n-pagination v-model:page="pageModal.pageNo"
                    v-model:page-size="pageModal.pageSize"
                    :item-count="tableData.length">
        <template #prefix="{ itemCount }">
          Total {{ itemCount }}
        </template>
      </n-pagination>
    </template>
    <template #rest>
      <NaiPopupModal title="addTest" ref="naiPopupModalRef" :on-cancel="onCancel" :on-submit="onSubmit"
                     :close-on-mask="false">

      </NaiPopupModal>
    </template>
  </NaiZealCard>
</template>

<style scoped>

</style>