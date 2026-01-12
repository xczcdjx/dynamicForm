<script setup lang="ts">
import {ElButton} from "element-plus";
import {ElePopupModal} from "@/elementPlus";
import {ref} from "vue";

const naiPopupModalRef = ref<InstanceType<typeof ElePopupModal> | null>(null)
const toggleShow = () => {
  naiPopupModalRef.value?.toggle(true);
}
const onCancel = async () => {
  return undefined
}
const onSubmit = async () => {
  return await new Promise(resolve => setTimeout(() => {
    resolve(true)
  }, 2000))
}
</script>

<template>
  <el-button @click="toggleShow">ele popupOpen</el-button>
  <ElePopupModal title="addTest" ref="naiPopupModalRef" :on-cancel="onCancel" :on-submit="onSubmit"
                 :close-on-mask="false">
    <p>111</p>
    <!--    <template #footer>
          <n-button @click="onSubmit">submit</n-button>
        </template>-->
  </ElePopupModal>
</template>

<style scoped>

</style>