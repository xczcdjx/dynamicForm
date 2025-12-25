<script setup lang="ts">
import {h, ref} from "vue";
import {NButton, NInput} from "naive-ui";
import {useDyForm, useReactiveForm} from "../../dist";
import {type naiDynamicFormRef, NaiDynamicForm, NaiDynamicInput, type naiDynamicInputRef}  from "../../dist/naiveUi";
// import {useDyForm, useReactiveForm} from "@/hooks/useDyForm";
// import {type naiDynamicFormRef, NaiDynamicForm, NaiDynamicInput, type naiDynamicInputRef} from "@/naiveUi";
import type {FormItemRule, FormRules} from "naive-ui/es/form/src/interface";
import InputTest from "@/components/subside/InputTest.vue";

type FormRow = {
  name: string
  desc: string
  json: object
}
const naiDynamicFormRef = ref<naiDynamicFormRef | null>(null)
const naiDynamicInputRef = ref<naiDynamicInputRef | null>(null)
const formItems = useReactiveForm<FormRow, FormRules | FormItemRule>([
  {
    key: "name",
    label: "姓名",
    value: ref<string | null>(null),
    clearable: true,
    placeholder: '请输入姓名',
    required: true,
    render2: f => h(NInput, {
      ...f,
      value: f.value.value, "onUpdate:value"(v) {
        f.value.value = v
      }
    }),
  },
  {
    key: "desc",
    label: "描述",
    value: ref<string | null>(null),
    clearable: true,
    placeholder: '请输入姓名',
    required: true,
    type: 'textarea',
    render2: f => h(InputTest, {
      ...f,
      value: f.value.value, "onUpdate:value"(v) {
        f.value.value = v
      }
    }),
  },
  {
    key: "json",
    label: "Json",
    value: ref<object>({}),
    rule: {
      required: true,
      validator(_: FormItemRule, value: object) {
        return Object.keys(value).length > 0
      },
      trigger: ['blur', 'change'],
      message: 'json 不能为空'
    },
    render2: f => h(NaiDynamicInput, {
      modelValue: f.value.value, "onUpdate:modelValue"(v) {
        f.value.value = v
      },
      isController: true,
      ref: naiDynamicInputRef
    }),
  },
])
const useForm = useDyForm<FormRow>(formItems)
const getData = () => {
  console.log(useForm.getValues())
}
const resetData = () => {
  useForm.onReset()
  naiDynamicInputRef.value?.onSet({})
}
const setData = () => {
  useForm.setValues({
    name: 'naive-ui',
    desc:`A Vue 3 Component Library Fairly Complete, Theme Customizable, Uses TypeScript, Fast Kinda Interesting`
  })
  naiDynamicInputRef.value?.onSet({
    question: 'how are you?',
    answer: "I'm fine,Thank you"
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