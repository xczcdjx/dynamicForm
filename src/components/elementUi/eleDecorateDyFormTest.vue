<script setup lang="ts">
import {ref} from "vue";
import {ElButton} from "element-plus";
import {useDyForm} from "@/";
import {
  type eleDynamicFormRef,
  EleDynamicForm,
  useDecorateForm,
  renderDatePicker
} from "@/elementPlus";

type FormRow = {
  password: string
  job: number
  birthday: number | Date
}
const eleDynamicFormRef = ref<eleDynamicFormRef | null>(null)
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
      showPassword: 'click'
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
    valueField:'value',
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
  const res = eleDynamicFormRef.value?.getResult?.()
  console.log(res)
}
const resetData = () => eleDynamicFormRef.value?.reset?.()
const setData = () => useForm.setValues({
  password: 'element-plus',
  job: 0,
  birthday: new Date(),
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
  <EleDynamicForm :items="formItems" ref="eleDynamicFormRef"/>
  <div class="control">
    <el-button @click="getData" type="success" size="small">get Data</el-button>
    <el-button @click="setData" type="warning" size="small">set Data</el-button>
    <el-button @click="validatorData" type="default" size="small">validate Data</el-button>
    <el-button @click="resetData" type="danger" size="small">reset Data</el-button>
  </div>
</template>

<style scoped>
.control {
  display: flex;
  gap: 5px;
}
</style>