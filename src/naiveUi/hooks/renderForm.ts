import {

    NButton,
    NCheckbox,
    NCheckboxGroup,
    NDatePicker, NImage,
    NInput,
    NPopselect,
    NRadioButton,
    NRadioGroup,
    NSelect,
    NSpace,
    NSwitch,
    NTag,
    NTimePicker,
    NTreeSelect,

} from "naive-ui";
import type {
    CheckboxGroupProps,
    CheckboxProps,
    DatePickerProps,
    InputProps,
    PopselectProps,
    RadioButtonProps,
    RadioGroupProps,
    SelectOption,
    SelectProps,
    SwitchProps,
    TagProps,
    TimePickerProps,
    TreeSelectProps
} from 'naive-ui';
import type {Value as DatePickerValue} from "naive-ui/lib/date-picker/src/interface";
import type {SelectGroupOption, Value as SelectValue} from "naive-ui/lib/select/src/interface";
import type {TreeSelectOption, Value} from "naive-ui/lib/tree-select/src/interface";
import {type AllowedComponentProps, computed, createVNode, h, type Ref, type VNode} from "vue";
import type {DyFormItem} from "@/types/form.ts";

// 输入
export function renderInput(model: Ref<string>, optionProps: InputProps | AllowedComponentProps = {}) {
    return h(NInput, {
        value: model.value,
        onUpdateValue: (newVal: string) => {
            model.value = newVal;
            // @ts-ignore
            optionProps.onChange?.(newVal, optionProps);
        },
        ...optionProps
    });
}

// 下拉
export function renderSelect(
    model: Ref<SelectValue>,
    options: SelectOption[],
    optionProps: SelectProps | AllowedComponentProps = {}
) {
    const {value, ...resetProps} = optionProps as DyFormItem
    return h(NSelect, {
        value: model.value,
        options,
        onUpdateValue: (newVal: any) => {
            model.value = newVal;
            // @ts-ignore
            optionProps.onChange?.(newVal, optionProps, options);
        },
        ...resetProps as SelectProps | AllowedComponentProps
    });
}

export function renderPopSelect(
    model: Ref<string | number | Array<string | number> | null>,
    options: Array<SelectOption | SelectGroupOption>,
    optionProps: PopselectProps | AllowedComponentProps = {},
    defaultRender: VNode = createVNode(NButton, null, {
        default: () => model.value || "请选择"
    })
) {
    const {value, labelField, valueField, ...resetProps} = optionProps as DyFormItem
    const labelF = labelField ?? 'label'
    const valueF = valueField ?? 'value'
    const mOptions = resetProps.options ?? options
    return createVNode(
        NPopselect,
        {
            value: model.value,
            onUpdateValue: (newVal: string | number | Array<string | number> | null) => {
                model.value = newVal;
                // @ts-ignore
                options.onChange?.(newVal, optionProps, options);
            },
            options: mOptions.map(it => ({...it, label: it[labelF], value: it[valueF]})),
            ...resetProps as PopselectProps | AllowedComponentProps,
        },
        {
            default: () => defaultRender
        }
    );
}

export function renderTreeSelect(
    model: Ref<Value>,
    options: TreeSelectOption[],
    optionProps: TreeSelectProps | AllowedComponentProps = {}
) {
    const {value, valueField = 'value', ...resetProps} = optionProps as DyFormItem
    return h(NTreeSelect, {
        value: model.value,
        options,
        onUpdateValue: (newVal) => {
            model.value = newVal;
            // @ts-ignore
            optionProps.onChange?.(newVal, optionProps, options);
        },
        keyField: valueField,
        ...resetProps as TreeSelectProps | AllowedComponentProps
    });
}

// 单复选
export function renderRadioButtonGroup(
    value: Ref<string | number | null | undefined>,
    options: RadioButtonProps[],
    optionProps: RadioGroupProps | AllowedComponentProps = {},
) {
    return createVNode(
        NRadioGroup,
        {
            value: value.value,
            ...optionProps,
            onUpdateValue: (newVal: string | number | null | undefined) => {
                value.value = newVal;
                // @ts-ignore
                optionProps.onChange?.(newVal, optionProps, options);
            }
        },
        {
            default: () => {
                //@ts-ignore
                const opts = optionProps.options ?? options
                return opts.map((it: RadioButtonProps) => {
                    const opt = optionProps as DyFormItem
                    const label = it[(opt?.labelField ?? 'label') as keyof RadioButtonProps] as string;
                    const value = it[(opt?.valueField ?? 'value') as keyof RadioButtonProps] as string;
                    return createVNode(
                        NRadioButton,
                        {
                            ...it,
                            label,
                            value
                        },
                        {
                            default: () => it.label
                        }
                    );
                });
            }
        }
    );
}

export function renderCheckboxGroup(
    model: Ref<(string | number)[]>,
    options: CheckboxProps[],
    optionProps: CheckboxGroupProps | AllowedComponentProps = {}
) {
    const {value, ...resetProps} = optionProps as DyFormItem
    return h(
        NCheckboxGroup,
        {
            value: model.value,
            onUpdateValue: (newVal) => {
                model.value = newVal;
                // @ts-ignore
                optionProps.onChange?.(newVal, optionProps, options);
            },
            ...resetProps as CheckboxGroupProps as AllowedComponentProps,
        },
        {
            default: () => {
                return h(
                    NSpace,
                    {
                        itemStyle: "display: flex"
                    },
                    {
                        default: () => {
                            //@ts-ignore
                            const opts = optionProps.options ?? options
                            return opts.map((it: CheckboxProps) => {
                                const opt = optionProps as DyFormItem
                                const label = it[(opt?.labelField ?? 'label') as keyof CheckboxProps] as string;
                                const value = it[(opt?.valueField ?? 'value') as keyof CheckboxProps] as string;
                                return h(NCheckbox, {
                                    value,
                                    label,
                                });
                            });
                        }
                    }
                );
            }
        }
    );
}

// 开关
export function renderSwitch(
    value: Ref<boolean>,
    optionProps: SwitchProps | AllowedComponentProps = {}
) {
    return h(NSwitch, {
        value: value.value,
        onUpdateValue: (newVal: boolean) => {
            value.value = newVal;
            // @ts-ignore
            optionProps.onChange?.(newVal, optionProps);
        },
        ...optionProps
    });
}

// 日期时间
export function renderDatePicker(
    value: Ref<DatePickerValue>,
    optionProps: DatePickerProps | AllowedComponentProps = {}
) {
    return h(NDatePicker, {
        value: value.value,
        onUpdateValue: (newVal: any) => {
            value.value = newVal;
            // @ts-ignore
            optionProps.onChange?.(newVal, optionProps);
        },
        ...optionProps
    });
}

export function renderTimePicker(value: Ref<number | null>, optionProps: TimePickerProps = {}) {
    return h(NTimePicker, {
        value: value.value,
        onUpdateValue: (newVal: number | null) => {
            value.value = newVal;
            // @ts-ignore
            optionProps.onChange?.(newVal, optionProps);
        },
        ...optionProps
    });
}

// otherRender
export function renderCheckbox(
    value: Ref<boolean>,
    label: string,
    optionProps: CheckboxProps | AllowedComponentProps = {}
) {
    return h(
        NCheckbox,
        {
            checked: value.value,
            onUpdateChecked: (newVal: boolean) => {
                value.value = newVal;
                // @ts-ignore
                optionProps.onChange?.(newVal, optionProps);
            },
            ...optionProps
        },
        {
            default: () => label
        }
    );
}

export function renderTag(label: string, optionProps: TagProps | AllowedComponentProps = {}) {
    return h(NTag, optionProps, {
        default: () => label
    });
}
