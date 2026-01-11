import {type Ref, shallowReactive, toRaw} from "vue"
import {unref, isRef} from "vue"
import type {DyFormItem} from "@/types/form"
import {ensureRef} from "../utils/tools";

type KeyOf<T> = Extract<keyof T, string>

export type DyFormItemLike<Row extends Record<string, any>, RuleT = any> =
    Omit<DyFormItem<Row, RuleT>, "value"> & {
    value: DyFormItem<Row, RuleT>["value"] | any | null
}

export function useReactiveForm<T extends Record<string, any>, U = any>(items: DyFormItemLike<T, U>[], isReactive: boolean = true) {
    return items.map(raw => {
        const it = raw as any as DyFormItem<T, U>
        it.value = ensureRef((raw as any).value)
        return isReactive ? shallowReactive(it) : it
    }) as DyFormItem<T, U>[]
    // return (isReactive ? items.map(it => shallowReactive<DyFormItem<T, U>>(it)) : items) as DyFormItem<T, U>[]
}

export function useDyForm<Row extends Record<string, any>>(
    items: DyFormItem<Row>[] | Ref<DyFormItem<Row>[]>
) {
    const getItems = () => unref(items)

    const setDisabled = (disabled: boolean, keys?: KeyOf<Row>[]) => {
        getItems().forEach((it) => {
            const k = it.key as KeyOf<Row>
            if (!keys || keys.includes(k)) it.disabled = disabled
        })
    }

    const setHidden = (hidden: boolean, keys?: KeyOf<Row>[]) => {
        getItems().forEach((it) => {
            const k = it.key as KeyOf<Row>
            if (!keys || keys.includes(k)) it.hidden = hidden
        })
    }

    const setValue = <K extends KeyOf<Row>>(key: K, value: Row[K]) => {
        const it = getItems().find((i) => i.key === key)
        if (!it) return
        if (isRef(it.value)) (it.value as any).value = value
        else (it as any).value = value
    }

    const setValues = (patch: Partial<{ [K in KeyOf<Row>]: Row[K] }>) => {
        Object.entries(patch).forEach(([k, v]) => {
            setValue(k as KeyOf<Row>, v as any)
        })
    }

    const getValue = <K extends KeyOf<Row>>(key: K): any | undefined => {
        const v = getItems().find((i) => i.key === key)
        if (v) {
            const value = v.value
            return isRef(value) ? toRaw(value.value) : value
        }
    }

    /*function getValues(): Row
    function getValues<K extends KeyOf<Row>>(keys: readonly K[]): Pick<Row, K>
    function getValues(keys?: readonly KeyOf<Row>[]) {
        const ks = keys && keys.length ? new Set<string>(keys as readonly string[]) : null
        return getItems().reduce((p, c) => {
            const key = c.key as string
            if (!ks || ks.has(key)) {
                const v = isRef(c.value) ? c.value.value : (c as any).value
                ;(p as any)[key] = v
            }
            return p
        }, {} as any)
    }*/

    const getValues = <K extends KeyOf<Row>>(keys?: readonly K[]) => {
        const ks = keys && keys.length ? new Set<string>(keys as readonly string[]) : null

        return getItems().reduce((p, c) => {
            const key = c.key as string
            if (!ks || ks.has(key)) {
                const v = isRef(c.value) ? toRaw(c.value.value) : (c as any).value
                ;(p as any)[key] = v
            }
            return p
        }, {} as Partial<Pick<Row, K>> & Record<string, any>)
    }

    const onReset = (value: any = null): void => {
        getItems().forEach((it) => {
            if (isRef(it.value)) it.value.value = value
            else it.value = value
        })
    }
    const getItem = <K extends KeyOf<Row>>(key: K) =>
        getItems().find((i) => i.key === key) as DyFormItem<Row> | undefined

    const setItem = <K extends KeyOf<Row>>(k: K, patchItem: Partial<Omit<DyFormItem<Row>, 'key'>>) => {
        getItems().forEach((it) => {
            if (it.key === k) {
                const {key, ...fromRest} = patchItem as DyFormItem
                Object.assign(it, fromRest)
            }
        })
    }
    const setItems = <K extends KeyOf<Row>>(patch: [K, Partial<Omit<DyFormItem<Row>, 'key'>>][]) => {
        const patchMap = new Map(patch)
        getItems().forEach((it) => {
            const p = patchMap.get(it.key as K)
            if (p) {
                const {key, ...fromRest} = p as DyFormItem
                Object.assign(it, fromRest)
            }
        })
    }
    /**
     * updateKeys
     * - 理论上key不允许修改，容易混乱管理，这里提供方法修改,请注意修改后对应关系
     */
    const updateKeys = <K extends KeyOf<Row>>(patch: [K, string][]) => {
        const patchMap = new Map(patch)
        getItems().forEach((it) => {
            const p = patchMap.get(it.key as K)
            if (p) it.key = p
        })
    }
    return {
        setDisabled,
        setHidden,
        setValue,
        setValues,
        getValue,
        getValues,
        onReset,
        getItem,
        setItem,
        setItems,
        updateKeys
    }
}
