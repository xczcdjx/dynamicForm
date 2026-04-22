<script setup lang="ts">
import {computed, h, nextTick, onMounted, ref} from "vue";
import {ElMessage, ElButton, ElSpace} from "element-plus";
import {
  ElePopupModal,
  useDecorateForm,
  EleZealCard,
  EleDynamicForm,
  EleZealTableSearch,
  EleZealTablePaginationControl,
  EleZealTable,
  renderInput,
  renderInputNumber, EleZealTableBtnControl
} from "@/elementPlus";
import type {
  eleZealCardRef,
  elePopupModalRef,
  eleDynamicFormRef,
  eleZealTableSearchRef
} from "@/elementPlus"
import {type SongType, zealData} from "./dataTest";
import {useDyForm, useReactiveForm, usePagination} from "@/index.ts";
import type {ZealColumn} from "@/types/form";

const referId = ref<string | number>('-1')
const tableData = ref<SongType[]>([])
const eleZealCardRef = ref<eleZealCardRef | null>(null)
const handleDynamicFormRef = ref<eleDynamicFormRef | null>(null)
const naiZealTableSearchRef = ref<eleZealTableSearchRef | null>(null)
const naiPopupModalRef = ref<elePopupModalRef | null>(null)
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
const getColumns = (isMobile: boolean) => [
  {type: 'selection', width: 55},
  {type: 'expand', render2: row => h('div', {}, JSON.stringify(row, null, 2))},
  {label: "No", prop: "no", width: 80},
  {label: "Title", prop: "title", slot: "title"},
  {label: "Length", prop: "length"},
  {
    label: "Actions", fixed: 'right', width: 160, render2: row => h(
        EleZealTableBtnControl, {
          isMobile,
          btnItems: [
            {
              title: 'Update',
              key: "up",
              onSelect: () => upItem(row),
            },
            {
              title: 'Delete',
              key: "del",
              type: 'danger',
              onSelect: () => delItem(row)
            }
          ]
        }
    )
  },
] as ZealColumn<SongType>[];
const tableColumns = computed(() => {
  const isMobile = eleZealCardRef.value?.getSizeObj?.()?.isMobile ?? false
  return getColumns(isMobile)
})
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
  ElMessage.success('delete successful')
  fetchData()
}

const deleteAll = () => {
  zealData.value = zealData.value.filter(it2 => !selectOpts.value.includes(it2.no))
  ElMessage.success('delete all successful')
  fetchData()
}
const onSubmit = async () => {
  handleDynamicFormRef.value?.validator().then((v: any) => {
    if (referId.value === '-1') {
      zealData.value.unshift({...v, key: Date.now()})
      ElMessage.success('Add successful')
    } else {
      zealData.value = zealData.value.map(it => {
        if (referId.value === it.no) return v as SongType
        return it
      })
      ElMessage.success('Update successful')
    }
    nextTick(() => {
      naiPopupModalRef.value?.toggle?.(false)
      fetchData()
    })
  })
}
const handleSelectionChange = (v: SongType[]) => {
  selectOpts.value = v.map(it => it.no)
}
onMounted(() => {
  fetchData()
})
</script>

<template>
  <EleZealCard ref="eleZealCardRef">
    <template #header="{isMobile}">
      <EleZealTableSearch :is-mobile="isMobile" :search-items="searchFormItems" ref="naiZealTableSearchRef"
                          :mobile-drawer="true"
                          title="zeal test" @onReset="doReset"
                          @onSearch="doSearch">
        <template #drawerBtn="{openDrawer}">
          <el-button @click="openDrawer">+</el-button>
        </template>
      </EleZealTableSearch>
    </template>
    <template #controlBtn>
      <el-button type="success" size="small" @click="newItem">Add</el-button>
      <el-button type="danger" size="small" @click="deleteAll" :disabled="!selectOpts.length">Del Selected</el-button>
    </template>
    <template #toolBtn>
      <el-button type="default" size="small" @click="()=>{}">
        Tool...
      </el-button>
    </template>
    <template #default="{tableHeight}">
      <EleZealTable :data="tableData" :columns="tableColumns" :max-height="tableHeight" :loading="tableLoading"
                    @selection-change="handleSelectionChange">
        <template #title="{ row }">
          <el-tag>{{ row.title }}</el-tag>
        </template>
        <template #empty>
          <p> no data</p>
        </template>
      </EleZealTable>
    </template>
    <template #footer="{isMobile}">
      <EleZealTablePaginationControl :is-mobile="isMobile" :pagination="pagination"/>
    </template>
    <template #rest>
      <ElePopupModal :title="referId==='-1'?'add Test':'update Test'" ref="naiPopupModalRef" :on-submit="onSubmit">
        <EleDynamicForm :items="updateFormItems" ref="handleDynamicFormRef"/>
      </ElePopupModal>
    </template>
  </EleZealCard>
</template>

<style scoped>

</style>