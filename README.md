# dynamicformdjx

基于 **Vue 3** 的动态表单组件。
## 概述

`DynamicForm` 组件是一个灵活且动态的表单组件，允许用户添加、修改和删除键值对。它提供了多种自定义选项，如按钮文本、表单布局和输入过滤等。

- 支持通过 `v-model` 双向绑定任意对象
- 可动态增删字段
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
// 如果你组件使用 "naive-ui" 或 "element plus" ui组件库可直接使用下方引入使用
// 依赖于naive-ui
// import {NaiveUiDynamicForm} from "dynamicformdjx/naiveUi";
// 依赖于element-plus
// import {ElementPlusDynamicForm} from "dynamicformdjx/elementPlus";
const test = ref<{ a: string, b: number, c: number[] }>({
  a: 'Hello world',
  b: 1314,
  c: [5, 2, 0]
})
const dyRef=ref<dynamicFormRef>()
const setD = () => {
  dyRef.value?.onSet({test:"helloWorld"})
}
</script>

<template>
  <div>
    <p>Base</p>
    <DynamicForm v-model="test" ref="dyRef"/>
    <pre>{{ test }}</pre>
    <div>
      <button @click="setD">setD</button>
    </div>
  </div>
</template>

<style scoped>
p {
  text-align: left;
  font-size: 25px;
  font-weight: bold;
}

pre {
  text-align: left;
}
</style>
```
### 联集基本使用 (当前仅支持naive ui方式)
```vue
<script setup lang="ts">
import {ref} from "vue";
import {NaiveUiDynamicCascadeForm} from "dynamicformdjx/naiveUi";

const test2 = ref({
  a: {
    b: {
      c: {
        d: {
          e: "hello world"
        }
      }
    }
  }
})
</script>

<template>
  <p>Cascade dynamicForm</p>
  <naive-ui-dynamic-cascade-form v-model="test2" is-controller/>
  <pre>{{ test2 }}</pre>
</template>

<style scoped>
.app {
  padding: 20px;
}
</style>

```


## Props
### size

类型: String

描述: 定义表单和按钮的大小。可选值为 "small"、"large" 和 "default"。

默认值: "default"

### isController

类型: Boolean

描述: 控制组件是否处于控制模式。当启用时，它会管理自己的状态并将更改发射回父组件。

### dyCls

类型: String

描述: 动态表单容器的自定义 CSS 类。

### randomFun

类型: Function

描述: 用于生成每个动态表单项的唯一 ID 的函数。默认情况下，它返回一个基于当前时间戳和可选索引的字符串。

默认值: (i?: number) => \${Date.now()}_${i ?? 0}``

### btnConfigs

类型: Object

描述: 按钮文本的配置（重置、新增、合并）。

默认值: { resetTxt: "重置", newTxt: "添加项", mergeTxt: "合并" }

### configs

类型: Object

描述: 表单行为的配置，如最大高度和滚动行为。

默认值: { hideReset: false, maxHeight: "300px", autoScroll: true, allowFilter: true }

### dyListConfigs

类型: Object

描述: 用于处理动态列表项的配置，包括分隔符等。

默认值: { arraySplitSymbol: "," }

### modelValue

类型: Object

必填: true

描述: 绑定到表单的模型值。父组件应传递此对象，并与表单进行同步。

### Emits

update:modelValue: 当表单数据更改时触发，传递更新后的模型值。

onReset: 当表单被重置时触发。

onMerge: 当表单数据合并时触发，传递更新后的对象和原始表单项。

### Expose (ref)
onSet(o: object)

描述: 设置表单数据为提供的对象，并重新渲染表单。

参数:

o (object): 新的表单数据。

getRenderArr()

描述: 返回当前渲染的表单数据数组。

插槽

default: 可以在表单中提供自定义内容。

