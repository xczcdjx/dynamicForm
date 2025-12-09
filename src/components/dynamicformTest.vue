<script setup lang="ts">

import {ref, shallowReactive} from "vue";
import {renderInput, renderSelect} from "@/naiveUi/hooks/renderForm";
import {MessageApi, NButton} from "naive-ui";
import {DyFormItem} from "@/types/form.ts";
import NaiDynamicForm from "@/naiveUi/NaiDynamicForm";

type FormRow = {
  name: string
  sex: number
}
const naiDynamicFormRef = ref<InstanceType<typeof NaiDynamicForm> | null>(null)
const comSexRenderMore = (gender: string[] = ["男", "女"], skip: number = 0) => {
  return gender.map((it, i) => ({label: it, value: i + skip}));
};
const rules = {
  name: {
    required: true,
    message: '请输入',
    trigger: ['blur']
  },
  sex: {
    required: true,
    message: '请选择',
    trigger: ['blur']
  }
}
const formItems: DyFormItem<FormRow>[] = [
  shallowReactive({
    key: "name",
    label: "姓名",
    value: ref<string | null>(null),
    clearable: true,
    type: 'password',
    placeholder: '请输入姓名',
    onChange(v,f){
      console.log(v,f)
    },
    render2: f => renderInput(f.value, {...f}),
  }),
  shallowReactive({
    key: "sex",
    label: "性别",
    options: [
      {label1: '男', value1: 0},
      {label1: '女', value1: 1},
    ],
    placeholder: "请选择性别",
    labelField:'label1',
    valueField:'value1',
    value: ref<number | null>(null),
    render2: f => renderSelect(f.value, [], {...f}),
  }),
  shallowReactive({
    key: "desc",
    label: "介绍",
    placeholder: "请输入介绍",
    value: ref<string | null>(null),
    type: 'textarea',
    rows: 5,
    render2: f => renderInput(f.value, {...f}),
    required: true
  }),
];
const getData = () => {
  naiDynamicFormRef.value?.validator().then((data) => {
    console.log(data)
  }).catch(r => {
    console.log(r)
  })
  // console.log(naiDynamicFormRef.value?.generatorResults())
}
const setData = () => {
  formItems.forEach(it => {
    it.disabled = false
  })
}
</script>

<template>
  <NaiDynamicForm :rules="rules" :items="formItems" ref="naiDynamicFormRef"/>
  <!--  <NaiDynamicForm :items="formItems" preset="grid"/>-->
  <n-button @click="getData" type="success">get Data</n-button>&nbsp;
  <n-button @click="setData" type="success">set Data</n-button>
</template>

<style scoped>

</style>