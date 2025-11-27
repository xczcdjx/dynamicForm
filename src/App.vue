<script setup lang="ts">

import SimpleData from "@/components/simpleData.vue";
import CascadeData from "@/components/cascadeData.vue";
</script>

<template>
  <n-message-provider>
    <div class="app">
<!--      <simple-data/>-->
      <cascade-data/>
    </div>
  </n-message-provider>
</template>

<style scoped>
.app{
  padding: 20px;
}
</style>
