import {defineComponent, nextTick, ref, type SlotsType, toRaw, watch} from "vue";
import {NButton, NInput} from "naive-ui";
import type {PropType} from 'vue'
import {formatNumberInput, resetObj, tranArr} from "@/utils/tools.ts";
import type {Size} from "naive-ui/es/input/src/interface";
import type {
    ValueType,
    DyRandomFun,
    DyBtnConfig,
    DyListConfig,
    DyConfig,
    DyCFormItem,
    DynamicInputSlots
} from "@/types";

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
    slots: Object as SlotsType<DynamicInputSlots>,
    setup(props, {emit, expose, slots}) {
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
            hideArrayBtn:false,
            hideNumberBtn:false,
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
        // function
        const newItem = () => renderM.value.push({rId: props.randomFun(), key: '', value: ''})
        const reset = () => {
            renderM.value = tranArr(props.modelValue, props.randomFun, ml.arraySplitSymbol)
            emit('onReset')
        }
        const merge = () => {
            renderM.value.sort((a, b) => +a.rId - +b.rId)
            const obj = resetObj(renderM.value, ml.arraySplitSymbol)
            emit("update:modelValue", obj)
            emit('onMerge', obj, toRaw(renderM.value))
            renderM.value = tranArr(obj, props.randomFun, ml.arraySplitSymbol)
        }
        return () => <div class={`dynamicForm ${size} ${props.dyCls}`}>
            <div class={`dyFormList ${!renderM.value.length ? 'noList' : ''}`} ref={dyFormListRef}
                 style={{maxHeight: mc.maxHeight}}>
                {renderM.value.map((r, i, arr) => {
                        const scope = {
                            row: r,
                            index: i,
                            isLast: i === arr.length - 1,
                            addItem: () => {
                                renderM.value.push({rId: props.randomFun(), key: '', value: ''})
                                if (mc.autoScroll) {
                                    nextTick(() => {
                                        const el = dyFormListRef.value
                                        el?.scrollTo({top: el.scrollHeight, behavior: 'smooth'})
                                    })
                                }
                            },
                            removeItem: () => {
                                renderM.value = renderM.value.filter(it => it.rId !== r.rId)
                            },
                            toggleArray: () => (r.isArray = !r.isArray),
                            toggleNumber: () => (r.isNumber = !r.isNumber),
                        };
                        return <div class="dItem" key={r.rId}>
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
                                    prefix: () => slots.typeTools
                                        ? slots.typeTools(scope)
                                        : <>
                                        {!mc.hideArrayBtn &&<NButton
                                                type={r.isArray ? "success" : "default"}
                                                size="tiny"
                                                onClick={scope.toggleArray}
                                            >
                                                Array
                                            </NButton>}
                                            &nbsp;
                                        {!mc.hideNumberBtn &&<NButton
                                                type={r.isNumber ? "success" : "default"}
                                                size="tiny"
                                                onClick={scope.toggleNumber}
                                            >
                                                Number
                                            </NButton>}
                                        </>
                                }
                                }/>
                            </div>
                            <div class="btn">
                                {slots.rowActions ? slots.rowActions(scope) : <>
                                    <NButton type="success" size={size} disabled={!scope.isLast}
                                             onClick={scope.addItem}>+</NButton>
                                    <NButton size={size} type="error" onClick={scope.removeItem}>-</NButton>
                                </>}
                            </div>
                        </div>
                    }
                )}
            </div>
            {
                <div class={`control ${!renderM.value.length ? 'noList' : ''}`}>
                    {
                        !renderM.value.length && (slots.newBtn ? slots.newBtn({newItem}) :
                            <NButton size={size} type="success" onClick={newItem}>{mb.newTxt}</NButton>)
                    }
                    {
                        !props.isController && <>
                            {!mc.hideReset && (slots.resetBtn ? slots.resetBtn({reset}) :
                                <NButton size={size} type="default" onClick={reset}>{mb.resetTxt}</NButton>)}
                            {slots.mergeBtn ? slots.mergeBtn({merge}) :
                                <NButton size={size} type="info" onClick={merge}>{mb.mergeTxt}</NButton>}
                        </>
                    }
                </div>
            }
        </div>;
    }
});