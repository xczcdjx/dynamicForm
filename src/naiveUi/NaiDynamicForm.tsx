import {defineComponent, h, type PropType, ref, toRef} from "vue";
import {
    type FormInst,
    type FormProps,
    type GridProps,
    NForm,
    NFormItem,
    NFormItemGridItem,
    NGrid,
    useMessage
} from 'naive-ui'
import type {FormItem} from "@/types/form";
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
            type: Array as PropType<Array<FormItem>>,
            require: true,
        }
    },
    setup(props, {emit, expose}) {
        const dataForm = ref<FormInst | null>(null)
        const itemsV = toRef(props, 'items')
        const message = useMessage()

        function reset() {
            if (!itemsV.value) return
            itemsV.value.forEach((it: FormItem) => {
                if (it.reset) {
                    it.reset(it)
                } else {
                    it.value.value = null
                }
            })
        }

        function generatorResults() {
            if (!itemsV.value) return
            return itemsV.value.reduce((pre: any, cur: FormItem) => {
                pre[cur.key] = cur.value.value
                return pre
            }, {})
        }

        function validator(): Promise<object> {
            return new Promise((resolve, reject) => {
                dataForm.value?.validate((errors) => {
                    if (!errors) {
                        resolve(generatorResults())
                    } else {
                        reject(errors)
                    }
                })
            })
        }

        expose({
            generatorResults, reset, validator
        })

        if (!props.items) throw new Error('prop items must be not null')
        return () => <div class={'naiDynamicForm'}>
            <NForm ref={dataForm} {...props.formConfig} model={generatorResults()} rules={props.rules} v-slots={
                {
                    default() {
                        const options = props.items?.filter(it => !it.hidden)
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

function renderItem(formItem: FormItem) {
    return function () {
        if (formItem.render) {
            return formItem.required
                ? [
                    formItem.render(formItem),
                ]
                : formItem.render(formItem)
        } else {
            return null
        }
    }
}