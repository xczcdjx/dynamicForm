import {computed, ref} from "vue";
import type {naiZealCardRef} from "@/naiveUi";
import type {ZealColumnType} from "@/types";
import type {DataTableColumns} from "naive-ui";


export function useZealColumnTool<T extends Record<string, any> = any>(
    createColumn: ((obj: ZealColumnType) => DataTableColumns<T>),
    config?: Partial<DataTableColumns<T>[number]>) {
    const naiZealCardRef = ref<naiZealCardRef | null>(null)

    const tableColumns = computed(() => {
        const eleCR = naiZealCardRef.value
        return createColumn({
            isMobile: eleCR?.isMobile ?? ref(false),
            tableHeight: eleCR?.tableHeight ?? ref(0),
        }).map(it => ({...it, ...config})) as DataTableColumns<T>
    })
    return {
        naiZealCardRef, tableColumns
    }
}