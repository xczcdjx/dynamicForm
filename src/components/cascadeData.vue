<script setup lang="ts">
import {ref} from "vue";
import {NaiveUiDynamicCascadeForm, type naiveUiDynamicCascadeFFormRef, type naiveUiDynamicFormRef} from "@/naiveUi";

const dyCascadeRef = ref<naiveUiDynamicFormRef | null>(null)
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
const getD = () => {
  console.log(dyCascadeRef.value?.getResult?.('ori'))
}
const onSet = () => {
  dyCascadeRef.value?.onSet?.({a: 8888})
}
const onSet2 = () => {
  dyCascadeRef.value?.onSet?.()
}
</script>

<template>
  <p>Cascade dynamicForm</p>
  <naive-ui-dynamic-cascade-form v-model="test2" :depth="5" ref="dyCascadeRef" is-controller :configs="{showBorder:false,showPad:false}"/>
  <pre>{{ test2 }}</pre>
  <button @click="getD">get D</button>
  <button @click="onSet">OnSet</button>
  <button @click="onSet2">OnSet2</button>
</template>

<style scoped>
.app {
  padding: 20px;
}
</style>
