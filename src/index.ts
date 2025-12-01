import DynamicForm from './origin/DynamicForm';
import DynamicCascadeForm from "./origin/DynamicCascadeForm";

import './index.less'
import type {ExposeType} from "@/types";
// 命名导出
export const DynamicFormPlugin = {
    install(app: any) {
        app.component('DynamicForm', DynamicForm);
        app.component('DynamicCascadeForm', DynamicCascadeForm);
    }
};
export type dynamicFormRef = InstanceType<typeof DynamicForm> & ExposeType
export type dynamicCascadeFormRef = InstanceType<typeof DynamicCascadeForm> & ExposeType
// 或者直接命名导出组件
export {DynamicForm,DynamicCascadeForm};
