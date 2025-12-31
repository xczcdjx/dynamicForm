import EleDynamicInput from "./EleDynamicInput";
import EleDynamicCascadeInput from "./EleDynamicCascadeInput";
import EleDynamicForm from "./EleDynamicForm";
import type {ExposeDyFType, ExposeType} from "@/types";
import '../index.less'
export * from './hooks/renderForm'
export * from './hooks/decorateForm'
export type eleDynamicInputRef = InstanceType<typeof EleDynamicInput> & ExposeType
export type eleCascadeDynamicInputRef = InstanceType<typeof EleDynamicCascadeInput> & ExposeType
export type eleDynamicFormRef = InstanceType<typeof EleDynamicForm> & ExposeDyFType
export {EleDynamicInput, EleDynamicCascadeInput,EleDynamicForm};
