<script setup lang="ts">
import {h, nextTick, onMounted, ref} from "vue";
import {type DataTableColumnKey, type DataTableColumns, NButton, NDataTable, NSpace, useMessage} from "naive-ui";
import {
  NaiPopupModal,
  useDecorateForm,
  NaiZealCard,
  NaiDynamicForm,
  NaiZealTableSearch,
  NaiZealTablePaginationControl,
  NaiZealTableBtnControl,
  renderInput,
  renderInputNumber,
  useZealColumnTool
} from "@/naiveUi";
import type {
  naiPopupModalRef,
  naiDynamicFormRef,
  naiZealTableSearchRef,
} from "@/naiveUi"
import {useDyForm, useReactiveForm, usePagination} from "@/index";

interface SongType {
  no: number | string
  title: string
  length: string
}

const zealData = ref<SongType[]>([
  {no: 3, title: 'Wonderwall', length: '4:18'},
  {no: 4, title: 'Don\'t Look Back in Anger', length: '4:48'},
  {no: 12, title: 'Champagne Supernova', length: '7:27'},
  ...Array.from({length: 50}).map((_, i) => ({no: i + 13, title: `test Data ${i + 1}`, length: `${i * i}`}))
])
const message = useMessage()
const referId = ref<string | number>('-1')
const tableData = ref<SongType[]>([])
const handleDynamicFormRef = ref<naiDynamicFormRef | null>(null)
const naiZealTableSearchRef = ref<naiZealTableSearchRef | null>(null)
const naiPopupModalRef = ref<naiPopupModalRef | null>(null)
const tableLoading = ref<boolean>(false)
const selectOpts = ref<(number | string)[]>([])
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

const {tableColumns, naiZealCardRef} = useZealColumnTool<SongType>(({isMobile}) => [
  {
    type: 'selection',
    width: 35,
  },
  {
    title: 'No',
    key: 'no',
    width: 80
  },
  {
    title: 'Title',
    key: 'title',
  },
  {
    title: 'Length',
    key: 'length'
  },
  {
    key: 'actions',
    title: "Actions", fixed: 'right', width: isMobile.value ? 100 : 180, render: row => h(
        NaiZealTableBtnControl, {
          dropDownText:'more',
          isMobile: isMobile.value,
          btnItems: [
            {
              title: 'Update',
              key: "up",
              onSelect: () => upItem(row),
            },
            {
              title: 'Delete',
              key: "del",
              type: 'error',
              onSelect: () => delItem(row)
            }
          ],
        },
        /*{
          text:()=>h('span',{},'ttt')
        }*/
    )
  },
], {align: 'center'})
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

function rowKey(row: SongType) {
  return row.no
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

const deleteAll = () => {
  zealData.value = zealData.value.filter(it2 => !selectOpts.value.includes(it2.no))
  message.success('delete all successful')
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
const handleSelectionChange = (v: DataTableColumnKey[]) => {
  selectOpts.value = v
}
onMounted(() => {
  fetchData()
})
</script>

<template>
  <NaiZealCard ref="naiZealCardRef" :observe-delay="10">
    <template #header="{isMobile}">
      <NaiZealTableSearch :isMobile="isMobile" :search-items="searchFormItems" ref="naiZealTableSearchRef"
                          :mobile-drawer="true"
                          title="zeal test" @onReset="doReset"
                          @onSearch="doSearch"/>
    </template>
    <template #controlBtn>
      <n-button type="success" size="small" @click="newItem">Add</n-button>&nbsp;
      <n-button type="error" size="small" @click="deleteAll" :disabled="!selectOpts.length">Del Selected</n-button>
    </template>
    <template #toolBtn>
      <n-button type="default" size="small" @click="()=>{}">
        Tool...
      </n-button>
    </template>
    <template #default="{tableHeight,isMobile}">
      <n-data-table
          :size="isMobile?'small':'large'"
          :row-key="rowKey"
          :loading="tableLoading"
          :columns="tableColumns"
          :data="tableData"
          :bordered="false"
          :style="{ height: tableHeight+'px'}"
          :flex-height="true"
          :scroll-x="600"
          @update:checked-row-keys="handleSelectionChange"
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