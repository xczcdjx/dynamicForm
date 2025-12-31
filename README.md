# dynamicformdjx

基于 **Vue 3** 的动态表单及录入。

[文档](https://xczcdjx.github.io/dynamicFormDoc/)
> 1.当前为0.41版本，已完成所有配合element plus 或naive ui表单的适配

> 2.其中简单表单，自定义表单，装饰表单均可使用

> 3.文档还在完善中，可参考源码中的components组件查看具体使用

[Vue2 版本](https://www.npmjs.com/package/dynamicformdjx-vue2) 

[React 版本](https://www.npmjs.com/package/dynamicformdjx-react) 

[//]: # (### 组件版本说明)

[//]: # (- **v0.2 及以上版本**)

[//]: # (- Form字段改为Input, ElementPlus缩短为Ele, NaiveUi缩短为Nai)

[//]: # (- 请使用：`DynamicInput`, `DynamicCascadeInput`，`EleDynamicInput`,`NaiDynamicInput` 等导入)


[//]: # (| 版本范围 | 组件导入方式 |)

[//]: # (|---------|--------------|)

[//]: # (| ≥ 0.2   | DynamicInput, DynamicCascadeInput |)

[//]: # (| < 0.2   | DynamicForm, DynamicCascadeForm |)

## 概述

`DynamicForm` 一个灵活且动态的表单组件，使用数组，简化模版操作，提供多种hook快速操作表单等。

- 简化template代码，快速处理表单
- 提供render2函数渲染表单项，使用函数渲染值或自定义h函数
- 提供多种hooks函数，快速处理数据值

`DynamicInput` 组件是一个灵活且动态的表单输入组件，允许用户添加、修改和删除键值对。它提供了多种自定义选项，如按钮文本、表单布局和输入过滤

- 支持通过 `v-model` 双向绑定任意对象，(包含受控和非受控) 可动态增删字段
- 支持将值解析为：字符串 / 数字 / 数组（字符串数组、数字数组）
- 文案、样式、数组分隔符等均可配置
---

## 安装

```bash
# 任意一种
npm install dynamicformdjx
# or
yarn add dynamicformdjx
# or
pnpm add dynamicformdjx
```
###  动态表单 (**新**)
> (该表单依赖于naive ui或element plus,请配合一起使用)
#### 与Naive ui配合
##### 1.简单表单
```vue
<script setup lang="ts">
  import {ref} from "vue";
  import {NButton} from "naive-ui";
  import {useDyForm, useReactiveForm} from "dynamicformdjx";
  import {type naiDynamicFormRef, NaiDynamicForm, renderInput, renderRadioGroup} from "dynamicformdjx/naiveUi";
  import type {PresetType} from "dynamicformdjx/types/index";

  type FormRow = {
    username: string
    password: string
    preset: PresetType
  }
  const naiDynamicFormRef = ref<naiDynamicFormRef | null>(null)
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
      span: 6
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
      span: 8,
      offset: 2,
      requiredHint:l=>`${l} is not empty`
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
    const res = naiDynamicFormRef.value?.getResult?.()
    console.log(res)
  }
  const resetData = () => {
    // useForm.onReset() // 或
    naiDynamicFormRef.value?.reset?.()
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
    naiDynamicFormRef.value?.validator().then(data => {
      console.log(data)
    }).catch(err => {
      console.log(err)
    })
  }
</script>

<template>
  <NaiDynamicForm :items="formItems" ref="naiDynamicFormRef" :preset="presetType">
    <template #header>
      <h3>与Naive ui结合简单表单</h3>
    </template>
    <template #footer>
      <div class="control">
        <n-button @click="getData" type="success" size="small">get Data</n-button>
        <n-button @click="setData" type="warning" size="small">set Data</n-button>
        <n-button @click="validatorData" type="default" size="small">validate Data</n-button>
        <n-button @click="resetData" type="error" size="small">reset Data</n-button>
      </div>
    </template>
  </NaiDynamicForm>
</template>

<style scoped>
  h3{
    text-align: center;
    margin:0 0 10px 0;
  }
  .control {
    display: flex;
    gap: 5px;
  }
</style>
```
##### 2.自定义表单 
> (所有render2函数使用自定义)
##### InputTest.vue
```vue
<script setup lang="ts">
import {NInput} from "naive-ui";
import {useAttrs} from "vue";
const fv=defineModel()
const attrs=useAttrs()
</script>

<template>
<n-input v-model="fv" v-bind="attrs"/>
</template>

<style scoped>

</style>
```
##### Render.vue
```vue
<script setup lang="ts">
import {h, ref} from "vue";
import {NButton, NInput} from "naive-ui";
import {useDyForm, useReactiveForm} from "dynamicformdjx";
import {type naiDynamicFormRef, NaiDynamicForm, NaiDynamicInput, type naiDynamicInputRef} from "dynamicformdjx/naiveUi";
import type {FormItemRule, FormRules} from "naive-ui/es/form/src/interface";
import InputTest from "./InputTest.vue";

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
    // @ts-ignore
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
    placeholder: '请输入描述',
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
  naiDynamicInputRef.value?.onSet?.({})
}
const setData = () => {
  useForm.setValues({
    name: 'naive-ui',
    desc:`A Vue 3 Component Library Fairly Complete, Theme Customizable, Uses TypeScript, Fast Kinda Interesting`
  })
  naiDynamicInputRef.value?.onSet?.({
    question: 'how are you?',
    answer: "I'm fine,Thank you"
  })
}
const validatorData = () => {
  // 校验
  naiDynamicFormRef.value?.validator().then(data => {
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
```
##### 3.装饰表单
> (可省略render2函数)
```vue
<script setup lang="ts">
import { ref} from "vue";
import {NButton} from "naive-ui";
import {useDyForm} from "dynamicformdjx";
import {
  type naiDynamicFormRef,
  NaiDynamicForm,
  useDecorateForm,
  renderDatePicker
} from "dynamicformdjx/naiveUi";


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
    type:'password',
    renderType: 'renderInput',
    renderProps:{
      showPasswordOn:'click'
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
  const res = naiDynamicFormRef.value?.getResult?.()
  console.log(res)
}
const resetData = () => {
  naiDynamicFormRef.value?.reset?.()
}
const setData = () => {
  useForm.setValues({
    password: 'naive-ui',
    job: 0,
    birthday: Date.now(),
  })
}
const validatorData = () => {
  naiDynamicFormRef.value?.validator().then(data => {
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
```

#### 与Element-plus配合
> (这里只展示一种,只是导入从"dynamicformdjx/elementPlus"中，类型方法与上方naive ui一致)
##### 简单表单
```vue
<script setup lang="ts">
import {ref} from "vue";
import {ElButton} from "element-plus";
import {useDyForm, useReactiveForm} from "dynamicformdjx";
import {type eleDynamicFormRef, renderInput, renderRadioGroup, EleDynamicForm} from "dynamicformdjx/elementPlus";
import type {PresetType} from "dynamicformdjx/types/index";

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
  const res = eleDynamicFormRef.value?.getResult?.()
  console.log(res)
}
const resetData = () => eleDynamicFormRef.value?.reset?.()
const setData = () => useForm.setValues({
  username: 'element-plus',
  password: '520'
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
  <EleDynamicForm :items="formItems" ref="eleDynamicFormRef" :preset="presetType">
    <template #header>
      <h3>与Element plus结合简单表单</h3>
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
```
###  动态录入

#### 1.单组件
```vue
<script setup lang="ts">
  import {ref} from "vue";
  import {DynamicInput, type dynamicInputRef} from "dynamicformdjx";

  const test = ref<{ a: string, b: number, c: number[] }>({
    a: 'Hello world',
    b: 1314,
    c: [5, 2, 0]
  })
  const dyRef = ref<dynamicInputRef>()
  const setData = () => {
    dyRef.value?.onSet?.({test: "helloWorld"})
  }
</script>

<template>
  <p>Input</p>
  <DynamicInput v-model="test" is-controller ref="dyRef"/>
  <p>Result</p>
  <pre>{{ test }}</pre>
  <div>
    <button @click="setData">setData helloWorld</button>
  </div>
</template>
```

#### 2.级联基本使用

```vue
<script setup lang="ts">
  import {ref} from "vue";
  import {dynamicCascadeInputRef,DynamicCascadeInput} from "dynamicformdjx";

  const dyCascadeRef = ref<dynamicCascadeInputRef | null>(null)
  const test2 = ref({
    a: {
      b: {
        c: {
          d: {
            e: "hello world"
          }
        }
      }
    },
    aa: [5, 2, 0],
    aaa: 1314
  })
  const setData = () => {
    dyCascadeRef.value?.onSet?.({a: 8888})
  }
</script>

<template>
  <p>Cascade dynamicInput</p>
  <dynamic-cascade-input  v-model="test2" :depth="5" ref="dyCascadeRef" is-controller/>
  <pre>{{ test2 }}</pre>
  <p>Result</p>
  <button @click="setData">setData 8888</button>
</template>
```