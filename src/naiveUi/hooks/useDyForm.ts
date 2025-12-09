import type {DyFormItem} from "@/types/form.ts";

function useDyForm(itemsRef:any) {
    const setDisabled = (disabled: boolean, keys?: string[]) => {
        itemsRef.value.forEach(it => {
            if (!keys || keys.includes(it.key as string)) it.disabled = disabled
        })
    }

    const setHidden = (hidden: boolean, keys: string[]) => {
        itemsRef.value.forEach(it => {
            if (keys.includes(it.key as string)) it.hidden = hidden
        })
    }

    const setValues = (patch: Record<string, any>) => {
        Object.entries(patch).forEach(([k, v]) => {
            const it = itemsRef.value.find(i => i.key === k)
            if (it) it.value.value = v
        })
    }

    return { setDisabled, setHidden, setValues }
}
export default useDyForm