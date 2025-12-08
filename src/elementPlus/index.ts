import EleDynamicInput from "./EleDynamicInput.tsx";
import EleDynamicCascadeInput from "./EleDynamicCascadeInput.tsx";
import type {ExposeType} from "@/types";
import '../index.less'

export type eleDynamicInputRef = InstanceType<typeof EleDynamicInput> & ExposeType
export type eleCascadeDynamicInputRef = InstanceType<typeof EleDynamicCascadeInput> & ExposeType
export {EleDynamicInput, EleDynamicCascadeInput};
