<script setup lang="ts">
import {NMessageProvider} from "naive-ui";
import SimpleData from "@/components/simpleData.vue";
import CascadeData from "@/components/cascadeData.vue";
import DynamicformTest from "@/components/naiveUi/dynamicformTest.vue";
import SimpleDyFormTest from "@/components/naiveUi/simpleDyFormTest.vue";
import CustomDyFormTest from "@/components/naiveUi/customDyFormTest.vue";
import DecorateDyFormTest from "@/components/naiveUi/decorateDyFormTest.vue";
import EleSimpleDyFormTest from "@/components/elementUi/eleSimpleDyFormTest.vue";
import EleCustomDyFormTest from "@/components/elementUi/eleCustomDyFormTest.vue";
import EleDynamicformTest from "@/components/elementUi/eleDynamicformTest.vue";
import EleDecorateDyFormTest from "@/components/elementUi/eleDecorateDyFormTest.vue";
import NaiTest from "@/components/final/naiTest.vue";
import EleTest from "@/components/final/eleTest.vue";
</script>

<template>
  <n-message-provider>
    <n-modal-provider>
      <div class="app">
        <!--      <simple-data/>-->
        <!--      <cascade-data/>-->
        <!--      naive ui-->
        <!--      <dynamicform-test/>-->
        <!--      <simple-dy-form-test/>-->
        <!--      <custom-dy-form-test/>-->
        <!--      <decorate-dy-form-test/>-->
        <!--      element-plus-->
        <!--      <ele-simple-dy-form-test/>-->
        <!--      <ele-custom-dy-form-test/>-->
        <!--      <ele-dynamicform-test/>-->
        <!--      <ele-decorate-dy-form-test/>-->
        <!--      final-->
        <nai-test/>
        <ele-test/>
      </div>
    </n-modal-provider>
  </n-message-provider>
</template>

<style scoped>
.app {
  padding: 20px;
}
</style>
