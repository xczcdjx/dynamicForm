<script setup lang="ts">
import {h, ref} from "vue";
import {ElButton, ElInput} from "element-plus";
import {useDyForm, useReactiveForm} from "@/hooks/useDyForm";
import {type eleDynamicFormRef, type eleDynamicInputRef, EleDynamicForm, EleDynamicInput} from "@/elementPlus";
import type {FormItemRule, FormRules} from "element-plus";
import ElInputTest from "../subside/EleInputTest.vue";

type FormRow = {
  name: string
  desc: string
  json: object
}
const eleDynamicFormRef = ref<eleDynamicFormRef | null>(null)
const eleDynamicInputRef = ref<eleDynamicInputRef | null>(null)
const formItems = useReactiveForm<FormRow, FormRules | FormItemRule>([
  {
    key: "name",
    label: "姓名",
    value: null,
    clearable: true,
    placeholder: '请输入姓名',
    required: true,
    render2: f => {
      const {value, ...restF} = f
      return h(ElInput, {
        ...restF,
        modelValue: f.value.value, "onUpdate:modelValue"(v) {
          f.value.value = v
        }
      })
    },
  },
  {
    key: "desc",
    label: "描述",
    value: ref<string | null>(null),
    clearable: true,
    placeholder: '请输入描述',
    required: true,
    type: 'textarea',
    render2: f => h(ElInputTest, {
      ...f,
      value: f.value.value, "onUpdate:value"(v) {
        f.value.value = v
      }
    }),
  },
  {
    key: "json",
    label: "Json",
    value: {},
    rule: {
      required: true,
      validator(rule: any, value: any, callback: any) {
        return Object.keys(value).length > 0
      },
      trigger: 'blur',
      message: 'json 不能为空'
    },
    render2: f => h(EleDynamicInput, {
      modelValue: f.value.value, "onUpdate:modelValue"(v) {
        f.value.value = v
      },
      isController: true,
      ref: eleDynamicInputRef
    }),
  },
])
const useForm = useDyForm<FormRow>(formItems)
const getData = () => {
  console.log(useForm.getValues())
}
const resetData = () => {
  useForm.onReset()
  eleDynamicInputRef.value?.onSet({})
}
const setData = () => {
  useForm.setValues({
    name: 'Element Plus',
    desc: `A Vue 3 based component library for designers and developers`
  })
  eleDynamicInputRef.value?.onSet?.({
    question: 'how are you?',
    answer: "I'm fine,Thank you"
  })
}
const validatorData = () => {
  // 校验
  eleDynamicFormRef.value.validator().then(data => {
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