import type {VNode} from "vue";

export type ZealCardSlots = {
    searchForm?: () => VNode[]
    searchBtn?: () => VNode[]
    controlBtn?: () => VNode[]
    toolBtn?: () => VNode[]
    default?: (obj: { tableHeight: number }) => VNode[]
    rest?: () => VNode[]
    footer?: () => VNode[]
    header?: () => VNode[]
}
export type NaiZealTableSearchSlots = {
    title?: (obj: { isMobile: boolean }) => VNode[]
}