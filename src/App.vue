<script setup lang="ts">
import {NMessageProvider} from "naive-ui";
import SimpleData from "@/components/simpleData.vue";
import CascadeData from "@/components/cascadeData.vue";
import DynamicformTest from "@/components/dynamicformTest.vue";
import SimpleDyFormTest from "@/components/simpleDyFormTest.vue";
import CustomDyFormTest from "@/components/customDyFormTest.vue";
import DecorateDyFormTest from "@/components/decorateDyFormTest.vue";
</script>

<template>
  <n-message-provider>
    <div class="app">
<!--      <simple-data/>-->
<!--      <cascade-data/>-->
<!--      <dynamicform-test/>-->
<!--      <simple-dy-form-test/>-->
      <custom-dy-form-test/>
<!--      <decorate-dy-form-test/>-->
    </div>
  </n-message-provider>
</template>

<style scoped>
.app{
  padding: 20px;
}
</style>
