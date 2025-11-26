import {defineComponent, nextTick, ref, toRaw, watch} from "vue";
import type {PropType} from 'vue'
import {formatNumberInput, resetObj, tranArr} from "@/utils/tools.ts";


export default defineComponent({
    name: "DynamicForm",
    props: {
        size: {
            type: String as PropType<FSize>,
        },
        isController: {
            type: Boolean,
        },
        dyCls: {
            type: String,
        },
        randomFun: {
            type: Function as PropType<DyRandomFun>,
            default: (i?: number) => `${Date.now()}_${i ?? 0}`
        },
        btnConfigs: {
            type: Object as PropType<Partial<DyBtnConfig>>,
        },
        configs: {
            type: Object as PropType<DyConfig>,
        },
        dyListConfigs: {
            type: Object as PropType<DyListConfig>,
        },
        modelValue: {
            type: Object as PropType<ValueType>,
            required: true
        }
    },
    emits: {
        "update:modelValue": (v: ValueType) => true,
        onReset: () => true,
        onMerge: (v: ValueType, ori: DyCFormItem[]) => true,
    },
    setup(props, {emit, expose}) {
        // config
        const mb: DyBtnConfig = {
            resetTxt: "重置",
            newTxt: "添加项",
            mergeTxt: "合并",
            ...props.btnConfigs,
        }
        const mc: DyConfig = {
            hideReset: false,
            maxHeight: "300px",
            autoScroll: true,
            allowFilter: true,
            ...props.configs,
        }
        const ml: DyListConfig = {
            arraySplitSymbol: ',',
            ...props.dyListConfigs,
        }
        const size = props.size
        // data
        const renderM = ref<DyCFormItem[]>(tranArr(props.modelValue, props.randomFun, ml.arraySplitSymbol))
        // node
        const dyFormListRef = ref<HTMLDivElement | null>(null)
        // supervise
        watch(
            renderM,
            (list) => {
                if (!props.isController) return
                const obj = resetObj(list, ml.arraySplitSymbol)
                emit('update:modelValue', obj)
                emit('onMerge', obj, toRaw(renderM.value))
            },
            {deep: true}
        )

        //expose
        expose({
            onSet: (o?: object) => {
                renderM.value = tranArr(o ?? props.modelValue, props.randomFun, ml.arraySplitSymbol)
            },
            getResult: (t: 'res' | 'ori' = 'res') => {
                return t === 'ori' ? toRaw(renderM.value) : resetObj(renderM.value, ml.arraySplitSymbol)
            },
        })
        return () => <div class={props.dyCls ?? `dynamicForm ${size}`} style={{maxHeight: mc.maxHeight}}>
            <div class="dyFormList" ref={dyFormListRef}>
                {renderM.value.map((r, i, arr) => <div class="dItem" key={r.rId}>
                    <div class="input">
                        <input size={size} value={r.key} class="key nativeInput" onInput={v => {
                            r.key = (v.target as HTMLInputElement).value
                        }}/>:
                        <div class="vInput">
                            <div class="slot">
                                <button
                                    class={[
                                        r.isArray ? "success" : "default",
                                        "small",
                                        "bt"
                                    ]}
                                    onClick={() => {
                                        r.isArray = !r.isArray
                                    }}
                                >
                                    Array
                                </button>
                                &nbsp;
                                <button
                                    class={[
                                        r.isNumber ? "success" : "default",
                                        "small",
                                        "bt"
                                    ]}
                                    onClick={() => {
                                        r.isNumber = !r.isNumber
                                    }}
                                >
                                    Number
                                </button>
                            </div>
                            <input size={size} value={r.value} class='value nativeV' onInput={v => {
                                const vv = (v.target as HTMLInputElement).value
                                if (!mc.allowFilter) {
                                    r.value = vv
                                } else {
                                    if (r.isNumber) {
                                        r.value = formatNumberInput(
                                            vv,
                                            r.isArray,
                                            ml.arraySplitSymbol
                                        )
                                    } else {
                                        r.value = vv
                                    }
                                }
                            }}/>
                        </div>
                    </div>
                    <div class="btn">
                        <button class={[size, 'success', 'bt']} disabled={i !== arr.length - 1} onClick={() => {
                            renderM.value.push({rId: props.randomFun(), key: '', value: ''})
                            nextTick(() => {
                                const el = dyFormListRef.value
                                el?.scrollTo({top: el.scrollHeight, behavior: 'smooth'})
                            })
                        }}>+
                        </button>
                        <button class={[
                            "danger",
                            size
                            , 'bt'
                        ]} onClick={() => {
                            renderM.value = renderM.value.filter(it => it.rId !== r.rId)
                        }}>-
                        </button>
                    </div>
                </div>)}
            </div>
            {
                <div class='control'>
                    {
                        !renderM.value.length && <button class={[
                            "success",
                            size,'bt'
                        ]} onClick={() => {
                            renderM.value.push({rId: props.randomFun(), key: '', value: ''})
                        }}>{mb.newTxt}</button>
                    }
                    {
                        !props.isController && <>
                            {!mc.hideReset && <button class={[
                                "default",
                                size,'bt'
                            ]} onClick={() => {
                                renderM.value = tranArr(props.modelValue, props.randomFun, ml.arraySplitSymbol)
                                emit('onReset')
                            }}>{mb.resetTxt}</button>}
                            <button class={[
                                "info",
                                size,'bt'
                            ]} onClick={() => {
                                renderM.value.sort((a, b) => +a.rId - +b.rId)
                                const obj = resetObj(renderM.value, ml.arraySplitSymbol)
                                emit("update:modelValue", obj)
                                emit('onMerge', obj, toRaw(renderM.value))
                                renderM.value = tranArr(obj, props.randomFun, ml.arraySplitSymbol)
                            }}>{mb.mergeTxt}</button>
                        </>
                    }
                </div>
            }
        </div>;
    }
});