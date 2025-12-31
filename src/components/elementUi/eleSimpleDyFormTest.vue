<script setup lang="ts">
import {h, ref} from "vue";
import {ElButton, ElInput} from "element-plus";
// import {useDyForm, useReactiveForm} from "../../../dist";
// import {type naiDynamicFormRef, NaiDynamicForm, renderInput,renderRadioGroup} from "../../../dist/naiveUi";
// import {PresetType} from "../../../dist/types";
import {useDyForm, useReactiveForm} from "@/hooks/useDyForm";
import {type eleDynamicFormRef, renderInput, renderRadioGroup, EleDynamicForm} from "@/elementPlus";
import {PresetType} from "@/types";

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
  // const res=useForm.getValues() // 或
  const res = eleDynamicFormRef.value?.getResult?.()
  console.log(res)
}
const resetData = () => {
  // useForm.onReset() // 或
  eleDynamicFormRef.value?.reset?.()
}
const setData = () => {
  // 隐藏username
  // useForm.setHidden(true, ['username'])
  // 设置username 为不可输入
  // useForm.setDisabled(true, ['username'])
  //  直接修改
  useForm.setValues({
    username: 'element-plus',
    password: '520'
  })
}
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
      <h3>基本表单</h3>
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