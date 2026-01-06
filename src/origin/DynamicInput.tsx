import {defineComponent, nextTick, ref, type SlotsType, toRaw, watch} from "vue";
import type {PropType} from 'vue'
import {formatNumberInput, resetObj, tranArr} from "@/utils/tools.ts";
import type {
    FSize,
    ValueType,
    DyRandomFun,
    DyBtnConfig,
    DyListConfig,
    DyConfig,
    DyCFormItem,
    DynamicInputSlots
} from "@/types";

export default defineComponent({
    name: "DynamicInput",
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
            hideArrayBtn: false,
            hideNumberBtn: false,
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
        return () => <div class={props.dyCls ?? `dynamicForm ${size}`}>
            <div class="dyFormList" ref={dyFormListRef} style={{maxHeight: mc.maxHeight}}>
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
                                <input size={size} value={r.key} class="key nativeInput" onInput={v => {
                                    r.key = (v.target as HTMLInputElement).value
                                }}/>:
                                <div class="vInput">
                                    <div class="slot">
                                        {slots.typeTools
                                            ? slots.typeTools(scope)
                                            : (
                                                <>
                                                    {!mc.hideArrayBtn && <button
                                                        class={[r.isArray ? "success" : "default", "small", "bt"]}
                                                        onClick={scope.toggleArray}>Array
                                                    </button>}
                                                    {!mc.hideNumberBtn && <button
                                                        class={[r.isNumber ? "success" : "default", "small", "bt"]}
                                                        onClick={scope.toggleNumber}>Number
                                                    </button>}
                                                </>
                                            )}
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
                                {slots.rowActions ? slots.rowActions(scope) : <>
                                    <button class={[size, 'success', 'bt']} disabled={scope.isLast}
                                            onClick={scope.addItem}>+
                                    </button>
                                    <button class={[
                                        "danger",
                                        size
                                        , 'bt'
                                    ]} onClick={scope.removeItem}>-
                                    </button>
                                </>}
                            </div>
                        </div>
                    }
                )}
            </div>
            {
                <div class='control'>
                    {
                        !renderM.value.length && (slots.newBtn ? slots.newBtn({newItem}) : (<button class={[
                            "success",
                            size, 'bt'
                        ]} onClick={newItem}>{mb.newTxt}</button>))
                    }
                    {
                        !props.isController && <>
                            {!mc.hideReset && slots.resetBtn ? slots.resetBtn({reset}) : <button class={[
                                "default",
                                size, 'bt'
                            ]} onClick={reset}>{mb.resetTxt}</button>}
                            {slots.mergeBtn ? slots.mergeBtn({merge}) : <button class={[
                                "info",
                                size, 'bt'
                            ]} onClick={merge}>{mb.mergeTxt}</button>}
                        </>
                    }
                </div>
            }
        </div>;
    }
});