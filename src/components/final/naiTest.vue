<script setup lang="ts">
import {NButton} from "naive-ui";
import {NaiPopupModal} from "@/naiveUi";
import {ref} from "vue";

const naiPopupModalRef = ref<InstanceType<typeof NaiPopupModal> | null>(null)
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
  <n-button @click="toggleShow">nai popupOpen</n-button>
  <NaiPopupModal title="addTest" ref="naiPopupModalRef" :on-cancel="onCancel" :on-submit="onSubmit"
                 :close-on-mask="false">
    <p>111</p>
    <!--    <template #footer>
          <n-button @click="onSubmit">submit</n-button>
        </template>-->
  </NaiPopupModal>
</template>

<style scoped>

</style>