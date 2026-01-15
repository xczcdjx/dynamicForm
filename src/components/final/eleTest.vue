<script setup lang="ts">
import {ElTable, ElTableColumn} from "element-plus";
import {ElePopupModal, EleZealCard} from "@/elementPlus";
import {onMounted, ref} from "vue";
import {type SongType, zealData} from "./dataTest";

const referId = ref<string | number>('-1')
const elePopupModalRef = ref<InstanceType<typeof ElePopupModal> | null>(null)
const tableData = ref<SongType[]>([])
const tableProps: { label: string, prop: keyof SongType }[] = [
  {label: 'No', prop: 'no'},
  {label: 'Title', prop: 'title'},
  {label: 'Length', prop: 'length'},
]
const onSubmit = async () => {

}
onMounted(() => {
  tableData.value = zealData.value
})
</script>

<template>
  <EleZealCard>
    <template #header>
      <div>111</div>
    </template>
    <template #controlBtn>
      <n-button type="success" size="small" @click="()=>{}">Add</n-button>
    </template>
    <template #toolBtn>
      <n-button type="default" size="small" @click="()=>{}">
        Tool...
      </n-button>
    </template>
    <template #default="{tableHeight}">
      <el-table :data="tableData" :max-height="tableHeight">
        <el-table-column :prop="r.prop" :label="r.label" v-for="r in tableProps" :key="r.prop">
          <template #scope="row">
            {{ row[r.prop] }}
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #footer>

    </template>
    <template #rest>
      <ElePopupModal :title="referId==='-1'?'add Test':'update Test'" ref="elePopupModalRef" :on-submit="onSubmit">

      </ElePopupModal>
    </template>
  </EleZealCard>
</template>

<style scoped>

</style>