<script setup lang="ts">
import {ref} from "vue";
import {NButton} from "naive-ui";
import {FormRules, FormItemRule} from "naive-ui/es/form/src/interface";

import {
  naiDynamicFormRef,
  NaiDynamicForm,
  renderCheckboxGroup, renderDatePicker,
  renderInput, renderPopSelect,
  renderRadioButtonGroup, renderRadioGroup,
  renderSelect, renderSwitch, renderTimePicker, renderTreeSelect
} from "../../../dist/naiveUi";

import {useDyForm, useReactiveForm} from "../../../dist";

type FormRow = {
  username: string
  password: string
  gender: number
  description: string
  email: string
  birthday: string
  desc: string
  sex: number
  birthdayT: number
  admin: number
  favorite: number[]
  job: number
  job2: number
  job3: number
}
const rules: FormRules = {
  username: {
    required: true,
    message: '请输入',
    trigger: ['blur']
  },
}
const naiDynamicFormRef = ref<naiDynamicFormRef>(null)
const formItems = useReactiveForm<FormRow, FormRules | FormItemRule | FormItemRule[]>(
    [
      {
        key: "username",
        label: "姓名",
        value: ref<string | null>(null),
        clearable: true,
        placeholder: '请输入姓名',
        rule: {
          required: true,
        },
        render2: f => renderInput(f.value, {}, f),
      },
      {
        key: "password",
        label: "密码",
        value: ref<string | null>(null),
        clearable: true,
        type: 'password',
        placeholder: '请输入密码',
        render2: f => renderInput(f.value, {showPasswordOn: 'click',}, f),
      },
      {
        key: "desc",
        label: "介绍",
        placeholder: "请输入介绍",
        value: ref<string | null>(null),
        type: 'textarea',
        rows: 3,
        render2: f => renderInput(f.value, {}, f),
      },
      {
        key: "sex",
        label: "性别",
        labelField: 'label1',
        valueField: 'value1',
        value: ref<number | null>(null),
        render2: f => renderRadioGroup(f.value, [
          // @ts-ignore
          {label1: '男', value1: 0}, {label1: '女', value1: 1},
        ], {}, f),
      },
      {
        key: "favorite",
        label: "爱好",
        labelField: 'fl',
        valueField: 'fv',
        sort: 1,
        options: [
          {fl: '吃饭', fv: 0},
          {fl: '睡觉', fv: 1},
          {fl: '打豆豆', fv: 2},
        ],
        value: ref<number[]>([]),
        render2: f => renderCheckboxGroup(f.value, [], {}, f),
      },
      {
        key: "job",
        label: "职位",
        value: ref<number | null>(null),
        clearable: true,
        render2: f => renderSelect(f.value, ['前端', '后端'].map((label, value) => ({label, value})), {}, f),
      },
      {
        key: "job2",
        label: "职位2",
        value: ref<number | null>(null),
        labelField: 'l',
        valueField: 'v',
        render2: f => renderPopSelect(f.value, ['Drive My Car', 'Norwegian Wood'].map((label, index) => ({
          l: label,
          v: label
        })), {trigger: 'click'}, f),
      },
      {
        key: "job3",
        label: "职位3",
        value: ref<number | null>(null),
        valueField: 'key',
        render2: f => renderTreeSelect(f.value, [
          {
            label: 'Rubber Soul',
            key: '1',
            children: [
              {
                label: 'Everybody\'s Got Something to Hide Except Me and My Monkey',
                key: '1-1'
              },
              {
                label: 'Drive My Car',
                key: '1-2',
                disabled: true
              },]
          }
        ], {}, f),
      },
      {
        key: "admin",
        label: "管理员？",
        value: ref<number | null>(null),
        render2: f => renderSwitch(f.value, {}, f),
      },
      {
        key: "birthday",
        label: "生日",
        value: ref<number | null>(null),
        render2: f => renderDatePicker(f.value, {type: 'datetime'}, f),
      },
      {
        key: "birthdayT",
        label: "时间",
        value: ref<number | null>(null),
        render2: f => renderTimePicker(f.value, {}, f),
      },
    ])
const useForm = useDyForm<FormRow>(formItems)
const getData = () => {
  console.log(useForm.getValues())
}
const setData = () => {
  useForm.setValues({
    username: '1111',
    password: '321321123'
  })
}
const setDisabled = () => {
  useForm.setDisabled(true)
}
const validatorData = () => {
  // 校验
  naiDynamicFormRef.value?.validator().then(data => {
    console.log(data)
  }).catch(err => {
    console.log(err)
  })
}
const resetData = () => {
  useForm.onReset()
}
</script>

<template>
  <NaiDynamicForm :items="formItems" ref="naiDynamicFormRef"/>
  <div class="controls">
    <n-button @click="getData" type="success" size="small">get Data</n-button>
    <n-button @click="setData" type="warning" size="small">set Data</n-button>
    <n-button @click="setDisabled" type="default" size="small">set Disabled</n-button>
    <n-button @click="validatorData" type="info" size="small">validate Data</n-button>
    <n-button @click="resetData" type="error" size="small">reset Data</n-button>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  gap: 5px;
}
</style>