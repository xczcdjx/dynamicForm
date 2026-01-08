import {
    type DynamicTagsProps,
    NButton,
    NCheckbox,
    NCheckboxGroup,
    NDatePicker, NDynamicTags,
    NInput, NInputNumber,
    NPopselect, NRadio,
    NRadioButton,
    NRadioGroup,
    NSelect, NSlider,
    NSpace,
    NSwitch,
    NTag,
    NTimePicker,
    NTreeSelect,
} from "naive-ui";
import type {
    RadioProps,
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
import {type AllowedComponentProps, createVNode, h, type Ref, type VNode} from "vue";
import type {DyFormItem} from "@/types/form";
import type {DynamicTagsOption} from "naive-ui/es/dynamic-tags/src/interface";
import type {SliderProps} from "naive-ui/es/slider/src/Slider";
import type {InputNumberProps} from "naive-ui/es/input-number/src/InputNumber";

// 输入
export function renderInput(model: Ref<string>, optionProps: InputProps | AllowedComponentProps = {}, rf?: DyFormItem) {
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return h(NInput, {
        ...resetRf as any,
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
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return h(NSelect, {
        ...resetRf as any,
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
    const {value, labelField, valueField, onChange, ...resetProps} = rf ?? {} as DyFormItem
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
    const {valueField = 'value', onChange, ...resetProps} = rf ?? {} as DyFormItem
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
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return h(
        NRadioGroup,
        {
            ...resetRf as any,
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
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return createVNode(
        NRadioGroup,
        {
            ...resetRf as any,
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
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return h(
        NCheckboxGroup,
        {
            ...resetRf as any,
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
    model: Ref<boolean>,
    optionProps: SwitchProps | AllowedComponentProps = {},
    rf?: DyFormItem,
) {
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return h(NSwitch, {
        ...resetRf as any,
        value: model.value,
        onUpdateValue: (newVal: boolean) => {
            model.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps
    });
}

// 日期时间
export function renderDatePicker(
    model: Ref<DatePickerValue>,
    optionProps: DatePickerProps | AllowedComponentProps = {},
    rf?: DyFormItem,
) {
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return h(NDatePicker, {
        ...resetRf as any,
        value: model.value,
        onUpdateValue: (newVal: any) => {
            model.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps
    });
}

export function renderTimePicker(
    model: Ref<number | null>,
    optionProps: TimePickerProps | AllowedComponentProps = {},
    rf?: DyFormItem,) {
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return h(NTimePicker, {
        ...resetRf as any,
        value: model.value,
        onUpdateValue: (newVal: number | null) => {
            model.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps
    });
}

// 0.43 版本新增
export function renderCheckbox(
    model: Ref<boolean>,
    optionProps: CheckboxProps | AllowedComponentProps = {},
    rf?: DyFormItem,
) {
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return h(
        NCheckbox,
        {
            ...resetRf as any,
            checked: model.value,
            onUpdateChecked: (newVal: boolean) => {
                model.value = newVal;
                rf?.onChange?.(newVal, rf);
            },
            ...optionProps
        },
        {
            default: () => (optionProps as CheckboxProps)?.label ?? rf?.label
        }
    );
}

export function renderDynamicTags(
    model: Ref<Array<string | DynamicTagsOption>>,
    optionProps: DynamicTagsProps | AllowedComponentProps = {},
    rf?: DyFormItem) {
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return h(NDynamicTags, {
        ...resetRf as any,
        value: model.value,
        onUpdateValue: (newVal: any) => {
            model.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps
    });
}

export function renderSlider(
    model: Ref<number | number[]>,
    optionProps: SliderProps | AllowedComponentProps = {},
    rf?: DyFormItem) {
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return h(NSlider, {
        ...resetRf as any,
        value: model.value,
        onUpdateValue: (newVal: any) => {
            model.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps
    });
}

export function renderInputNumber(
    model: Ref<number | null>,
    optionProps: InputNumberProps | AllowedComponentProps = {},
    rf?: DyFormItem) {
    const {onChange, ...resetRf} = rf ?? {} as DyFormItem
    return h(NInputNumber, {
        ...resetRf as any,
        value: model.value,
        onUpdateValue: (newVal: any) => {
            model.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps
    });
}

// otherRender 暂未适配
