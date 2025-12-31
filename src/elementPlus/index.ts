import EleDynamicInput from "./EleDynamicInput";
import EleDynamicCascadeInput from "./EleDynamicCascadeInput";
import EleDynamicForm from "./EleDynamicForm";
import type {ExposeDyFType, ExposeType} from "@/types";
import {useDecorateForm} from './hooks/decorateForm'
export {useDecorateForm}
import '../index.less'
export * from './hooks/renderForm'
export type eleDynamicInputRef = InstanceType<typeof EleDynamicInput> & ExposeType
export type eleCascadeDynamicInputRef = InstanceType<typeof EleDynamicCascadeInput> & ExposeType
export type eleDynamicFormRef = InstanceType<typeof EleDynamicForm> & ExposeDyFType
export {EleDynamicInput, EleDynamicCascadeInput,EleDynamicForm};
