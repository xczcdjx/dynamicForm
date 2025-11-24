import NaiveUiDynamicForm from "./NaiveUiDynamicForm";
import '../index.less'
export type naiveUiDynamicFormRef=InstanceType<typeof NaiveUiDynamicForm>&{
    onSet?:(obj:object)=>void
    getRenderArr?:()=>DyCFormItem[]
}
export { NaiveUiDynamicForm };
