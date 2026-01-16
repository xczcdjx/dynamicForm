import type {VNode} from "vue";

type SizeObjType = { isMobile: boolean, width: number, height: number };
export type ZealCardSlots = {
    searchForm?: () => VNode[]
    searchBtn?: () => VNode[]
    controlBtn?: () => VNode[]
    toolBtn?: () => VNode[]
    default?: (obj: { tableHeight: number } & SizeObjType) => VNode[]
    rest?: () => VNode[]
    footer?: (size: SizeObjType) => VNode[]
    header?: (size: SizeObjType) => VNode[]
}
export type ZealTableSearchSlots = {
    title?: () => VNode[]
}
export type EleZealTablePaginationSlots = {
    default?: () => VNode[]
}