# dynamicformdjx

基于 **Vue 3** 的动态表单及录入。

[Document](https://xczcdjx.github.io/dynamicFormDoc/v3/install.html)

[Vue2 版本](https://www.npmjs.com/package/dynamicformdjx-vue2)

[React 版本](https://www.npmjs.com/package/dynamicformdjx-react)

## 概述

> 新增综合`CRUD`模板

`DynamicForm` 一个灵活且动态的表单组件，使用数组，简化模版操作，提供多种hook快速操作表单等。

- 简化template代码，快速处理表单
- 提供render2函数渲染表单项，使用函数渲染值或自定义h函数
- 提供多种hooks函数，快速处理数据值

`DynamicInput` 组件是一个灵活且动态的表单输入组件，允许用户添加、修改和删除键值对。它提供了多种自定义选项，如按钮文本、表单布局和输入过滤

- 支持通过 `v-model` 双向绑定任意对象，(包含受控和非受控) 可动态增删字段
- 支持将值解析为：字符串 / 数字 / 数组（字符串数组、数字数组）
- 文案、样式、数组分隔符等均可配置

---

## 安装

```bash
# 任意一种
npm install dynamicformdjx
# or
yarn add dynamicformdjx
# or
pnpm add dynamicformdjx
```

### 综合`CRUD` template **新**

> (依赖于naive ui或element plus组件库,请配合一起使用)

#### 与Naive ui配合

```vue

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
    renderInput,
    renderInputNumber,
  } from "dynamicformdjx/naiveUi";
  import type {
    naiPopupModalRef,
    naiDynamicFormRef,
    naiZealTableSearchRef
  } from "dynamicformdjx/naiveUi"
  import {useDyForm, useReactiveForm, usePagination} from "dynamicformdjx";

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
  const columns: DataTableColumns<SongType> = [
    {
      type: 'selection'
    },
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
  <NaiZealCard>
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
    <template #default="{tableHeight}">
      <n-data-table
          :row-key="rowKey"
          :loading="tableLoading"
          :columns="columns"
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
```

#### 与Element-plus配合

```vue

<script setup lang="ts">
  import {h, nextTick, onMounted, ref} from "vue";
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
    renderInputNumber,
  } from "dynamicformdjx/elementPlus";
  import type {
    elePopupModalRef,
    eleDynamicFormRef,
    eleZealTableSearchRef
  } from "dynamicformdjx/elementPlus"
  import {useDyForm, useReactiveForm, usePagination} from "dynamicformdjx";
  import type {ZealColumn} from "dynamicformdjx/types/form";

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
  const referId = ref<string | number>('-1')
  const tableData = ref<SongType[]>([])
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
  const columns: ZealColumn<SongType>[] = [
    {type: 'selection', width: 55},
    {type: 'expand', render2: row => h('div', {}, JSON.stringify(row, null, 2))},
    {label: "No", prop: "no", width: 80},
    {label: "Title", prop: "title", slot: "title"},
    {label: "Length", prop: "length"},
    {
      label: "Actions", fixed: 'right', width: 160, render2: (row) => h(
          ElSpace, {}, [
            h(ElButton,
                {
                  size: 'small',
                  onClick: () => upItem(row)
                },
                'update'),
            h(ElButton,
                {
                  size: 'small',
                  type: 'danger',
                  onClick: () => delItem(row)
                },
                'delete')
          ]
      )
    },
  ];

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
  <EleZealCard>
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
      <EleZealTable :data="tableData" :columns="columns" :max-height="tableHeight" :loading="tableLoading"
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
```

### 动态表单

#### 与Naive ui配合

##### 简单表单

> 还有自定义表单，装饰表单请参考文档

```vue

<script setup lang="ts">
  import {ref} from "vue";
  import {NButton} from "naive-ui";
  import {useDyForm, useReactiveForm} from "dynamicformdjx";
  import {type naiDynamicFormRef, NaiDynamicForm, renderInput, renderRadioGroup} from "dynamicformdjx/naiveUi";
  import type {PresetType} from "dynamicformdjx/types/index";

  type FormRow = {
    username: string
    password: string
    preset: PresetType
  }
  const naiDynamicFormRef = ref<naiDynamicFormRef | null>(null)
  const presetType = ref<PresetType>('fullRow')
  const formItems = useReactiveForm<FormRow>([
    {
      key: "username",
      label: "姓名",
      value: ref<string | null>(null),
      clearable: true,
      placeholder: '请输入姓名',
      required: true, // 是否必填 (简化rules规则)
      render2: f => renderInput(f.value, {}, f),
      span: 6
    },
    {
      key: "password",
      label: "密码",
      value: ref<string | null>(null),
      clearable: true,
      type: 'password',
      required: true,
      placeholder: '请输入密码',
      render2: f => renderInput(f.value, {showPasswordOn: 'click'}, f),
      span: 8,
      offset: 2,
      requiredHint: l => `${l} is not empty`
    },
    {
      key: "preset",
      label: "表格预设",
      value: ref<PresetType | null>(presetType.value),
      render2: f => renderRadioGroup(f.value, [
        {label: '整行', value: 'fullRow'},
        {label: '表格', value: 'grid'},
      ], {name: 'preset'}, f),
      onChange: (v) => {
        presetType.value = v
      }
    },
  ])
  const useForm = useDyForm<FormRow>(formItems)
  const getData = () => {
    // const res=useForm.getValues() // 或
    const res = naiDynamicFormRef.value?.getResult?.()
    console.log(res)
  }
  const resetData = () => {
    // useForm.onReset() // 或
    naiDynamicFormRef.value?.reset?.()
  }
  const setData = () => {
    // 隐藏username
    // useForm.setHidden(true, ['username'])
    // 设置username 为不可输入
    // useForm.setDisabled(true, ['username'])
    //  直接修改
    useForm.setValues({
      username: 'naive-ui',
      password: '520'
    })
  }
  const validatorData = () => {
    // 校验
    naiDynamicFormRef.value?.validator().then(data => {
      console.log(data)
    }).catch(err => {
      console.log(err)
    })
  }
</script>

<template>
  <NaiDynamicForm :items="formItems" ref="naiDynamicFormRef" :preset="presetType">
    <template #header>
      <h3>与Naive ui结合简单表单</h3>
    </template>
    <template #footer>
      <div class="control">
        <n-button @click="getData" type="success" size="small">get Data</n-button>
        <n-button @click="setData" type="warning" size="small">set Data</n-button>
        <n-button @click="validatorData" type="default" size="small">validate Data</n-button>
        <n-button @click="resetData" type="error" size="small">reset Data</n-button>
      </div>
    </template>
  </NaiDynamicForm>
</template>

<style scoped>
  h3 {
    text-align: center;
    margin: 0 0 10px 0;
  }

  .control {
    display: flex;
    gap: 5px;
  }
</style>
```

#### 与Element-plus配合

> (只是导入从"dynamicformdjx/elementPlus"中，类型方法与上方naive ui一致)

##### 简单表单

```vue

<script setup lang="ts">
  import {ref} from "vue";
  import {ElButton} from "element-plus";
  import {useDyForm, useReactiveForm} from "dynamicformdjx";
  import {type eleDynamicFormRef, renderInput, renderRadioGroup, EleDynamicForm} from "dynamicformdjx/elementPlus";
  import type {PresetType} from "dynamicformdjx/types/index";

  type FormRow = {
    username: string
    password: string
    preset: PresetType
  }
  const eleDynamicFormRef = ref<eleDynamicFormRef | null>(null)
  const presetType = ref<PresetType>('fullRow')
  const formItems = useReactiveForm<FormRow>([
    {
      key: "username",
      label: "姓名",
      value: ref<string | null>(null),
      clearable: true,
      placeholder: '请输入姓名',
      required: true, // 是否必填 (简化rules规则)
      render2: f => renderInput(f.value, {}, f),
      span: 8
    },
    {
      key: "password",
      label: "密码",
      value: ref<string | null>(null),
      clearable: true,
      type: 'password',
      required: true,
      placeholder: '请输入密码',
      render2: f => renderInput(f.value, {showPassword: true}, f),
      span: 8,
      offset: 2,
      requiredHint: l => `${l} is not empty`
    },
    {
      key: "preset",
      label: "表格预设",
      value: ref<PresetType | null>(presetType.value),
      render2: f => renderRadioGroup(f.value, [
        {label: '整行', value: 'fullRow'},
        {label: '表格', value: 'grid'},
      ], {name: 'preset'}, f),
      onChange: (v) => {
        presetType.value = v
      }
    },
  ])
  const useForm = useDyForm<FormRow>(formItems)
  const getData = () => {
    const res = eleDynamicFormRef.value?.getResult?.()
    console.log(res)
  }
  const resetData = () => eleDynamicFormRef.value?.reset?.()
  const setData = () => useForm.setValues({
    username: 'element-plus',
    password: '520'
  })
  const validatorData = () => {
    // 校验
    eleDynamicFormRef.value?.validator().then(data => {
      console.log(data)
    }).catch(err => {
      console.log(err)
    })
  }
</script>

<template>
  <EleDynamicForm :items="formItems" ref="eleDynamicFormRef" :preset="presetType">
    <template #header>
      <h3>与Element plus结合简单表单</h3>
    </template>
    <template #footer>
      <div class="control">
        <el-button @click="getData" type="success" size="small">get Data</el-button>
        <el-button @click="setData" type="warning" size="small">set Data</el-button>
        <el-button @click="validatorData" type="default" size="small">validate Data</el-button>
        <el-button @click="resetData" type="danger" size="small">reset Data</el-button>
      </div>
    </template>
  </EleDynamicForm>
</template>

<style scoped>
  h3 {
    text-align: center;
    margin: 0 0 10px 0;
  }

  .control {
    display: flex;
    gap: 5px;
  }
</style>
```

### 动态录入

> 此录入无需组件库依赖

#### 1.单组件

```vue

<script setup lang="ts">
  import {ref} from "vue";
  import {DynamicInput, type dynamicInputRef} from "dynamicformdjx";

  const test = ref<{ a: string, b: number, c: number[] }>({
    a: 'Hello world',
    b: 1314,
    c: [5, 2, 0]
  })
  const dyRef = ref<dynamicInputRef>()
  const setData = () => {
    dyRef.value?.onSet?.({test: "helloWorld"})
  }
</script>

<template>
  <p>Input</p>
  <DynamicInput v-model="test" is-controller ref="dyRef"/>
  <p>Result</p>
  <pre>{{ test }}</pre>
  <div>
    <button @click="setData">setData helloWorld</button>
  </div>
</template>
```

#### 2.级联基本使用

```vue

<script setup lang="ts">
  import {ref} from "vue";
  import {dynamicCascadeInputRef, DynamicCascadeInput} from "dynamicformdjx";

  const dyCascadeRef = ref<dynamicCascadeInputRef | null>(null)
  const test2 = ref({
    a: {
      b: {
        c: {
          d: {
            e: "hello world"
          }
        }
      }
    },
    aa: [5, 2, 0],
    aaa: 1314
  })
  const setData = () => {
    dyCascadeRef.value?.onSet?.({a: 8888})
  }
</script>

<template>
  <p>Cascade dynamicInput</p>
  <dynamic-cascade-input v-model="test2" :depth="5" ref="dyCascadeRef" is-controller/>
  <pre>{{ test2 }}</pre>
  <p>Result</p>
  <button @click="setData">setData 8888</button>
</template>
```