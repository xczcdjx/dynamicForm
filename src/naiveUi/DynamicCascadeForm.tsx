import {defineComponent, type PropType, ref, toRaw} from "vue";
import {NButton, NInput, NSpace, useMessage} from "naive-ui";
import '../index.less'

type DyFormItem = {
    rId: string;
    key: string;
    value: string | DyFormItem[];
    isArray?: boolean
};
// 其中嵌套数值和数值数组暂未处理 (后续更改)
export default defineComponent({
    name: "DynamicCascadeForm",
    props: {
        modelValue: {
            type: Object as PropType<Record<string, any>>,
            required: true
        },
        depth: {
            type: Number,
            default: 5
        }
    },
    emits: ["update:modelValue"],
    setup(prop, {emit}) {
        const message = useMessage();
        const keyF = (i: number = 0) => Date.now() + i + "";
        const allowType = (v: any): boolean => ['string', 'number'].includes(v)
        // 初始化数据，支持嵌套
        const tranMulObj = (obj: Record<string, any>): DyFormItem[] =>
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
        const resetMulObj = (items: DyFormItem[]): Record<string, any> => {
            return items.reduce((pre, cur) => {
                const v = cur.value
                if (cur.key.trim().length) {
                    pre[cur.key] = Array.isArray(v) ? resetMulObj(v) : cur.isArray ? v.split(',') : v;
                }
                return pre;
            }, {} as Record<string, any>);
        };
        const renderM = ref<DyFormItem[]>(tranMulObj(prop.modelValue));

        // 递归渲染表单项
        const renderFormItems = (items: DyFormItem[], depth = 1, oriObj?: DyFormItem) => {
            // 不判断长度
            return <div class={`depth-${depth}`}>
                {
                    items.map((r, i, arr) => {
                        const isChildren = Array.isArray(r.value)
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
                                    //@ts-ignore
                                    value={allowType(typeof r.value) ? r.value : r.key}
                                    style={{
                                        textAlign: isChildren ? 'center' : 'left',
                                    }}
                                    onInput={(v) => {
                                        if (isChildren) {
                                            r.key = v
                                            return
                                        }
                                        if (allowType(typeof r.value)) {
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
                                            depth < prop.depth ? (
                                                !isChildren && <NButton
                                                    type="success"
                                                    size="tiny"
                                                    onClick={() => {
                                                        if (['string', 'number'].includes(typeof r.value)) {
                                                            r.value = [];
                                                            r.isArray = undefined
                                                        }
                                                        (r.value as DyFormItem[]).push({
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
            /*return items.length && <div class={`depth-${depth}`}>
              <></>
            </div> || <></>*/
        };

        return () => (
            <div class="dynamicCascadeForm">
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
                    <NButton
                        type="default"
                        onClick={() => {
                            renderM.value = tranMulObj(prop.modelValue);
                            message.info("数据已重置");
                        }}
                    >
                        重置
                    </NButton>
                    <NButton
                        type="info"
                        onClick={() => {
                            const obj = resetMulObj(renderM.value);
                            emit("update:modelValue", obj);
                            console.log(obj);
                            renderM.value = tranMulObj(obj);
                            message.success("数据已合并");
                        }}
                    >
                        合并
                    </NButton>
                </div>
            </div>
        );
    }
});
