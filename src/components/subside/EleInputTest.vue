<script setup lang="ts">
import {ElInput} from "element-plus";
import {useAttrs} from "vue";
const fv=defineModel()
const attrs=useAttrs()
</script>

<template>
<el-input v-model="fv" v-bind="attrs"/>
</template>

<style scoped>

</style>