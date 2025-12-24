import {computed, defineComponent, h, type PropType, ref, toRef} from "vue";
import {
    type FormInst,
    type FormProps,
    type GridProps,
    NForm,
    NFormItem,
    NFormItemGridItem,
    NGrid,
} from 'naive-ui'
import type {DyFormItem} from "@/types/form";
import type {FormRules} from "naive-ui/es/form/src/interface";

export default defineComponent({
    name: 'NaiDynamicForm',
    props: {
        formConfig: {
            type: Object as PropType<FormProps>,
            default: () => ({
                labelPlacement: 'left',
                size: 'medium'
            }),
        },
        gridConfig: {
            type: Object as PropType<GridProps>,
            default: () => ({
                responsive: 'screen',
                cols: 'xs:1 s:2 m:3 l:3 xl:4 2xl:4',
                xGap: 10,
            }),
        },
        rules: {
            type: Object as PropType<FormRules>
        },
        preset: {
            type: String as PropType<'fullRow' | 'grid'>,
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
    setup(props, {emit, expose}) {
        const dataForm = ref<FormInst | null>(null)
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
                        message: `${c.label}不能为空`,
                        trigger: ['blur']
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
        function reset(v:any=null) {
            if (!itemsV.value) return
            itemsV.value.forEach((it: DyFormItem) => {
                if (it.reset) {
                    it.reset(it)
                } else {
                    it.value.value = v
                }
            })
        }

        function validator(): Promise<object> {
            return new Promise((resolve, reject) => {
                dataForm.value?.validate((errors) => {
                    if (!errors) {
                        resolve(formModel.value)
                    } else {
                        reject(errors)
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
            <NForm ref={dataForm} {...props.formConfig} model={formModel.value} rules={combineRules.value} v-slots={
                {
                    default() {
                        const options = sortedVisibleItems.value
                        return props.preset === 'grid'
                            ? h(
                                NGrid,
                                {
                                    ...props.gridConfig
                                },
                                {
                                    default: () => {
                                        return options?.map((it) => {
                                            return h(
                                                NFormItemGridItem,
                                                {
                                                    label: it.label,
                                                    path: it.path || (it.key as string),
                                                },
                                                {
                                                    default: renderItem(it),
                                                }
                                            )
                                        })
                                    },
                                }
                            )
                            : options?.map((it) => {
                                return h(
                                    NFormItem,
                                    {
                                        label: it.label,
                                        path: it.path || (it.key as string),
                                    },
                                    {
                                        default: renderItem(it),
                                    }
                                )
                            })
                    }
                }
            }/>
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