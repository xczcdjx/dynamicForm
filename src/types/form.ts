import type {MessageApi} from "naive-ui";
import type {Ref, VNode} from "vue";
export interface SelectOptionItem {
    label: string
    value: any
}
export interface TableSearchItem<T=any>{
    key: keyof T
    label: string
    value: any
    placeholder?: string
    associatedOption?: string
    onChange?: (value: any, associationItem: string) => void
    span?: number
}
export interface FormItem<U=any> extends TableSearchItem<U> {
    required?: boolean
    validator?: (value: FormItem, message: MessageApi) => boolean
    hidden?: boolean
    inputType?: string
    maxLength?: number
    rows?: number
    disabled?: Ref<boolean> | boolean
    optionItems?: Array<SelectOptionItem>
    path?: string
    reset?: (formItem: FormItem) => void
    render?: (formItem: FormItem) => VNode
}