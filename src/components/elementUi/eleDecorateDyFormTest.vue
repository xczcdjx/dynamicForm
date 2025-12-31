<script setup lang="ts">
import {ref} from "vue";
import {ElButton} from "element-plus";
import {useDyForm} from "../../../dist";
import {
  type eleDynamicFormRef,
  EleDynamicForm,
  useDecorateForm,
  renderDatePicker
} from "../../../dist/elementPlus";

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