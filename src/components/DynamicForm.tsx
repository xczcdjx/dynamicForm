import { computed, defineComponent, type PropType, ref } from "vue";
import { NButton, NInput, NSpace, useMessage } from "naive-ui";
import "./index.less";
type DyCFormItem = {
    rId: string;
    key: string;
    value: string ;
    isArray?: boolean;
    isNumber?: boolean;
};
export default defineComponent({
    name: "DynamicForm",
    props: {
        modelValue: {
            type: Object as PropType<Record<string, any>>,
            required: true
        }
    },
    emits: ["update:modelValue"],
    setup(prop, { emit }) {
        const message=useMessage()
        const keyF=(i:number=0)=>Date.now() + i + ""
        const tranArr=(obj:Record<string, any>)=>Object.keys(obj).map((it, i) => {
            const v=obj[it]
            const isArray=Array.isArray(v)
            const isNumber=isArray?v.every(v=>typeof v==='number'):typeof v==='number'
            return {rId: keyF(i), key: it, value: isArray?v.join(','):v,isArray:isArray||undefined,isNumber:isNumber||undefined}
        }) as DyCFormItem[];
        const resetObj=(arr:DyCFormItem[])=>{
            return arr.reduce((pre,cur)=>{
                if (cur.key.trim().length) {
                    const v=cur.value
                    let d:any=v
                    /*if (cur.isNumber) {
                      d = +v;
                      if (cur.isArray) {
                        d = String(v).split(",").map(it=>+it);
                      }
                    }else {
                      console.log(cur.isNumber);
                      d=cur.isArray?String(v).split(','):v
                    }*/
                    if (cur.isArray){
                        if (cur.isNumber){
                            d=String(v).split(",").map(Number).filter(it=>!Number.isNaN(it))
                        }
                        else d=String(v).split(',')
                    }else {
                        if (cur.isNumber) d=parseInt(v)
                        else d=v
                    }
                    pre[cur.key] = d
                }
                return pre
            },{} as Record<string, any>);
        }
        const renderM = ref(tranArr(prop.modelValue));
        return () => <div class="dynamicForm">
            <div class="form">
                {renderM.value.map((r,i,arr) => <div class="dItem" key={r.rId}>
                    <div class="input">
                        <NInput value={r.key} class="key" onInput={(v)=>{r.key=v}}/>:
                        <NInput value={r.value} onInput={(v)=>{r.value=v}}  v-slots={{
                            prefix: () =><>
                                <NButton
                                    type={r.isArray?"success":"default"}
                                    size="tiny"
                                    onClick={() => {
                                        r.isArray=!r.isArray
                                    }}
                                >
                                    Array
                                </NButton>
                                &nbsp;
                                <NButton
                                    type={r.isNumber?"success":"default"}
                                    size="tiny"
                                    onClick={() => {
                                        r.isNumber=!r.isNumber
                                    }}
                                >
                                    Number
                                </NButton>
                            </>}
                        }/>
                    </div>
                    <div class="btn">
                        <NButton type="success" disabled={i!==arr.length-1} onClick={() => {
                            renderM.value.push({rId: keyF(),key: '',value: ''})
                        }}>+</NButton>
                        <NButton type="error" onClick={() => {
                            renderM.value=renderM.value.filter(it=>it.rId!==r.rId)
                        }}>-</NButton>
                    </div>
                </div>)}
            </div>
            <NSpace justify="center" class='mt-3'>
                {
                    !renderM.value.length&&<NButton type="success" onClick={() => {
                        renderM.value.push({rId: keyF(),key: '',value: ''})
                    }}>添加项</NButton>
                }
                <NButton type="default" onClick={() => {
                    renderM.value=tranArr(prop.modelValue)
                    message.info('数据已重置')
                }}>重置</NButton>
                <NButton type="info" onClick={() => {
                    renderM.value.sort((a, b)=>+a.rId-+b.rId)
                    const obj=resetObj(renderM.value)
                    emit("update:modelValue", obj)
                    renderM.value=tranArr(obj)
                    message.success('数据已合并')
                }}>合并</NButton>
            </NSpace>
        </div>;
    }
});