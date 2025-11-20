<script setup lang="ts">

import {ref} from "vue";
import DynamicForm from "./components/DynamicForm.tsx";
import {NMessageProvider} from "naive-ui"
const test=ref<{a:string,b:number,c:number[]}>({
  a:'1111',
  b:123,
  c:[1,3,5]
})
</script>

<template>
  <n-message-provider>
  <div class="app">
    <dynamic-form v-model="test"/>
    <p>{{test}}</p>
  </div>
  </n-message-provider>
</template>

<style scoped>

</style>
