import {isRef, ref, shallowReactive, type Ref} from "vue"
import type {DyFormItem} from "../../types/form"
import {ensureRef} from "../../utils/tools.ts";

import {
    renderInput,
    renderSelect,
    renderPopSelect,
    renderTreeSelect,
    renderRadioGroup,
    renderRadioButtonGroup,
    renderCheckboxGroup,
    renderSwitch,
    renderDatePicker,
    renderTimePicker,
} from "./renderForm"

export type RenderType =
    | "renderInput"
    | "renderSelect"
    | "renderPopSelect"
    | "renderTreeSelect"
    | "renderRadioGroup"
    | "renderRadioButtonGroup"
    | "renderCheckboxGroup"
    | "renderSwitch"
    | "renderDatePicker"
    | "renderTimePicker"

export type DecorateDyFormItem<Row extends Record<string, any>, RuleT = any> =
    Omit<DyFormItem<Row, RuleT>, "value"> & {
    value: DyFormItem<Row, RuleT>["value"] | any | null
    renderType?: RenderType
    renderProps?: Record<string, any>
}

export function useDecorateForm<Row extends Record<string, any>, RuleT = any>(
    items: DecorateDyFormItem<Row, RuleT>[],
    isReactive = true
) {
    const map = {
        renderInput: (it: DecorateDyFormItem<Row, RuleT>) =>
            renderInput(it.value as any, it.renderProps ?? {}, it as any),

        renderSelect: (it: DecorateDyFormItem<Row, RuleT>) =>
            renderSelect(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

        renderPopSelect: (it: DecorateDyFormItem<Row, RuleT>) =>
            renderPopSelect(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

        renderTreeSelect: (it: DecorateDyFormItem<Row, RuleT>) =>
            renderTreeSelect(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

        renderRadioGroup: (it: DecorateDyFormItem<Row, RuleT>) =>
            renderRadioGroup(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

        renderRadioButtonGroup: (it: DecorateDyFormItem<Row, RuleT>) =>
            renderRadioButtonGroup(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

        renderCheckboxGroup: (it: DecorateDyFormItem<Row, RuleT>) =>
            renderCheckboxGroup(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

        renderSwitch: (it: DecorateDyFormItem<Row, RuleT>) =>
            renderSwitch(it.value as any, it.renderProps ?? {}, it as any),

        renderDatePicker: (it: DecorateDyFormItem<Row, RuleT>) =>
            renderDatePicker(it.value as any, it.renderProps ?? {}, it as any),

        renderTimePicker: (it: DecorateDyFormItem<Row, RuleT>) =>
            renderTimePicker(it.value as any, it.renderProps ?? {}, it as any),
    } as const

    const normalized = items.map((raw) => {
        // 1) to Ref
        const it = raw as any as DyFormItem<Row, RuleT>
        it.value = ensureRef((raw as any).value)
        // 处理render2
        if (typeof raw.render2 === 'function') {
            it.render2 = raw.render2
        } else {
            if (raw.renderType) {
                const fn = (map as any)[raw.renderType]
                if (fn) it.render2 = () => fn(it)
                else console.warn(`[useDecorateForm] unknown renderType: ${raw.renderType}`)
            } else {
                it.render2 = () => map.renderInput(it)
            }
        }
        // 是否外部状态响应式
        return isReactive ? shallowReactive(it) : it
    })

    return normalized as DyFormItem<Row, RuleT>[]
}
