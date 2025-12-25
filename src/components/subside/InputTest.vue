<script setup lang="ts">
import {NInput} from "naive-ui";
import {useAttrs} from "vue";
const fv=defineModel()
const attrs=useAttrs()
</script>

<template>
<n-input v-model="fv" v-bind="attrs"/>
</template>

<style scoped>

</style>