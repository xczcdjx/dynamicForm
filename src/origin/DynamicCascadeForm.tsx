import {defineComponent, type PropType, ref, toRaw, watch} from "vue";
import {formatNumberInput, parseValue, saferRepairColor} from "@/utils/tools.ts";
export default defineComponent({
    name: "DynamicCascadeForm",
    props: {
        modelValue: {
            type: Object as PropType<ValueType>,
            required: true
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
        // 子层深度 (超过则不再出现添加选项)
        depth: {
            type: Number,
            default: 3
        },
        btnConfigs: {
            type: Object as PropType<Partial<DyBtnConfig>>,
        },
        configs: {
            type: Object as PropType<DyCasConfig>,
        },
        dyListConfigs: {
            type: Object as PropType<DyListConfig>,
        },
        newChildTxt: {
            type: Function as PropType<(it: DyCasFormItem) => string>,
            default: (it: DyCasFormItem) => `添加 '${it.key}' 子项`
        },
    },
    emits: {
        "update:modelValue": (v: ValueType) => true,
        onReset: () => true,
        onMerge: (v: ValueType, ori: DyCasFormItem[]) => true,
    },
    setup(props, {emit, expose}) {
        // config
        const mb: DyBtnConfig = {
            resetTxt: "重置",
            newTxt: "添加项",
            mergeTxt: "合并",
            ...props.btnConfigs,
        }
        const mc: DyCasConfig = {
            hideReset: false,
            maxHeight: "600px",
            allowFilter: true,
            showBorder: true,
            showPad: true,
            retractLen: 0,
            borderColors: [],
            ...props.configs,
        }
        const ml: DyListConfig = {
            arraySplitSymbol: ',',
            ...props.dyListConfigs,
        }
        // function
        const allowType = (v: any): boolean => ['string', 'number'].includes(v)
        // 初始化数据，支持嵌套
        const tranMulObj = (obj: ValueType): DyCasFormItem[] =>
            Object.keys(obj).map((it, i) => {
                let v = obj[it]
                const isArray = Array.isArray(v)
                const isNumber = isArray ? v.every((it2: string | number) => typeof it2 === 'number') : typeof v === 'number'
                const isNull = v === null
                if (allowType(typeof v)) v = obj[it]
                if (isNull) v = ''
                return {
                    rId: props.randomFun(i),
                    key: it,
                    value: Object.prototype.toString.call(v) === '[object Object]' ? tranMulObj(obj[it]) : isArray ? v.join(ml.arraySplitSymbol) : v,
                    isArray: isArray || undefined,
                    isNumber: isNumber || undefined
                }
            });
        const resetMulObj = (items: DyCasFormItem[]): ValueType => {
            return items.reduce((pre, cur) => {
                const v = cur.value
                if (cur.key.trim().length) {
                    pre[cur.key] = Array.isArray(v) ? resetMulObj(v) : parseValue(cur.value as string, cur.isArray, cur.isNumber, ml.arraySplitSymbol);
                }
                return pre;
            }, {} as ValueType);
        };
        const renderM = ref<DyCasFormItem[]>(tranMulObj(props.modelValue));

        // render Cascade form
        const renderFormItems = (items: DyCasFormItem[], depth = 1, oriObj?: DyCasFormItem) => {
            return <div class={[
                `depth-${depth}`,
                mc.showBorder ? '' : 'no-border',
                mc.showPad ? '' : 'no-pad',
            ]}
                        style={{
                            '--depth': depth,
                            ['--c' + [depth]]: saferRepairColor(mc.borderColors!, depth),
                        }}>
                {
                    items.map((r, i, arr) => {
                        const isChildren = Array.isArray(r.value)
                        const isAllow = allowType(typeof r.value)
                        return <div class="dItem" key={r.rId}
                                    style={{marginLeft: depth > 1 ? `${depth * mc.retractLen!}px` : '0'}}>
                            <div class="input">
                                {
                                    !isChildren && <>
                                        <input value={r.key} class="key nativeInput"
                                               onInput={(v) => (r.key = (v.target as HTMLInputElement).value)}/>
                                        :
                                    </>
                                }
                                {
                                    /*
                                    v-slots={{
                                        prefix:
                                        Array.isArray(r.value) ? undefined : () => <>
                                            <button
                                                type={r.isArray ? "success" : "default"}
                                                size="tiny"
                                                onClick={() => {
                                                    r.isArray = !r.isArray
                                                }}
                                            >
                                                Array
                                            </button>
                                            &nbsp;
                                            <button
                                                type={r.isNumber ? "success" : "default"}
                                                size="tiny"
                                                onClick={() => {
                                                    r.isNumber = !r.isNumber
                                                }}
                                            >
                                                Number
                                            </button>
                                        </>,
                                        suffix: () =>
                                            depth < props.depth ? (
                                                !isChildren && <button
                                                    type="success"
                                                    size="tiny"
                                                    onClick={() => {
                                                        if (isAllow) {
                                                            r.value = [];
                                                            r.isArray = undefined
                                                        }
                                                        (r.value as DyCasFormItem[]).push({
                                                            rId: props.randomFun(),
                                                            key: "",
                                                            value: ""
                                                        });
                                                    }}
                                                >
                                                    {props.newChildTxt(r)}
                                                </button>
                                            ) : null
                                    }}
                                    * */
                                }
                                <div class="vInput">
                                    <div class="slot">
                                        {Array.isArray(r.value) ? undefined :  <>
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
                                        </>}
                                    </div>
                                    <input
                                        class={`value nativeV ${isChildren ? 'isKey' : ''}`}
                                        value={isAllow ? r.value as string : r.key}
                                        onInput={(tv) => {
                                            const v = (tv.target as HTMLInputElement).value
                                            if (isChildren) {
                                                r.key = v
                                                return
                                            }
                                            if (!mc.allowFilter) r.value = v
                                            else {
                                                if (r.isNumber) {
                                                    r.value = formatNumberInput(
                                                        v,
                                                        r.isArray,
                                                        ml.arraySplitSymbol
                                                    )
                                                } else r.value = v
                                            }
                                        }}
                                    />
                                    <div class="surSlot">
                                        {
                                            depth < props.depth ? (
                                                !isChildren && <button
                                                    class={[
                                                        "success",
                                                        "bt"
                                                    ]}
                                                    onClick={() => {
                                                        if (isAllow) {
                                                            r.value = [];
                                                            r.isArray = undefined
                                                        }
                                                        (r.value as DyCasFormItem[]).push({
                                                            rId: props.randomFun(),
                                                            key: "",
                                                            value: ""
                                                        });
                                                    }}
                                                >
                                                    {props.newChildTxt(r)}
                                                </button>
                                            ) : null
                                        }
                                    </div>
                                </div>
                            </div>
                            <div class="btn">
                                <button
                                    class={['success', 'bt']}
                                    disabled={i !== arr.length - 1}
                                    onClick={() => {
                                        items.push({rId: props.randomFun(), key: "", value: ""});
                                    }}
                                >
                                    +
                                </button>
                                <button
                                    class={[
                                        "danger",
                                        'bt'
                                    ]}
                                    onClick={() => {
                                        items.splice(i, 1);
                                        if (items.length < 1) {
                                            if (oriObj === undefined) return resetMulObj([])
                                            const fIndex = renderM.value.findIndex(it2 => it2.rId === oriObj?.rId)
                                            if (depth < 1) renderM.value.splice(fIndex, 1, {...oriObj!, value: ""})
                                            else oriObj!.value = ""
                                        }
                                    }}
                                >
                                    -
                                </button>
                            </div>
                            {Array.isArray(r.value) && renderFormItems(r.value, depth + 1, r)}
                        </div>
                    })
                }
            </div>
        };

        // supervise
        watch(
            renderM,
            (list) => {
                if (!props.isController) return
                const obj = resetMulObj(list)
                emit('update:modelValue', obj)
                emit('onMerge', obj, toRaw(renderM.value))
            },
            {deep: true}
        )
        //expose
        expose({
            onSet: (o?: object) => {
                renderM.value = tranMulObj(o ?? props.modelValue)
            },
            getResult: (t: 'res' | 'ori' = 'res') => {
                return t === 'ori' ? toRaw(renderM.value) : resetMulObj(renderM.value)
            },
        })
        return () => (
            <div class={props.dyCls ?? `dynamicCascadeForm`}>
                <div class="dyFormList" style={{maxHeight: mc.maxHeight}}>{renderFormItems(renderM.value)}</div>
                <div class='control'>
                    {!renderM.value.length && (
                        <button
                            class={[
                                "success", 'bt'
                            ]}
                            onClick={() => {
                                renderM.value.push({rId: props.randomFun(), key: "", value: ""});
                            }}
                        >
                            {mb.newTxt}
                        </button>
                    )}
                    {
                        !props.isController && <>
                            {!mc.hideReset && <button
                                class={[
                                    "default", 'bt'
                                ]}
                                onClick={() => {
                                    renderM.value = tranMulObj(props.modelValue);
                                    emit('onReset')
                                }}
                            >
                                {mb.resetTxt}
                            </button>}
                            <button
                                class={[
                                    "info", 'bt'
                                ]}
                                onClick={() => {
                                    const obj = resetMulObj(renderM.value);
                                    emit("update:modelValue", obj);
                                    emit('onMerge', obj, toRaw(renderM.value))
                                    renderM.value = tranMulObj(obj);
                                }}
                            >
                                {mb.mergeTxt}
                            </button>
                        </>
                    }
                </div>
            </div>
        );
    }
});
