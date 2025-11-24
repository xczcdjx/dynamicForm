<script setup lang="ts">

import {ref} from "vue";
import {NMessageProvider} from "naive-ui"
// import "../dist/index.css";
import {NaiveUiDynamicForm, naiveUiDynamicFormRef} from "@/naiveUi";
import ElementPlusDynamicForm from "@/elementPlus/ElementPlusDynamicForm";
import DynamicForm from "@/origin/DynamicForm";
const dyRef=ref<naiveUiDynamicFormRef|null>(null)
const test = ref<{ a: string, b: number, c: number[] }>({
  a: '1111',
  b: 123,
  c: [1, 3, 5]
})
const getD = () => {
  console.log(dyRef.value?.getRenderArr())
}
const onSet = () => {
  dyRef.value?.onSet({a:8888})
}
</script>

<template>
  <n-message-provider>
    <div class="app">
      <naive-ui-dynamic-form size="large" is-controller v-model="test" ref="dyRef"/>
<!--      <element-plus-dynamic-form is-controller size="small" v-model="test" ref="dyRef"/>-->
<!--      <element-plus-dynamic-form is-controller v-model="test" ref="dyRef"/>-->
<!--      <element-plus-dynamic-form is-controller size="large" v-model="test" ref="dyRef"/>-->
      <dynamic-form v-model="test" is-controller size="small"/>
      <dynamic-form v-model="test" is-controller/>
      <dynamic-form v-model="test" is-controller size="large"/>
      <p>{{ test }}</p>
      <button @click="getD">get D</button>
      <button @click="onSet">OnSet</button>
    </div>
  </n-message-provider>
</template>

<style scoped>

</style>
