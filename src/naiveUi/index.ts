import NaiDynamicInput from "./NaiDynamicInput";
import NaiDynamicCascadeInput from "./NaiDynamicCascadeInput";
import NaiDynamicForm from "./NaiDynamicForm";
import type {ExposeDyFType, ExposeType} from "@/types";
import '../index.less'
export * from './hooks/renderForm'
export type naiDynamicInputRef = InstanceType<typeof NaiDynamicInput> & ExposeType
export type naiDynamicCascadeInputRef = InstanceType<typeof NaiDynamicCascadeInput> & ExposeType
export type naiDynamicFormRef = InstanceType<typeof NaiDynamicForm> & ExposeDyFType
export {NaiDynamicInput, NaiDynamicCascadeInput,NaiDynamicForm};
