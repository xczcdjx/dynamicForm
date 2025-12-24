import type {CSSProperties, Ref, VNode} from "vue";
import type {FormItemRule, FormRules} from "naive-ui/es/form/src/interface";

export interface SelectOptionItem {
    label: string
    value: any
    class?: string;
    style?: string | CSSProperties;
    disabled?: boolean;
}

export interface BaseDyFormItem<T = any> {
    key: keyof T
    label: string
    value: Ref<any>
    placeholder?: string
    options?: SelectOptionItem[] | any[]
    onChange?: (value: any, associationItem: DyFormItem, options?: SelectOptionItem[] | any[]) => void
    span?: number
    sort?:number
}

export interface DyFormItem<K = any> extends BaseDyFormItem<K> {
    path?: string
    hidden?: boolean
    render2?: (formItem: DyFormItem) => VNode
    reset?: (formItem: DyFormItem) => void
    rule?: FormRules | FormItemRule | FormItemRule[]
    required?: boolean
    disabled?: Ref<boolean> | boolean
    clearable?: boolean
    // 以下是简化类型
    type?: "text" | "textarea" | "password"
    rows?: number
    labelField?: string
    valueField?: string
    filterable?: boolean
    multiple?: boolean
}