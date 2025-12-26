import {

    NButton,
    NCheckbox,
    NCheckboxGroup,
    NDatePicker, NImage,
    NInput,
    NPopselect, NRadio,
    NRadioButton,
    NRadioGroup,
    NSelect,
    NSpace,
    NSwitch,
    NTag,
    NTimePicker,
    NTreeSelect, type RadioProps,

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
import type {DyFormItem} from "../../types/form";

// 输入
export function renderInput(model: Ref<string>, optionProps: InputProps | AllowedComponentProps = {}, rf?: DyFormItem) {
    return h(NInput, {
        ...rf as any,
        value: model.value,
        onUpdateValue: (newVal: string) => {
            model.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps
    });
}

// 下拉
export function renderSelect(
    model: Ref<SelectValue>,
    options: SelectOption[],
    optionProps: SelectProps | AllowedComponentProps = {},
    rf?: DyFormItem
) {
    return h(NSelect, {
        ...rf as any,
        value: model.value,
        options,
        onUpdateValue: (newVal: any) => {
            model.value = newVal;
            rf?.onChange?.(newVal, rf, options);
        },
        ...optionProps
    });
}

export function renderPopSelect(
    model: Ref<string | number | Array<string | number> | null>,
    options: Array<SelectOption | SelectGroupOption>,
    optionProps: PopselectProps | AllowedComponentProps = {},
    rf?: DyFormItem,
    defaultRender?: VNode
) {
    const {value, labelField, valueField, ...resetProps} = rf as DyFormItem
    const labelF = labelField ?? 'label'
    const valueF = valueField ?? 'value'
    const mOptions = resetProps.options ?? options
    return createVNode(
        NPopselect,
        {
            ...resetProps as any,
            value: model.value,
            onUpdateValue: (newVal: string | number | Array<string | number> | null) => {
                model.value = newVal;
                rf?.onChange?.(newVal, rf, mOptions);
            },
            options: mOptions.map(it => ({...it, label: it[labelF], value: it[valueF]})),
            ...optionProps
        },
        {
            default: () => defaultRender ?? createVNode(NButton, null, {
                default: () => model.value || "请选择"
            })
        }
    );
}

export function renderTreeSelect(
    model: Ref<Value>,
    options: TreeSelectOption[],
    optionProps: TreeSelectProps | AllowedComponentProps = {},
    rf?: DyFormItem,
) {
    const {valueField = 'value', ...resetProps} = rf as DyFormItem
    return h(NTreeSelect, {
        ...resetProps as any,
        value: model.value,
        options,
        onUpdateValue: (newVal: any) => {
            model.value = newVal;
            rf?.onChange?.(newVal, rf, options);
        },
        keyField: valueField,
        ...optionProps
    });
}

// 单复选
export function renderRadioGroup(
    value: Ref<string | number | null | undefined>,
    options: RadioProps[],
    optionProps: RadioGroupProps | AllowedComponentProps = {},
    rf?: DyFormItem,
) {
    return h(
        NRadioGroup,
        {
            ...rf as any,
            value: value.value,
            onUpdateValue: (newVal: string | number | null | undefined) => {
                value.value = newVal;
                rf?.onChange?.(newVal, rf, options);
            },
            ...optionProps,
        },
        {
            default: () => {
                const opts = rf?.options ?? options
                return opts.map((it: RadioButtonProps) => {
                    const opt = rf as DyFormItem
                    const label = it[(opt?.labelField ?? 'label') as keyof RadioButtonProps] as string;
                    const value = it[(opt?.valueField ?? 'value') as keyof RadioButtonProps] as string;
                    return h(
                        NRadio,
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

export function renderRadioButtonGroup(
    value: Ref<string | number | null | undefined>,
    options: RadioButtonProps[],
    optionProps: RadioGroupProps | AllowedComponentProps = {},
    rf?: DyFormItem,
) {
    return createVNode(
        NRadioGroup,
        {
            ...rf as any,
            value: value.value,
            onUpdateValue: (newVal: string | number | null | undefined) => {
                value.value = newVal;
                rf?.onChange?.(newVal, rf, options);
            },
            ...optionProps,
        },
        {
            default: () => {
                const opts = rf?.options ?? options
                return opts.map((it: RadioButtonProps) => {
                    const opt = rf as DyFormItem
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
    optionProps: CheckboxGroupProps | AllowedComponentProps = {},
    rf?: DyFormItem,
) {
    return h(
        NCheckboxGroup,
        {
            ...rf as any,
            value: model.value,
            onUpdateValue: (newVal) => {
                model.value = newVal;
                rf?.onChange?.(newVal, rf, options);
            },
            ...optionProps
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
                            const opts = rf?.options ?? options
                            return opts.map((it: CheckboxProps) => {
                                const opt = rf as DyFormItem
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
    optionProps: SwitchProps | AllowedComponentProps = {},
    rf?: DyFormItem,
) {
    return h(NSwitch, {
        ...rf as any,
        value: value.value,
        onUpdateValue: (newVal: boolean) => {
            value.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps
    });
}

// 日期时间
export function renderDatePicker(
    value: Ref<DatePickerValue>,
    optionProps: DatePickerProps | AllowedComponentProps = {},
    rf?: DyFormItem,
) {
    return h(NDatePicker, {
        ...rf as any,
        value: value.value,
        onUpdateValue: (newVal: any) => {
            value.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps
    });
}

export function renderTimePicker(
    value: Ref<number | null>,
    optionProps: TimePickerProps = {},
    rf?: DyFormItem,) {
    return h(NTimePicker, {
        ...rf as any,
        value: value.value,
        onUpdateValue: (newVal: number | null) => {
            value.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps
    });
}

// otherRender 暂未适配
function renderCheckbox(
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

//
function renderTag(label: string, optionProps: TagProps | AllowedComponentProps = {}) {
    return h(NTag, optionProps, {
        default: () => label
    });
}
