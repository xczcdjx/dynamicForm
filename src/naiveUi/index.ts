import NaiveUiDynamicForm from "./NaiveUiDynamicForm";
import NaiveUiDynamicCascadeForm from "./NaiveUiDynamicCascadeForm";
import type {ExposeType} from "@/types";
import '../index.less'

export type naiveUiDynamicFormRef = InstanceType<typeof NaiveUiDynamicForm> & ExposeType
export type naiveUiDynamicCascadeFormRef = InstanceType<typeof NaiveUiDynamicCascadeForm> & ExposeType
export {NaiveUiDynamicForm, NaiveUiDynamicCascadeForm};
