import {computed, defineComponent, nextTick, ref} from "vue";
import {NButton, NInput, NSpace, useMessage} from "naive-ui";
import type {PropType} from 'vue'
import {parseValue} from "@/utils/tools.ts";

export default defineComponent({
    name: "NaiveUiDynamicForm",
    props: {
        dyCls: {
            type: String,
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
        onMerge: (v: ValueType) => true,
    },
    setup(props, {emit}) {
        // config
        const mb = computed(() => ({
            resetTxt: "重置",
            newTxt: "添加项",
            mergeTxt: "合并",
            ...props.btnConfigs,
        }));
        const mc = computed(() => ({
            hideReset: false,
            maxHeight: "300px",
            ...props.configs,
        }));
        const ml = computed(() => ({
            arraySplitSymbol: ',',
            ...props.dyListConfigs,
        }));
        // data
        const keyF = (i: number = 0) => Date.now() + i + ""
        const tranArr = (obj: ValueType) => Object.keys(obj).map((it, i) => {
            const v = obj[it]
            const isArray = Array.isArray(v)
            const isNumber = isArray ? v.every(v => typeof v === 'number') : typeof v === 'number'
            return {
                rId: keyF(i),
                key: it,
                value: isArray ? v.join(ml.value.arraySplitSymbol) : v,
                isArray: isArray || undefined,
                isNumber: isNumber || undefined
            }
        }) as DyCFormItem[];
        const resetObj = (arr: DyCFormItem[]) => {
            return arr.reduce((pre, cur) => {
                if (cur.key.trim()) {
                    pre[cur.key] = parseValue(cur.value, cur.isArray, cur.isNumber, ml.value.arraySplitSymbol);
                }
                return pre;
            }, {} as ValueType);
        };
        const renderM = ref(tranArr(props.modelValue));
        // node
        const dyFormListRef = ref<HTMLDivElement | null>(null)

        return () => <div class={props.dyCls ?? "dynamicForm"} style={{maxHeight: mc.value.maxHeight}}>
            <div class="dyFormList" ref={dyFormListRef}>
                {renderM.value.map((r, i, arr) => <div class="dItem" key={r.rId}>
                    <div class="input">
                        <NInput value={r.key} class="key" onInput={(v) => {
                            r.key = v
                        }}/>:
                        <NInput value={r.value} class='value' onInput={(v) => {
                            r.value = v
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
                        <NButton type="success" disabled={i !== arr.length - 1} onClick={() => {
                            renderM.value.push({rId: keyF(), key: '', value: ''})
                            nextTick(() => {
                                const el = dyFormListRef.value
                                el?.scrollTo({top: el.scrollHeight, behavior: 'smooth'})
                            })
                        }}>+</NButton>
                        <NButton type="error" onClick={() => {
                            renderM.value = renderM.value.filter(it => it.rId !== r.rId)
                        }}>-</NButton>
                    </div>
                </div>)}
            </div>
            <NSpace justify="center" class='mt-3'>
                {
                    !renderM.value.length && <NButton type="success" onClick={() => {
                        renderM.value.push({rId: keyF(), key: '', value: ''})
                    }}>{mb.value.newTxt}</NButton>
                }
                {!mc.value.hideReset && <NButton type="default" onClick={() => {
                    renderM.value = tranArr(props.modelValue)
                    emit('onReset')
                }}>{mb.value.resetTxt}</NButton>}
                <NButton type="info" onClick={() => {
                    renderM.value.sort((a, b) => +a.rId - +b.rId)
                    const obj = resetObj(renderM.value)
                    emit("update:modelValue", obj)
                    emit('onMerge', obj)
                    renderM.value = tranArr(obj)
                }}>{mb.value.mergeTxt}</NButton>
            </NSpace>
        </div>;
    }
});