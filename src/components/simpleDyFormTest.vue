<script setup lang="ts">
import {ref} from "vue";
import {NButton} from "naive-ui";
import {useDyForm, useReactiveForm} from "../../dist";
import {type naiDynamicFormRef, NaiDynamicForm, renderInput} from "../../dist/naiveUi";
// import {useDyForm, useReactiveForm} from "@/hooks/useDyForm";
// import {type naiDynamicFormRef, NaiDynamicForm, renderInput} from "@/naiveUi";
type FormRow = {
  username: string
  password: string
}
const naiDynamicFormRef = ref<naiDynamicFormRef | null>(null)
const formItems = useReactiveForm<FormRow>([
  {
    key: "username",
    label: "姓名",
    value: ref<string | null>(null),
    clearable: true,
    placeholder: '请输入姓名',
    required: true, // 是否必填 (简化rules规则)
    render2: f => renderInput(f.value, {}, f),
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
  },
])
const useForm = useDyForm<FormRow>(formItems)
const getData = () => {
  // const res=useForm.getValues() // 或
  const res = naiDynamicFormRef.value?.getResult()
  console.log(res)
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
  naiDynamicFormRef.value.validator().then(data => {
    console.log(data)
  }).catch(err => {
    console.log(err)
  })
}
</script>

<template>
  <NaiDynamicForm :items="formItems" ref="naiDynamicFormRef"/>
  <n-button @click="getData" type="success" size="small">get Data</n-button>&nbsp;
  <n-button @click="setData" type="warning" size="small">set Data</n-button>&nbsp;
  <n-button @click="validatorData" type="default" size="small">validate Data</n-button>
</template>

<style scoped>

</style>