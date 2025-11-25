<script setup lang="ts">
import {ref} from "vue";
import {NaiveUiDynamicCascadeForm} from "../../dist/naiveUi";

const test2 = ref({
  a: {
    b: {
      c: {
        d: {
          e: "hello world"
        }
      }
    }
  }
})
</script>

<template>
  <p>Cascade dynamicForm</p>
  <naive-ui-dynamic-cascade-form v-model="test2" is-controller/>
  <pre>{{ test2 }}</pre>
</template>

<style scoped>
.app {
  padding: 20px;
}
</style>
