<script setup lang="ts">
import {h, ref} from "vue";
import {NButton} from "naive-ui";
import {useDyForm} from "@/";
import {
  type naiDynamicFormRef,
  NaiDynamicForm,
  useDecorateForm,
  renderDatePicker
} from "@/naiveUi";
/*import {useDyForm} from "../../dist";
import {
  type naiDynamicFormRef,
  NaiDynamicForm,
  useDecorateForm,
  renderDatePicker
} from "../../dist/naiveUi";*/

type FormRow = {
  password: string
  job: number
  birthday: number
}
const naiDynamicFormRef = ref<naiDynamicFormRef | null>(null)
const formItems = useDecorateForm<FormRow>([
  {
    key: "password",
    label: "密码",
    value: null,
    clearable: true,
    placeholder: '请输入密码',
    required: true,
    type: 'password',
    renderType: 'renderInput',
    renderProps: {
      showPasswordOn: 'click'
    }
  },
  {
    key: "job",
    label: "职位",
    value: null,
    clearable: true,
    options: ['前端', '后端'].map((label, value) => ({label, value})),
    renderType: 'renderSelect',
  },
  {
    key: "birthday",
    label: "生日",
    value: null,
    render2: f => renderDatePicker(f.value, {type: 'datetime'}, f),
  },
  {
    key: "future",
    label: "未来",
    value: [
      {label: '你没见过不等于没有', value: 'hello world 1'},
      {
        label: '不要给自己设限',
        value: 'hello world 2'
      },
      {
        label: '不要说连升两级',
        value: 'hello world 3'
      },
      {
        label: '直接升到 CEO 都是有可能的',
        value: 'hello world 4'
      }
    ],
    renderType: 'renderDynamicTags'
  },
  {
    key: "checkbox",
    label: "复选",
    value: null,
    renderType: 'renderCheckbox',
  },
  {
    key: "slider",
    label: "滑块",
    value: 0,
    renderType: 'renderSlider',
  },
  {
    key: "inputNumber",
    label: "滑块",
    value: 0,
    renderType: 'renderInputNumber',
  },
])
const useForm = useDyForm<FormRow>(formItems)
const getData = () => {
  // const res=useForm.getValues() // 或
  const res = naiDynamicFormRef.value?.getResult()
  console.log(res)
}
const resetData = () => {
  naiDynamicFormRef.value?.reset()
}
const setData = () => {
  useForm.setValues({
    password: 'naive-ui',
    job: 0,
    birthday: Date.now(),
  })
}
const validatorData = () => {
  // 校验
  naiDynamicFormRef.value.validator().then(data => {
    console.log(data)
  }).catch(err => {
    console.log(err)
  })
}
</script>

<template>
  <NaiDynamicForm :items="formItems" ref="naiDynamicFormRef"/>
  <div class="control">
    <n-button @click="getData" type="success" size="small">get Data</n-button>
    <n-button @click="setData" type="warning" size="small">set Data</n-button>
    <n-button @click="validatorData" type="default" size="small">validate Data</n-button>
    <n-button @click="resetData" type="error" size="small">reset Data</n-button>
  </div>
</template>

<style scoped>
.control {
  display: flex;
  gap: 5px;
}
</style>