import NaiveUiDynamicForm from "./NaiveUiDynamicForm";
import NaiveUiDynamicCascadeForm from "./NaiveUiDynamicCascadeForm";
import '../index.less'

export type naiveUiDynamicFormRef = InstanceType<typeof NaiveUiDynamicForm> & ExposeType
export type naiveUiDynamicCascadeFFormRef = InstanceType<typeof NaiveUiDynamicCascadeForm> & ExposeType
export {NaiveUiDynamicForm, NaiveUiDynamicCascadeForm};
