import DynamicInput from './origin/DynamicInput';
import DynamicCascadeInput from "./origin/DynamicCascadeInput";
import type {ExposeType} from "@/types";
import './index.less'
// 命名导出
export const DynamicInputPlugin = {
    install(app: any) {
        app.component('DynamicInput', DynamicInput);
        app.component('DynamicCascadeInput', DynamicCascadeInput);
    }
};
export type dynamicInputRef = InstanceType<typeof DynamicInput> & ExposeType
export type dynamicCascadeInputRef = InstanceType<typeof DynamicCascadeInput> & ExposeType
// 或者直接命名导出组件
export {DynamicInput, DynamicCascadeInput};
