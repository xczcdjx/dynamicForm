<script setup lang="ts">
import {h, nextTick, onMounted, ref} from "vue";
import {type DataTableColumns, NButton, NDataTable, NSpace, useMessage} from "naive-ui";
import {
  NaiPopupModal,
  useDecorateForm,
  NaiZealCard,
  NaiDynamicForm,
  NaiZealTableSearch,
  NaiZealTablePaginationControl,
  renderInput,
  renderInputNumber,
} from "@/naiveUi";
import type {
  naiPopupModalRef,
  naiDynamicFormRef,
  naiZealTableSearchRef
} from "@/naiveUi"
import {type SongType, zealData} from "./dataTest";
import {useDyForm, useReactiveForm, usePagination} from "@/";

const message = useMessage()
const referId = ref<string | number>('-1')
const tableData = ref<SongType[]>([])
const handleDynamicFormRef = ref<naiDynamicFormRef | null>(null)
const naiZealTableSearchRef = ref<naiZealTableSearchRef | null>(null)
const naiPopupModalRef = ref<naiPopupModalRef | null>(null)
const tableLoading = ref<boolean>(false)
// search form
const searchFormItems = useDecorateForm([
  {
    key: "no",
    label: "No",
    renderType: 'renderInputNumber',
  },
  {
    key: "title",
    label: "Title",
  },
  {
    key: "length",
    label: "Length",
  },
].map(it => ({
  value: null,
  clearable: true,
  renderType: 'renderInput',
  span: 8,
  ...it,
})) as any[])
// table column
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
  {
    title: 'Action',
    key: 'actions',
    fixed: 'right',
    render(row) {
      return h(
          NSpace, {}, [
            h(NButton,
                {
                  size: 'small',
                  onClick: () => upItem(row)
                },
                {default: () => 'update'}),
            h(NButton,
                {
                  size: 'small',
                  type: 'error',
                  onClick: () => delItem(row)
                },
                {default: () => 'delete'})
          ]
      )
    }
  }
]
const pagination = usePagination(fetchData)
const updateFormItems = useReactiveForm<SongType>([
  {
    key: "no",
    label: "No",
    clearable: true,
    value: null,
    render2: (f) => renderInputNumber(f.value, {}, f)
  },
  {
    key: "title",
    label: "Title",
    value: null,
    clearable: true,
    render2: (f) => renderInput(f.value, {}, f),
  },
  {
    key: "length",
    label: "Length",
    value: null,
    clearable: true,
    render2: (f) => renderInput(f.value, {}, f),
  },
])
const useForm = useDyForm(updateFormItems)
const doSearch = () => {
  fetchData()
  pagination.pageNo = 1
}
const doReset = () => {
  fetchData()
  pagination.pageNo = 1
}

// mock http request
async function fetchData() {
  tableLoading.value = true
  const {pageNo, pageSize} = pagination
  const params = naiZealTableSearchRef.value?.getParams<SongType>?.()
  const r = await new Promise<{ data: SongType[], total: number }>((resolve, reject) => {
    setTimeout(() => {
      const start = (pageNo - 1) * pageSize
      const {length, no, title} = params!
      const data = zealData.value.filter(it => (!length || it.length.includes(length)) && (!title || it.title.includes(title)) && (!no || it.no === parseInt(no as string)))
      resolve({
        data: data.slice(start, start + pageSize),
        total: data.length
      })
    }, 1500)
  })
  tableData.value = r.data
  pagination.setTotalSize(r.total)
  tableLoading.value = false
}

const newItem = () => {
  referId.value = '-1'
  useForm.onReset()
  nextTick(() => {
    naiPopupModalRef.value?.toggle?.(true)
  })
}

function upItem(r: SongType) {
  referId.value = r.no
  useForm.setValues(r)
  nextTick(() => {
    naiPopupModalRef.value?.toggle?.(true)
  })
}

function delItem(r: SongType) {
  zealData.value = zealData.value.filter(it2 => it2.no !== r.no)
  message.success('delete successful')
  fetchData()
}

const onSubmit = async () => {
  handleDynamicFormRef.value?.validator().then((v: any) => {
    if (referId.value === '-1') {
      zealData.value.unshift({...v, key: Date.now()})
      message.success('Add successful')
    } else {
      zealData.value = zealData.value.map(it => {
        if (referId.value === it.no) return v as SongType
        return it
      })
      message.success('Update successful')
    }
    nextTick(() => {
      naiPopupModalRef.value?.toggle?.(false)
      fetchData()
    })
  })
}
onMounted(() => {
  fetchData()
})
</script>

<template>
  <NaiZealCard>
    <template #header="{isMobile}">
      <NaiZealTableSearch :isMobile="isMobile" :search-items="searchFormItems" ref="naiZealTableSearchRef"
                          :mobile-drawer="true"
                          title="zeal test" @onReset="doReset"
                          @onSearch="doSearch"/>
    </template>
    <template #controlBtn>
      <n-button type="success" size="small" @click="newItem">Add</n-button>
    </template>
    <template #toolBtn>
      <n-button type="default" size="small" @click="()=>{}">
        Tool...
      </n-button>
    </template>
    <template #default="{tableHeight}">
      <n-data-table
          :loading="tableLoading"
          :columns="columns"
          :data="tableData"
          :bordered="false"
          :style="{ height: tableHeight+'px'}"
          :flex-height="true"
          :scroll-x="600"
      />
    </template>
    <template #footer="{isMobile}">
      <NaiZealTablePaginationControl :is-mobile="isMobile" :pagination="pagination">
        <template #prefix="{ itemCount }">
          Total {{ itemCount }}
        </template>
      </NaiZealTablePaginationControl>
    </template>
    <template #rest>
      <NaiPopupModal :title="referId==='-1'?'add Test':'update Test'" ref="naiPopupModalRef" :on-submit="onSubmit">
        <NaiDynamicForm :items="updateFormItems" ref="handleDynamicFormRef"/>
      </NaiPopupModal>
    </template>
  </NaiZealCard>
</template>

<style scoped>

</style>