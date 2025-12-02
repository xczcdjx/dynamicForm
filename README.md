# dynamicformdjx

基于 **Vue 3** 的动态表单输入组件。

[文档](https://xczcdjx.github.io/dynamicFormDoc/)

[Vue2 版本](https://www.npmjs.com/package/dynamicformdjx-vue2) (正在适配)

[React 版本](https://www.npmjs.com/package/dynamicformdjx-react) (正在适配)


## 概述

`DynamicForm` 组件是一个灵活且动态的表单输入组件，允许用户添加、修改和删除键值对。它提供了多种自定义选项，如按钮文本、表单布局和输入过滤等。

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

### 基本使用

```vue

<script setup lang="ts">
  import {ref} from "vue";
  import {DynamicForm, type dynamicFormRef} from "dynamicformdjx";

  const test = ref<{ a: string, b: number, c: number[] }>({
    a: 'Hello world',
    b: 1314,
    c: [5, 2, 0]
  })
  const dyRef = ref<dynamicFormRef>()
  const setData = () => {
    dyRef.value?.onSet({test: "helloWorld"})
  }
</script>

<template>
  <p>Input</p>
  <DynamicForm v-model="test" is-controller ref="dyRef"/>
  <p>Result</p>
  <pre>{{ test }}</pre>
  <div>
    <button @click="setData">setData helloWorld</button>
  </div>
</template>
```

### 级联基本使用

```vue
<script setup lang="ts">
  import {ref} from "vue";
  import {dynamicCascadeFormRef,DynamicCascadeForm} from "dynamicformdjx";

  const dyCascadeRef = ref<dynamicCascadeFormRef | null>(null)
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
  <p>Cascade dynamicForm</p>
  <dynamic-cascade-form  v-model="test2" :depth="5" ref="dyCascadeRef" is-controller/>
  <pre>{{ test2 }}</pre>
  <button @click="setData">setData 8888</button>
</template>
```