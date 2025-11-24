import DynamicForm from './origin/DynamicForm';
import './index.less'
// 命名导出
export const DynamicFormPlugin = {
    install(app: any) {
        app.component('DynamicForm', DynamicForm);
    }
};
export type dynamicFormRef=InstanceType<typeof DynamicForm>&ExposeType
// 或者直接命名导出组件
export { DynamicForm };
