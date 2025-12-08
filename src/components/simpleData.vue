<script setup lang="ts">
import {ref} from "vue";
import {DynamicInput, type dynamicInputRef} from "../../dist";

const test = ref<{ a: string, b: number, c: number[] }>({
  a: 'Hello world',
  b: 1314,
  c: [5, 2, 0]
})
const dyRef = ref<dynamicInputRef>()
const setData = () => {
  dyRef.value?.onSet({test: "helloWorld"})
}
</script>

<template>
  <p>DynamicInput</p>
  <DynamicInput v-model="test" is-controller ref="dyRef"/>
  <p>Result</p>
  <pre>{{ test }}</pre>
  <div>
    <button @click="setData">setData helloWorld</button>
  </div>
</template>