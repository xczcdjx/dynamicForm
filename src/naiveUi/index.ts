import NaiveUiDynamicForm from "@/naiveUi/NaiveUiDynamicForm.tsx";
// 命名导出
export const DynamicFormPlugin = {
    install(app: any) {
        app.component('NaiveUiDynamicForm', NaiveUiDynamicForm);
    }
};

// 或者直接命名导出组件
export { NaiveUiDynamicForm };
