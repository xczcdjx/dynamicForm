import NaiveUiDynamicForm from "./NaiveUiDynamicForm";
import NaiveUiDynamicCascadeForm from "./NaiveUiDynamicCascadeForm";
import '../index.less'

export type naiveUiDynamicFormRef = InstanceType<typeof NaiveUiDynamicForm> & ExposeType
export {NaiveUiDynamicForm, NaiveUiDynamicCascadeForm};
