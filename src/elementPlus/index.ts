import ElementPlusDynamicForm from "@/elementPlus/ElementPlusDynamicForm.tsx";
// 命名导出
export const DynamicFormPlugin = {
    install(app: any) {
        app.component('ElementPlusDynamicForm', ElementPlusDynamicForm);
    }
};

// 或者直接命名导出组件
export { ElementPlusDynamicForm };
