import ElementPlusDynamicForm from "./ElementPlusDynamicForm";
import ElementPlusDynamicCascadeForm from "./ElementPlusDynamicCascadeForm.tsx";

import '../index.less'

export type elementPlusDynamicFormRef = InstanceType<typeof ElementPlusDynamicForm> & ExposeType
export type elementPlusCascadeDynamicFormRef = InstanceType<typeof ElementPlusDynamicCascadeForm> & ExposeType
export {ElementPlusDynamicForm, ElementPlusDynamicCascadeForm};
