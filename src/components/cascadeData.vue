<script setup lang="ts">
import {ref} from "vue";
import {dynamicCascadeFormRef,DynamicCascadeForm} from "../../dist";
import {ElementPlusDynamicCascadeForm} from "../../dist/elementPlus";
import {NaiveUiDynamicCascadeForm} from "../../dist/naiveUi";

const dyCascadeRef = ref<dynamicCascadeFormRef | null>(null)
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
const setData = () => {
  dyCascadeRef.value?.onSet?.({a: 8888})
}
</script>

<template>
  <p>Cascade dynamicForm</p>
  <dynamic-cascade-form  v-model="test2" :depth="5" ref="dyCascadeRef" is-controller/>
  <element-plus-dynamic-cascade-form  v-model="test2" :depth="5" ref="dyCascadeRef" is-controller/>
  <pre>{{ test2 }}</pre>
  <button @click="setData">setData 8888</button>
</template>

<style scoped>

</style>
