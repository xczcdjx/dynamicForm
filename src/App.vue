<script setup lang="ts">

import {ref} from "vue";
import {NMessageProvider} from "naive-ui"
import {NaiveUiDynamicForm} from "../dist/naiveUi";
import  "../dist/index.css";
// import NaiveUiDynamicForm from "@/naiveUi/NaiveUiDynamicForm";
const test=ref<{a:string,b:number,c:number[]}>({
  a:'1111',
  b:123,
  c:[1,3,5]
})
</script>

<template>
  <n-message-provider>
  <div class="app">
    <naive-ui-dynamic-form v-model="test" :configs="{hideReset:true}" :dy-list-configs="{arraySplitSymbol:'-'}"/>
    <p>{{test}}</p>
  </div>
  </n-message-provider>
</template>

<style scoped>

</style>
