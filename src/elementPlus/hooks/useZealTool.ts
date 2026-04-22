import {computed, ref} from "vue";
import type {eleZealCardRef} from "@/elementPlus";
import type {ZealColumnType} from "@/types";
import type {ZealColumn} from "@/types/form.ts";

export function useZealColumnTool<T extends Record<string, any>>(
    createColumn: ((obj: ZealColumnType) => ZealColumn<T>[]),
    config?: ZealColumn<T>) {
    const eleZealCardRef = ref<eleZealCardRef | null>(null)

    const tableColumns = computed(() => {
        const eleCR = eleZealCardRef.value
        return createColumn({
            isMobile: eleCR?.isMobile ?? ref(false),
            tableHeight: eleCR?.tableHeight ?? ref(0),
        }).map(it => ({...it, ...config})) as ZealColumn<T>
    })
    return {
        eleZealCardRef, tableColumns
    }
}