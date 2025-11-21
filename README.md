# dynamicformdjx

基于 **Vue 3 + Naive UI** 的动态表单组件。（该库依赖于naiveUi）

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

### 基本使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DynamicForm } from 'dynamicformdjx'

const test = ref<{ a: string; b: number; c: number[] }>({
  a: '1111',
  b: 123,
  c: [1, 3, 5]
})
</script>

<template>
  <div>
    <DynamicForm v-model="test" />
    <p>{{ test }}</p>
  </div>
</template>
