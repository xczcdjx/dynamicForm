<script setup lang="ts">
import {ref} from "vue";
import {DynamicInput, type dynamicInputRef} from "@/";
import {NaiDynamicInput} from "@/naiveUi";
import {EleDynamicInput} from "@/elementPlus";

const test = ref<{ a: string, b: number, c: number[] }>({
  a: 'Hello world',
  b: 1314,
  c: [5, 2, 0]
})
const dyRef = ref<dynamicInputRef>()
const setData = () => {
  dyRef.value?.onSet({test: "helloWorld"})
}
</script>

<template>
  <p>DynamicInput</p>
  <EleDynamicInput v-model="test" ref="dyRef" :configs="{hideArrayBtn:true,hideNumberBtn:true}" is-controller>
    <template #newBtn="{newItem}">
      <button @click="newItem">新</button>
    </template>
    <template #resetBtn="{reset}">
      <button @click="reset">重置</button>
    </template>
    <template #mergeBtn="{merge}">
      <button @click="merge">合并</button>
    </template>
    <template #typeTools="{row,toggleArray,toggleNumber}">
      <button @click="toggleArray" :class="row.isArray?'act':''">Array</button>&nbsp;
      <button @click="toggleNumber" :class="row.isNumber?'act':''">Number</button>
    </template>
    <template #rowActions="{isLast,addItem,removeItem}">
      <button @click="addItem" :disabled="!isLast">+</button>
      <button @click="removeItem">-</button>
    </template>
  </EleDynamicInput>
  <p>Result</p>
  <pre>{{ test }}</pre>
  <div>
    <button @click="setData">setData helloWorld</button>
  </div>
</template>
<style scoped>
.act {
  background: skyblue;
}
</style>