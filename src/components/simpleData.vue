<script setup lang="ts">
import {ref} from "vue";
import {NaiveUiDynamicForm, type naiveUiDynamicFormRef} from "@/naiveUi";
import {ElementPlusDynamicForm, type elementPlusDynamicFormRef} from "../../dist/elementPlus";
import {DynamicForm, type dynamicFormRef} from "../../dist";

const dyRef = ref<naiveUiDynamicFormRef | null>(null)
const test = ref<{ a: string, b: number, c: number[] }>({
  a: '1111',
  b: 123.333,
  c: [1, 3, 5]
})
const getD = () => {
  console.log(dyRef.value?.getResult?.())
}
const onSet = () => {
  dyRef.value?.onSet?.({a:8888})
}
const onSet2 = () => {
  dyRef.value?.onSet?.()
}
</script>

<template>
      <naive-ui-dynamic-form v-model="test" ref="dyRef"/>
<!--      <element-plus-dynamic-form is-controller v-model="test" ref="dyRef"/>-->
      <!--      <element-plus-dynamic-form is-controller v-model="test" ref="dyRef"/>-->
      <!--      <element-plus-dynamic-form is-controller size="large" v-model="test" ref="dyRef"/>-->
<!--      <dynamic-form v-model="test" is-controller/>-->
      <p>{{ test }}</p>
      <button @click="getD">get D</button>
      <button @click="onSet">OnSet</button>
      <button @click="onSet2">OnSet2</button>
</template>

<style scoped>

</style>
