import {defineComponent, nextTick, ref, toRaw, watch} from "vue";
import type {PropType} from 'vue'
import {formatNumberInput, resetObj, tranArr} from "@/utils/tools.ts";
import {ElButton, ElInput} from "element-plus";

export default defineComponent({
    name: "ElementPlusDynamicForm",
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
            onSet: (o: object) => {
                renderM.value = tranArr(o, props.randomFun, ml.arraySplitSymbol)
            },
            getRenderArr: () => {
                return toRaw(renderM.value)
            }
        })
        return () => <div class={props.dyCls ?? `dynamicForm ${size}`} style={{maxHeight: mc.maxHeight}}>
            <div class="dyFormList" ref={dyFormListRef}>
                {renderM.value.map((r, i, arr) => <div class="dItem" key={r.rId}>
                    <div class="input">
                        <ElInput size={size} modelValue={r.key} class="key" onInput={(v) => {
                            r.key = v
                        }}/>:
                        <ElInput size={size} modelValue={r.value} class='value' onInput={(v) => {
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
                                <ElButton
                                    class='typeBtn'
                                    type={r.isArray ? "success" : "default"}
                                    size="small"
                                    onClick={() => {
                                        r.isArray = !r.isArray
                                    }}
                                >
                                    Array
                                </ElButton>
                                &nbsp;
                                <ElButton
                                    class='typeBtn'
                                    type={r.isNumber ? "success" : "default"}
                                    size="small"
                                    onClick={() => {
                                        r.isNumber = !r.isNumber
                                    }}
                                >
                                    Number
                                </ElButton>
                            </>
                        }
                        }/>
                    </div>
                    <div class="btn">
                        <ElButton type="success" size={size} disabled={i !== arr.length - 1} onClick={() => {
                            renderM.value.push({rId: props.randomFun(), key: '', value: ''})
                            nextTick(() => {
                                const el = dyFormListRef.value
                                el?.scrollTo({top: el.scrollHeight, behavior: 'smooth'})
                            })
                        }}>+</ElButton>
                        <ElButton size={size} type="danger" onClick={() => {
                            renderM.value = renderM.value.filter(it => it.rId !== r.rId)
                        }}>-</ElButton>
                    </div>
                </div>)}
            </div>
            {
                <div class='control'>
                    {
                        !renderM.value.length && <ElButton size={size} type="success" onClick={() => {
                            renderM.value.push({rId: props.randomFun(), key: '', value: ''})
                        }}>{mb.newTxt}</ElButton>
                    }
                    {
                        !props.isController && <>
                            {!mc.hideReset && <ElButton size={size} type="default" onClick={() => {
                                renderM.value = tranArr(props.modelValue, props.randomFun, ml.arraySplitSymbol)
                                emit('onReset')
                            }}>{mb.resetTxt}</ElButton>}
                            <ElButton size={size} type="info" onClick={() => {
                                renderM.value.sort((a, b) => +a.rId - +b.rId)
                                const obj = resetObj(renderM.value, ml.arraySplitSymbol)
                                emit("update:modelValue", obj)
                                emit('onMerge', obj, toRaw(renderM.value))
                                renderM.value = tranArr(obj, props.randomFun, ml.arraySplitSymbol)
                            }}>{mb.mergeTxt}</ElButton>
                        </>
                    }
                </div>
            }
        </div>;
    }
});