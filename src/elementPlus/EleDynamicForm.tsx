import {computed, defineComponent, h, type PropType, ref, type SlotsType} from "vue";
import type {DyFormItem} from "@/types/form";
import type {DynamicFormSlots, PresetType} from "@/types";
import {ElCol, ElForm, ElFormItem, ElRow} from "element-plus";
import type {FormRules, FormInstance, FormProps, RowProps, ColProps} from "element-plus";

export default defineComponent({
    name: 'EleDynamicForm',
    props: {
        formConfig: {
            type: Object as PropType<FormProps>,
            default: () => ({
                labelPosition: 'left',
                size: 'default',
            }),
        },
        rowConfig: {
            type: Object as PropType<RowProps>,
            default: () => ({
                gutter: 10,
                justify: 'start',
                align: 'top',
            }),
        },
        rules: {
            type: Object as PropType<FormRules<any>>
        },
        preset: {
            type: String as PropType<PresetType>,
            default: 'fullRow',
            validator: (value: string) => {
                if (!['fullRow', 'grid'].includes(value)) {
                    console.error(
                        'preset value must be `fullRow` or `grid`, the default value is `fullRow`'
                    )
                    return false
                }
                return true
            },
        },
        items: {
            type: Array as PropType<Array<DyFormItem>>,
            require: true,
        }
    },
    slots: Object as SlotsType<DynamicFormSlots>,
    setup(props, {expose, slots}) {
        const dataFormRef = ref<FormInstance | null>(null)
        const itemsV = computed(() => (props.items ?? []).filter(it => !it.hidden))
        const formModel = computed(() => {
            if (!itemsV.value) return {}
            return itemsV.value.reduce((pre: any, cur: DyFormItem) => {
                pre[cur.key] = cur.value.value
                return pre
            }, {})
        })
        // 合并rules
        const combineRules = computed(() => {
            const fRules = itemsV.value?.reduce((p, c) => {
                let oRule = c.rule
                if (c.required && !c.rule) {
                    oRule = {
                        required: true,
                        message: c.requiredHint?.(c.label) ?? `${c.label}不能为空`,
                        trigger: 'blur'
                    }
                }
                p[c.key as string] = oRule!
                return p
            }, {} as FormRules)
            return {...fRules, ...props.rules}
        })
        // 排序
        const sortedVisibleItems = computed(() => {
            const arr = itemsV.value
            return [...arr].sort((a, b) => {
                const as = a.sort ?? Infinity
                const bs = b.sort ?? Infinity
                return Number(as) - Number(bs)
            })
        })

        // func
        function reset(v: any = null) {
            if (!itemsV.value) return
            itemsV.value.forEach((it: DyFormItem) => {
                it.value.value = v
            })
        }

        function validator(): Promise<object> {
            return new Promise((resolve, reject) => {
                dataFormRef.value?.validate((valid, fields) => {
                    if (valid) {
                        resolve(formModel.value)
                    } else {
                        reject(fields)
                    }
                })
            })
        }

        expose({
            reset, validator,
            getResult: (t: 'res' | 'ori' = 'res') => t === 'ori' ? itemsV.value : formModel.value
        })

        if (!props.items) throw new Error('prop items must be not null')
        return () => <div class={'naiDynamicForm'}>
            {
                slots.header && <div class="header">
                    {slots.header?.()}
                </div>
            }
            <ElForm ref={dataFormRef} {...props.formConfig} model={formModel.value} rules={combineRules.value} v-slots={
                {
                    default() {
                        const options = sortedVisibleItems.value
                        return props.preset === 'grid'
                            ? h(
                                ElRow,
                                {
                                    ...props.rowConfig
                                },
                                {
                                    default: () => {
                                        return options?.map((it) =>
                                            h(
                                                ElCol,
                                                {
                                                    span: it.span ?? 24,
                                                    offset: it.offset ?? 0
                                                },
                                                {
                                                    default: () =>
                                                        h(
                                                            ElFormItem,
                                                            {
                                                                label: it.label,
                                                                prop: it.path || (it.key as string),
                                                            },
                                                            {default: renderItem(it)}
                                                        ),
                                                }
                                            )
                                        )
                                    },
                                }
                            )
                            : options?.map((it) => {
                                return h(
                                    ElFormItem,
                                    {
                                        label: it.label,
                                        prop: it.path || (it.key as string),
                                    },
                                    {
                                        default: renderItem(it),
                                    }
                                )
                            })
                    }
                }
            }/>
            {
                slots.footer && h('div', {class: 'footer'}, slots.footer?.())
            }
        </div>
    }
})

function renderItem(formItem: DyFormItem) {
    return function () {
        if (formItem.render2) {
            return formItem.render2(formItem)
        } else {
            return null
        }
    }
}