import DynamicInput from './origin/DynamicInput';
import DynamicCascadeInput from "./origin/DynamicCascadeInput";
import type {ExposeType} from "@/types";
// 或者直接命名导出组件
export {DynamicInput, DynamicCascadeInput};
export * from './hooks/useDyForm'
export * from './hooks/useTool'
export * from './hooks/zealForm'
export * from './utils/tools'
// 命名导出
export const DynamicInputPlugin = {
    install(app: any) {
        app.component('DynamicInput', DynamicInput);
        app.component('DynamicCascadeInput', DynamicCascadeInput);
    }
};
export type dynamicInputRef = InstanceType<typeof DynamicInput> & ExposeType
export type dynamicCascadeInputRef = InstanceType<typeof DynamicCascadeInput> & ExposeType
import './index.less'