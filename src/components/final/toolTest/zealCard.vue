<script setup lang="ts">
import {NaiZealCard, NaiZealTableBtnControl} from "@/naiveUi";
import type {TableBtnType} from "@/types";
import type {ButtonProps} from "naive-ui";
import {EleZealTableBtnControl} from "@/elementPlus";

const btnArray: (TableBtnType & ButtonProps)[] = [
  {
    key: "Add",
    title: "Add",
    onSelect:(k:string)=>{
      console.log(k)
    }
  },
  {
    key: "Del",
    title: "Delete",
    type: 'error',
  },
  {
    key: "Up",
    title: "Update",
    type: 'warning',
  }
]
const onSel = (k: string) => {
  console.log(k)
}
</script>
<template>
  <NaiZealCard title="User List">
    <template #searchForm>
      <!-- 你的筛选表单 -->
    </template>

    <template #controlBtn>
      <n-button size="small" type="primary">New</n-button>
    </template>

    <template #default="{ tableHeight, isMobile }">
      <div>tableHeight: {{ tableHeight }}, isMobile: {{ isMobile }}</div>
      <!-- 你的表格组件，传入 tableHeight 做滚动高度等 -->
      <nai-zeal-table-btn-control size="small" :btn-items="btnArray" :isMobile="isMobile" @onSelect="onSel">
        <!--        <template #text>-->
        <!--          <span>more</span>-->
        <!--        </template>-->
      </nai-zeal-table-btn-control>
      <ele-zeal-table-btn-control size="small" :btn-items="btnArray" :isMobile="isMobile" @onSelect="onSel">
        <!--        <template #text>-->
        <!--          <span>more</span>-->
        <!--        </template>-->
      </ele-zeal-table-btn-control>
    </template>

    <template #footer="{ width }">
      <div>window width: {{ width }}</div>
    </template>

    <template #rest>
      <!-- 卡片下方扩展区（比如分页） -->
    </template>
  </NaiZealCard>
</template>