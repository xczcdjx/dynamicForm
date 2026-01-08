<script setup lang="ts">
import {ref} from "vue";
import {DynamicCascadeInput,dynamicCascadeInputRef} from "@/";
import {NaiDynamicCascadeInput} from "@/naiveUi";
import {EleDynamicCascadeInput} from "@/elementPlus";

const dyCascadeRef = ref<dynamicCascadeInputRef | null>(null)
const test2 = ref({
  a: {
    b: 111
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
  <ele-dynamic-cascade-input  v-model="test2" :depth="5" ref="dyCascadeRef" is-controller :configs="{hideNumberBtn:true,hideArrayBtn:true}">
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
    <template #newChild="{addChild,row}">
      <button @click="addChild">+{{row.key}}+</button>
    </template>
  </ele-dynamic-cascade-input>
  <pre>{{ test2 }}</pre>
  <button @click="setData">setData 8888</button>
</template>

<style scoped>
.act{
  background-color: skyblue;
}
</style>
