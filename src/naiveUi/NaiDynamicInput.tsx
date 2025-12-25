import {defineComponent, nextTick, ref, toRaw, watch} from "vue";
import {NButton, NInput} from "naive-ui";
import type {PropType} from 'vue'
import {formatNumberInput, resetObj, tranArr} from "@/utils/tools.ts";
import type {Size} from "naive-ui/es/input/src/interface";
import type {ValueType,DyRandomFun,DyBtnConfig,DyListConfig,DyConfig,DyCFormItem} from "@/types";

export default defineComponent({
    name: "NaiDynamicInput",
    props: {
        size: {
            type: String as PropType<Size>,
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
        return () => <div class={props.dyCls ?? `dynamicForm ${size}`}>
            <div class={`dyFormList ${!renderM.value.length?'noList':''}`} ref={dyFormListRef} style={{maxHeight: mc.maxHeight}}>
                {renderM.value.map((r, i, arr) => <div class="dItem" key={r.rId}>
                    <div class="input">
                        <NInput size={size} value={r.key} class="key" onInput={(v) => {
                            r.key = v
                        }}/>:
                        <NInput size={size} value={r.value} class='value' onInput={(v) => {
                            if (!mc.allowFilter) {
                                r.value = v
                            } else {
                                if (r.isNumber) {
                                    r.value = formatNumberInput(
                                        v,
                                        r.isArray,
                                        ml.arraySplitSymbol
                                    )
                                } else {
                                    r.value = v
                                }
                            }
                        }} v-slots={{
                            prefix: () => <>
                                <NButton
                                    type={r.isArray ? "success" : "default"}
                                    size="tiny"
                                    onClick={() => {
                                        r.isArray = !r.isArray
                                    }}
                                >
                                    Array
                                </NButton>
                                &nbsp;
                                <NButton
                                    type={r.isNumber ? "success" : "default"}
                                    size="tiny"
                                    onClick={() => {
                                        r.isNumber = !r.isNumber
                                    }}
                                >
                                    Number
                                </NButton>
                            </>
                        }
                        }/>
                    </div>
                    <div class="btn">
                        <NButton type="success" size={size} disabled={i !== arr.length - 1} onClick={() => {
                            renderM.value.push({rId: props.randomFun(), key: '', value: ''})
                            if (mc.autoScroll) {
                                nextTick(() => {
                                    const el = dyFormListRef.value
                                    el?.scrollTo({top: el.scrollHeight, behavior: 'smooth'})
                                })
                            }
                        }}>+</NButton>
                        <NButton size={size} type="error" onClick={() => {
                            renderM.value = renderM.value.filter(it => it.rId !== r.rId)
                        }}>-</NButton>
                    </div>
                </div>)}
            </div>
            {
                <div class={`control ${!renderM.value.length?'noList':''}`}>
                    {
                        !renderM.value.length && <NButton size={size} type="success" onClick={() => {
                            renderM.value.push({rId: props.randomFun(), key: '', value: ''})
                        }}>{mb.newTxt}</NButton>
                    }
                    {
                        !props.isController && <>
                            {!mc.hideReset && <NButton size={size} type="default" onClick={() => {
                                renderM.value = tranArr(props.modelValue, props.randomFun, ml.arraySplitSymbol)
                                emit('onReset')
                            }}>{mb.resetTxt}</NButton>}
                            <NButton size={size} type="info" onClick={() => {
                                renderM.value.sort((a, b) => +a.rId - +b.rId)
                                const obj = resetObj(renderM.value, ml.arraySplitSymbol)
                                emit("update:modelValue", obj)
                                emit('onMerge', obj, toRaw(renderM.value))
                                renderM.value = tranArr(obj, props.randomFun, ml.arraySplitSymbol)
                            }}>{mb.mergeTxt}</NButton>
                        </>
                    }
                </div>
            }
        </div>;
    }
});