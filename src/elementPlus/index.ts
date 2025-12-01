import ElementPlusDynamicForm from "./ElementPlusDynamicForm";
import ElementPlusDynamicCascadeForm from "./ElementPlusDynamicCascadeForm.tsx";

import '../index.less'
import type {ExposeType} from "@/types";
export type elementPlusDynamicFormRef = InstanceType<typeof ElementPlusDynamicForm> & ExposeType
export type elementPlusCascadeDynamicFormRef = InstanceType<typeof ElementPlusDynamicCascadeForm> & ExposeType
export {ElementPlusDynamicForm, ElementPlusDynamicCascadeForm};
