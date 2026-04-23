import type {VNode} from "vue";

type SizeObjType = { isMobile: boolean, width: number, height: number };
export type ZealCardSlots = {
    searchForm?: (size: SizeObjType) => VNode[]
    searchBtn?: (size: SizeObjType) => VNode[]
    controlBtn?: (size: SizeObjType) => VNode[]
    toolBtn?: (size: SizeObjType) => VNode[]
    default?: (obj: { tableHeight: number } & SizeObjType) => VNode[]
    rest?: (size: SizeObjType) => VNode[]
    footer?: (size: SizeObjType) => VNode[]
    header?: (size: SizeObjType) => VNode[]
}
export type ZealTableSearchSlots = {
    title?: () => VNode[]
    searchBtn?: (o: { onSearch: () => void, onReset: () => void }) => VNode[]
    drawerBtn?: (o: { openDrawer: () => void }) => VNode[]
}
export type EleZealTablePaginationSlots = {
    default?: () => VNode[]
}
export type EleZealTableSlots = {
    default?: () => VNode[]
    append?: () => VNode[]
    empty?: () => VNode[]
}
export type ZealTableBtnControlSlots={
    text: () => void
}