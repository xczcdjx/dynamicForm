import * as renderers from "./renderForm"
import type {DecorateDyFormItem, Renderers, RenderType} from "@/types";
import type {DyFormItem} from "@/types/form";
import {ensureRef} from "../../utils/tools";
import {shallowReactive} from "vue";
export function createUseDecorateForm(renderers: Renderers<any, any>) {
    return function useDecorateForm<Row extends Record<string, any>, RuleT = any>(
        items: DecorateDyFormItem<Row, RuleT>[],
        isReactive = true
    ) {
        const r = renderers as unknown as Renderers<Row, RuleT>

        const map: Record<RenderType, (it: DecorateDyFormItem<Row, RuleT>) => any> = {
            renderInput: (it) => r.renderInput(it.value as any, it.renderProps ?? {}, it as any),

            renderSelect: (it) =>
                r.renderSelect(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderPopSelect: (it) =>
                r.renderPopSelect(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderTreeSelect: (it) =>
                r.renderTreeSelect(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderRadioGroup: (it) =>
                r.renderRadioGroup(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderRadioButtonGroup: (it) =>
                r.renderRadioButtonGroup(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderCheckboxGroup: (it) =>
                r.renderCheckboxGroup(it.value as any, (it.options ?? []) as any, it.renderProps ?? {}, it as any),

            renderSwitch: (it) => r.renderSwitch(it.value as any, it.renderProps ?? {}, it as any),

            renderDatePicker: (it) => r.renderDatePicker(it.value as any, it.renderProps ?? {}, it as any),

            renderTimePicker: (it) => r.renderTimePicker(it.value as any, it.renderProps ?? {}, it as any),
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
export const useDecorateForm = createUseDecorateForm(renderers)