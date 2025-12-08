import NaiDynamicInput from "./NaiDynamicInput.tsx";
import NaiDynamicCascadeInput from "./NaiDynamicCascadeInput.tsx";
import type {ExposeType} from "@/types";
import '../index.less'

export type naiDynamicInputRef = InstanceType<typeof NaiDynamicInput> & ExposeType
export type naiDynamicCascadeInputRef = InstanceType<typeof NaiDynamicCascadeInput> & ExposeType
export {NaiDynamicInput, NaiDynamicCascadeInput};
