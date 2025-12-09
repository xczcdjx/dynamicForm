<script setup lang="ts">

import {NaiDynamicForm} from "@/naiveUi";
import {FormItem} from "@/types/form";
import {ref} from "vue";
import {renderInput, renderSelect} from "@/naiveUi/hooks/renderForm";
import {MessageApi,NButton} from "naive-ui";

type FormRow = {
  name: string
  sex: number
}
const naiDynamicFormRef=ref<InstanceType<typeof NaiDynamicForm>|null>(null)
const comSexRenderMore = (gender: string[] = ["男", "女"], skip: number = 0) => {
  return gender.map((it, i) => ({label: it, value: i + skip}));
};

function comValidator<T extends (f: FormItem, msg: MessageApi) => boolean>(cb?: T) {
  return cb || ((f: FormItem, msg: MessageApi): boolean => {
    if (!f.value.value) {
      msg.error(f.label + "不能为空");
      return false;
    }
    return true;
  });
}
const rules={
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
const formItems: FormItem<FormRow>[] = [
  {
    key: "name",
    label: "姓名",
    value: ref(null),
    render: f => renderInput(f.value, {placeholder: "请输入姓名"}),
    required: true,
    validator: comValidator()
  },
  {
    key: "sex",
    label: "姓别",
    value: ref(null),
    render: f => renderSelect(f.value, comSexRenderMore(), {placeholder: "请选择性别"}),
  }
];
const getData = () => {
  naiDynamicFormRef.value?.validator().then((data)=>{
    console.log(data)
  }).catch(r=>{
    console.log(r)
  })
  // console.log(naiDynamicFormRef.value?.generatorResults())
}
</script>

<template>
  <NaiDynamicForm :rules="rules" :items="formItems" ref="naiDynamicFormRef"/>
  <NaiDynamicForm :items="formItems" preset="grid"/>
  <n-button @click="getData" type="success">get Data</n-button>
</template>

<style scoped>

</style>