<script setup lang="ts">

import {ref} from "vue";
import {NMessageProvider} from "naive-ui"
import {naiveUiDynamicFormRef} from "@/naiveUi";
import NaiveUiDynamicForm from "@/naiveUi/NaiveUiDynamicForm";
import DynamicCascadeForm from "@/naiveUi/DynamicCascadeForm";
// import "../dist/index.css";

const dyRef = ref<naiveUiDynamicFormRef | null>(null)
const test = ref<{ a: string, b: number, c: number[] }>({
  a: '1111',
  b: 123,
  c: [1, 3, 5]
})
const test2 = ref({
  a:"dynamic",
  b: 123,
  c: [1, 3, 5],
  d:{
    a:1,
    b:'aaa',
    // c:[7879],
    e:{
      a:"bbb",
      /*b:{
        e:"7777"
      }*/
    }
  }
})
const getD = () => {
  console.log(dyRef.value?.getRenderArr())
}
const onSet = () => {
  dyRef.value?.onSet({a: 8888})
}
</script>

<template>
  <n-message-provider>
    <div class="app">
<!--      <p>Single dynamicForm</p>
      <naive-ui-dynamic-form is-controller v-model="test" ref="dyRef"/>
      <p>{{ test }}</p>
      <div class="center">
        <button @click="getD">get D</button>
        <button @click="onSet">OnSet</button>
      </div>-->
      <p>Cascade dynamicForm</p>
      <dynamic-cascade-form v-model="test2"/>
      <pre>{{ test2 }}</pre>
    </div>
  </n-message-provider>
</template>

<style scoped>
.app{
  padding: 20px;
}
</style>
