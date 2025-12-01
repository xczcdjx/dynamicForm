import NaiveUiDynamicForm from "./NaiveUiDynamicForm";
import NaiveUiDynamicCascadeForm from "./NaiveUiDynamicCascadeForm";
import '../index.less'
import type {ExposeType} from "@/types";
export type naiveUiDynamicFormRef = InstanceType<typeof NaiveUiDynamicForm> & ExposeType
export type naiveUiDynamicCascadeFormRef = InstanceType<typeof NaiveUiDynamicCascadeForm> & ExposeType
export {NaiveUiDynamicForm, NaiveUiDynamicCascadeForm};
