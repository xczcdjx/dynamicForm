import {type Ref, shallowReactive} from "vue"
import {unref, isRef} from "vue"
import type {DyFormItem} from "@/types/form"
import {ensureRef} from "../utils/tools.ts";
import type {DecorateDyFormItem, Renderers, RenderType} from "@/types";

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

    const getValue = <K extends KeyOf<Row>>(key: K) =>
        getItems().find((i) => i.key === key) as DyFormItem<Row> | undefined

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
                const v = isRef(c.value) ? c.value.value : (c as any).value
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
    return {setDisabled, setHidden, setValue, setValues, getValue, getValues, onReset}
}

export function createUseDecorateForm<Row extends Record<string, any>, RuleT = any>(
    renderers: Renderers<Row, RuleT>
) {
    return function useDecorateForm(
        items: DecorateDyFormItem<Row, RuleT>[],
        isReactive = true
    ) {
        const map: Record<RenderType, (it: DecorateDyFormItem<Row, RuleT>) => any> = {
            renderInput: (it) => renderers.renderInput(it.value as any, it.renderProps ?? {}, it as any),

            renderSelect: (it) =>
                renderers.renderSelect(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderPopSelect: (it) =>
                renderers.renderPopSelect(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderTreeSelect: (it) =>
                renderers.renderTreeSelect(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderRadioGroup: (it) =>
                renderers.renderRadioGroup(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderRadioButtonGroup: (it) =>
                renderers.renderRadioButtonGroup(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderCheckboxGroup: (it) =>
                renderers.renderCheckboxGroup(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderSwitch: (it) => renderers.renderSwitch(it.value as any, it.renderProps ?? {}, it as any),

            renderDatePicker: (it) => renderers.renderDatePicker(it.value as any, it.renderProps ?? {}, it as any),

            renderTimePicker: (it) => renderers.renderTimePicker(it.value as any, it.renderProps ?? {}, it as any),
        }

        const normalized = items.map((raw) => {
            // 1) to Ref
            const it = raw as any as DyFormItem<Row, RuleT>
            it.value = ensureRef((raw as any).value)
            // 处理render2
            if (typeof raw.render2 === "function") {
                it.render2 = raw.render2
            } else {
                const key = (raw.renderType ?? "renderInput") as RenderType
                const fn = map[key]
                if (fn) it.render2 = () => fn(it as any)
                else {
                    console.warn(`[useDecorateForm] unknown renderType: ${raw.renderType}`)
                    it.render2 = () => map.renderInput(it as any)
                }
            }
            // 是否外部状态响应式
            return isReactive ? shallowReactive(it) : it
        })

        return normalized as DyFormItem<Row, RuleT>[]
    }
}