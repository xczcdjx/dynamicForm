import {defineComponent, type PropType, ref, toRaw, watch} from "vue";
import {NButton, NInput} from "naive-ui";

// 其中嵌套数值和数值数组暂未处理 (后续更改)
export default defineComponent({
    name: "NaiveUiDynamicCascadeForm",
    props: {
        modelValue: {
            type: Object as PropType<ValueType>,
            required: true
        },
        dyCls: {
            type: String,
        },
        depth: {
            type: Number,
            default: 5
        },
        isController: {
            type: Boolean,
        },
    },
    emits: {
        "update:modelValue": (v: ValueType) => true,
        onReset: () => true,
        onMerge: (v: ValueType, ori: DyCasFormItem[]) => true,
    },
    setup(props, {emit}) {
        const keyF = (i: number = 0) => Date.now() + i + "";
        const allowType = (v: any): boolean => ['string', 'number'].includes(v)
        // 初始化数据，支持嵌套
        const tranMulObj = (obj: ValueType): DyCasFormItem[] =>
            Object.keys(obj).map((it, i) => {
                let v = obj[it]
                const isArray = Array.isArray(v)
                const isNull = v === null
                if (allowType(typeof v)) v = obj[it]
                if (isNull) v = ''
                return {
                    rId: keyF(i),
                    key: it,
                    value: Object.prototype.toString.call(v) === '[object Object]' ? tranMulObj(obj[it]) : isArray ? v.join(',') : v,
                    isArray: isArray || undefined
                }
            });
        const resetMulObj = (items: DyCasFormItem[]): ValueType => {
            return items.reduce((pre, cur) => {
                const v = cur.value
                if (cur.key.trim().length) {
                    pre[cur.key] = Array.isArray(v) ? resetMulObj(v) : cur.isArray ? v.split(',') : v;
                }
                return pre;
            }, {} as ValueType);
        };
        const renderM = ref<DyCasFormItem[]>(tranMulObj(props.modelValue));

        // render Cascade form
        const renderFormItems = (items: DyCasFormItem[], depth = 1, oriObj?: DyCasFormItem) => {
            return <div class={`depth-${depth}`} style={{'--depth': depth}}>
                {
                    items.map((r, i, arr) => {
                        const isChildren = Array.isArray(r.value)
                        const isAllow = allowType(typeof r.value)
                        return <div class="dItem" key={r.rId}
                                    style={{marginLeft: depth > 1 ? `${depth * 15}px` : '0px'}}>
                            <div class="input">
                                {
                                    !isChildren && <>
                                        <NInput value={r.key} class="key" onInput={(v) => (r.key = v)}/>
                                        :
                                    </>
                                }
                                <NInput
                                    class={`value ${isChildren ? 'isKey' : ''}`}
                                    value={isAllow ? r.value as string : r.key}
                                    onInput={(v) => {
                                        if (isChildren) {
                                            r.key = v
                                            return
                                        }
                                        if (isAllow) {
                                            r.value = v;
                                        }
                                    }}
                                    v-slots={{
                                        prefix: Array.isArray(r.value) ? undefined : () => <>
                                            <NButton
                                                type={r.isArray ? "success" : "default"}
                                                size="tiny"
                                                onClick={() => {
                                                    r.isArray = !r.isArray
                                                }}
                                            >
                                                Array
                                            </NButton>
                                        </>,
                                        suffix: () =>
                                            depth < props.depth ? (
                                                !isChildren && <NButton
                                                    type="success"
                                                    size="tiny"
                                                    onClick={() => {
                                                        if (isAllow) {
                                                            r.value = [];
                                                            r.isArray = undefined
                                                        }
                                                        (r.value as DyCasFormItem[]).push({
                                                            rId: keyF(),
                                                            key: "",
                                                            value: ""
                                                        });
                                                    }}
                                                >
                                                    添加 '{r.key}' 子项
                                                </NButton>
                                            ) : null
                                    }}
                                />
                            </div>
                            <div class="btn">
                                <NButton
                                    type="success"
                                    disabled={i !== arr.length - 1}
                                    onClick={() => {
                                        items.push({rId: keyF(), key: "", value: ""});
                                    }}
                                >
                                    +
                                </NButton>
                                <NButton
                                    type="error"
                                    onClick={() => {
                                        items.splice(i, 1);
                                        if (items.length < 1) {
                                            if (oriObj === undefined) return resetMulObj([])
                                            const fIndex = renderM.value.findIndex(it2 => it2.rId === oriObj?.rId)
                                            if (depth < 1) renderM.value.splice(fIndex, 1, {...oriObj!, value: ""})
                                            else oriObj!.value = ""
                                        }
                                        // console.log(r.value,r.isArray);
                                        // if (!items.length) console.log(r,items);
                                    }}
                                >
                                    -
                                </NButton>
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
        return () => (
            <div class={props.dyCls ?? `dynamicCascadeForm`}>
                <div class="dyFormList">{renderFormItems(renderM.value)}</div>
                <div class='control'>
                    {!renderM.value.length && (
                        <NButton
                            type="success"
                            onClick={() => {
                                renderM.value.push({rId: keyF(), key: "", value: ""});
                            }}
                        >
                            添加项
                        </NButton>
                    )}
                    {
                        !props.isController && <>
                            <NButton
                                type="default"
                                onClick={() => {
                                    renderM.value = tranMulObj(props.modelValue);
                                    emit('onReset')
                                }}
                            >
                                重置
                            </NButton>
                            <NButton
                                type="info"
                                onClick={() => {
                                    const obj = resetMulObj(renderM.value);
                                    emit("update:modelValue", obj);
                                    emit('onMerge', obj, toRaw(renderM.value))
                                    renderM.value = tranMulObj(obj);
                                }}
                            >
                                合并
                            </NButton>
                        </>
                    }
                </div>
            </div>
        );
    }
});
