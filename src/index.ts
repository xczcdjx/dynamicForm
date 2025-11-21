import DynamicForm from './components/DynamicForm';

// 命名导出
export const DynamicFormPlugin = {
    install(app: any) {
        app.component('DyDynamicForm', DynamicForm);
    }
};

// 或者直接命名导出组件
export { DynamicForm };
