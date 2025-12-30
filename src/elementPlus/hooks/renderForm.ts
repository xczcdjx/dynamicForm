import {
    ElButton,
    ElCheckbox,
    ElCheckboxGroup,
    ElDatePicker,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElInput,
    ElOption,
    ElOptionGroup,
    ElPopover,
    ElRadio,
    ElRadioButton,
    ElRadioGroup,
    ElSelect,
    ElSpace,
    ElSwitch,
    ElTag,
    ElTimePicker,
    ElTreeSelect,
} from "element-plus";
import type {InputProps} from 'element-plus'
import {createVNode, h, type Ref, type VNode, type AllowedComponentProps} from "vue";
import type {DyFormItem} from "@/types/form";

type AnyProps = Record<string, any> & AllowedComponentProps;
type BasicOption = Record<string, any>;

function getField<T extends BasicOption>(opt: T, field: string, fallback: any) {
    return opt?.[field] ?? fallback;
}

function isGroupOption(opt: any) {
    // 兼容 Naive 的 SelectGroupOption: { type:'group', label, children:[] }
    // 也兼容常见结构: { label, options:[] }
    return !!opt && (opt.type === "group" || Array.isArray(opt.children) || Array.isArray(opt.options));
}

function normalizeSelectOptions(options: any[]) {
    return (options ?? []).map((o) => {
        if (isGroupOption(o)) {
            const children = o.children ?? o.options ?? [];
            return {...o, __isGroup: true, __children: children};
        }
        return {...o, __isGroup: false};
    });
}

function getLabelByValue(
    value: any,
    options: any[],
    labelField = "label",
    valueField = "value"
) {
    const list = normalizeSelectOptions(options);
    for (const o of list) {
        if (o.__isGroup) {
            for (const c of o.__children) {
                if (getField(c, valueField, c.value) === value) return getField(c, labelField, c.label);
            }
        } else {
            if (getField(o, valueField, o.value) === value) return getField(o, labelField, o.label);
        }
    }
    return "";
}

// 输入
export function renderInput(
    model: Ref<string>,
    optionProps: InputProps | AllowedComponentProps = {},
    rf?: DyFormItem
) {
    const {onChange,value, ...restRf} = rf as DyFormItem;
    return h(ElInput, {
        ...(restRf as any),
        modelValue: model.value,
        "onUpdate:modelValue": (newVal: string) => {
            model.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps,
    });
}

// 下拉
export function renderSelect(
    model: Ref<any>,
    options: any[],
    optionProps: AnyProps = {},
    rf?: DyFormItem
) {
    const {onChange, labelField, valueField, options: rfOptions, ...restRf} = (rf ?? {}) as any;
    const labelF = labelField ?? "label";
    const valueF = valueField ?? "value";
    const opts = normalizeSelectOptions(rfOptions ?? options);

    return h(
        ElSelect,
        {
            ...(restRf as any),
            modelValue: model.value,
            "onUpdate:modelValue": (newVal: any) => {
                model.value = newVal;
                rf?.onChange?.(newVal, rf, opts);
            },
            ...optionProps,
        },
        {
            default: () =>
                opts.map((it: any, idx: number) => {
                    if (it.__isGroup) {
                        return h(
                            ElOptionGroup,
                            {key: it.key ?? `g-${idx}`, label: getField(it, labelF, it.label)},
                            {
                                default: () =>
                                    (it.__children ?? []).map((c: any, cidx: number) => {
                                        const label = getField(c, labelF, c.label);
                                        const value = getField(c, valueF, c.value);
                                        return h(ElOption, {
                                            key: c.key ?? `${idx}-${cidx}`,
                                            label,
                                            value,
                                            disabled: c.disabled,
                                        });
                                    }),
                            }
                        );
                    }

                    const label = getField(it, labelF, it.label);
                    const value = getField(it, valueF, it.value);
                    return h(ElOption, {
                        key: it.key ?? `${idx}`,
                        label,
                        value,
                        disabled: it.disabled,
                    });
                }),
        }
    );
}

/**
 * PopSelect（Element Plus 无 1:1 组件）
 * - 单选：ElDropdown（点击项立即选中）
 * - 多选（model 是数组）：ElPopover + ElCheckboxGroup
 */

/*export function renderPopSelect(
    model: Ref<string | number | Array<string | number> | null>,
    options: Array<any>,
    optionProps: AnyProps = {},
    rf?: DyFormItem,
    defaultRender?: VNode
) {
    const { labelField, valueField, options: rfOptions, onChange, ...restProps } = (rf ?? {}) as any;
    const labelF = labelField ?? "label";
    const valueF = valueField ?? "value";
    const mOptions = rfOptions ?? options;
    const opts = normalizeSelectOptions(mOptions);

    const renderTrigger = () => {
        if (defaultRender) return defaultRender;

        const text =
            Array.isArray(model.value)
                ? (model.value.length ? `已选 ${model.value.length} 项` : "请选择")
                : model.value != null
                    ? (getLabelByValue(model.value, mOptions, labelF, valueF) || String(model.value))
                    : "请选择";

        return h(ElButton, null, { default: () => text });
    };

    // 多选：popover + checkbox group
    if (Array.isArray(model.value)) {
        return createVNode(
            ElPopover,
            {
                trigger: "click",
                ...(restProps as any),
                ...optionProps,
            },
            {
                reference: () => renderTrigger(),
                default: () =>
                    h(
                        ElCheckboxGroup,
                        {
                            modelValue: model.value,
                            "onUpdate:modelValue": (newVal: Array<string | number>) => {
                                model.value = newVal;
                                rf?.onChange?.(newVal, rf, opts);
                            },
                        },
                        {
                            default: () =>
                                h(
                                    ElSpace,
                                    { wrap: true },
                                    {
                                        default: () =>
                                            opts.flatMap((it: any, idx: number) => {
                                                const list = it.__isGroup ? it.__children ?? [] : [it];
                                                return list.map((x: any, j: number) => {
                                                    const label = getField(x, labelF, x.label);
                                                    const value = getField(x, valueF, x.value);
                                                    return h(
                                                        ElCheckbox,
                                                        { key: x.key ?? `${idx}-${j}`, label: value, disabled: x.disabled },
                                                        { default: () => label }
                                                    );
                                                });
                                            }),
                                    }
                                ),
                        }
                    ),
            }
        );
    }

    // 单选：dropdown
    return createVNode(
        ElDropdown,
        {
            trigger: "click",
            ...(restProps as any),
            onCommand: (cmd: any) => {
                model.value = cmd as any;
                rf?.onChange?.(cmd, rf, opts);
            },
            ...optionProps,
        },
        {
            default: () => renderTrigger(),
            dropdown: () =>
                h(ElDropdownMenu, null, {
                    default: () =>
                        opts.flatMap((it: any, idx: number) => {
                            const list = it.__isGroup ? it.__children ?? [] : [it];
                            return list.map((x: any, j: number) => {
                                const label = getField(x, labelF, x.label);
                                const value = getField(x, valueF, x.value);
                                return h(
                                    ElDropdownItem,
                                    { key: x.key ?? `${idx}-${j}`, command: value, disabled: x.disabled },
                                    { default: () => label }
                                );
                            });
                        }),
                }),
        }
    );
}*/

export function renderTreeSelect(
    model: Ref<any>,
    options: any[],
    optionProps: AnyProps = {},
    rf?: DyFormItem
) {
    const {
        valueField = "value",
        labelField = "label",
        childrenField = "children",
        onChange,
        options: rfOptions,
        ...restProps
    } = (rf ?? {}) as any;

    const data = rfOptions ?? options;

    return h(ElTreeSelect, {
        ...(restProps as any),
        data,
        modelValue: model.value,
        "onUpdate:modelValue": (newVal: any) => {
            model.value = newVal;
            rf?.onChange?.(newVal, rf, data);
        },
        props: {
            value: valueField,
            label: labelField,
            children: childrenField,
            disabled: "disabled",
        },
        ...optionProps,
    });
}

// 单选：RadioGroup（普通 radio）
export function renderRadioGroup(
    value: Ref<string | number | null | undefined>,
    options: BasicOption[],
    optionProps: AnyProps = {},
    rf?: DyFormItem
) {
    const {onChange, labelField, valueField, options: rfOptions, ...restRf} = (rf ?? {}) as any;
    const labelF = labelField ?? "label";
    const valueF = valueField ?? "value";
    const opts = rfOptions ?? options;

    return h(
        ElRadioGroup,
        {
            ...(restRf as any),
            modelValue: value.value,
            "onUpdate:modelValue": (newVal: any) => {
                value.value = newVal;
                rf?.onChange?.(newVal, rf, opts);
            },
            ...optionProps,
        },
        {
            default: () =>
                (opts ?? []).map((it: any, idx: number) => {
                    const label = getField(it, labelF, it.label);
                    const val = getField(it, valueF, it.value);
                    return h(ElRadio, {key: it.key ?? idx, label: val, disabled: it.disabled}, () => label);
                }),
        }
    );
}

// 单选：RadioButtonGroup
export function renderRadioButtonGroup(
    value: Ref<string | number | null | undefined>,
    options: BasicOption[],
    optionProps: AnyProps = {},
    rf?: DyFormItem
) {
    const {onChange, labelField, valueField, options: rfOptions, ...restRf} = (rf ?? {}) as any;
    const labelF = labelField ?? "label";
    const valueF = valueField ?? "value";
    const opts = rfOptions ?? options;

    return h(
        ElRadioGroup,
        {
            ...(restRf as any),
            modelValue: value.value,
            "onUpdate:modelValue": (newVal: any) => {
                value.value = newVal;
                rf?.onChange?.(newVal, rf, opts);
            },
            ...optionProps,
        },
        {
            default: () =>
                (opts ?? []).map((it: any, idx: number) => {
                    const label = getField(it, labelF, it.label);
                    const val = getField(it, valueF, it.value);
                    return h(
                        ElRadioButton,
                        {key: it.key ?? idx, label: val, disabled: it.disabled},
                        () => label
                    );
                }),
        }
    );
}

// 复选：CheckboxGroup
export function renderCheckboxGroup(
    model: Ref<(string | number)[]>,
    options: BasicOption[],
    optionProps: AnyProps = {},
    rf?: DyFormItem
) {
    const {onChange, labelField, valueField, options: rfOptions, ...restRf} = (rf ?? {}) as any;
    const labelF = labelField ?? "label";
    const valueF = valueField ?? "value";
    const opts = rfOptions ?? options;

    return h(
        ElCheckboxGroup,
        {
            ...(restRf as any),
            modelValue: model.value,
            "onUpdate:modelValue": (newVal: (string | number)[]) => {
                model.value = newVal;
                rf?.onChange?.(newVal, rf, opts);
            },
            ...optionProps,
        },
        {
            default: () =>
                h(
                    ElSpace,
                    {wrap: true},
                    {
                        default: () =>
                            (opts ?? []).map((it: any, idx: number) => {
                                const label = getField(it, labelF, it.label);
                                const val = getField(it, valueF, it.value);
                                return h(
                                    ElCheckbox,
                                    {key: it.key ?? idx, label: val, disabled: it.disabled},
                                    () => label
                                );
                            }),
                    }
                ),
        }
    );
}

// 开关
export function renderSwitch(
    value: Ref<boolean>,
    optionProps: AnyProps = {},
    rf?: DyFormItem
) {
    const {onChange, ...restRf} = (rf ?? {}) as any;
    return h(ElSwitch, {
        ...(restRf as any),
        modelValue: value.value,
        "onUpdate:modelValue": (newVal: boolean) => {
            value.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps,
    });
}

// 日期/时间（Element Plus：ElDatePicker）
// 你需要在 optionProps 里传 type：date / daterange / datetime / datetimerange 等
export function renderDatePicker(
    value: Ref<any>,
    optionProps: AnyProps = {},
    rf?: DyFormItem
) {
    const {onChange, ...restRf} = (rf ?? {}) as any;
    return h(ElDatePicker, {
        ...(restRf as any),
        modelValue: value.value,
        "onUpdate:modelValue": (newVal: any) => {
            value.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps,
    });
}

// 时间（Element Plus：ElTimePicker）
export function renderTimePicker(
    value: Ref<any>,
    optionProps: AnyProps = {},
    rf?: DyFormItem
) {
    const {onChange, ...restRf} = (rf ?? {}) as any;
    return h(ElTimePicker, {
        ...(restRf as any),
        modelValue: value.value,
        "onUpdate:modelValue": (newVal: any) => {
            value.value = newVal;
            rf?.onChange?.(newVal, rf);
        },
        ...optionProps,
    });
}

// otherRender：单个 checkbox
/*function renderCheckbox(
    value: Ref<boolean>,
    label: string,
    optionProps: AnyProps = {}
) {
    return h(
        ElCheckbox,
        {
            modelValue: value.value,
            "onUpdate:modelValue": (newVal: boolean) => {
                value.value = newVal;
                (optionProps as any).onChange?.(newVal, optionProps);
            },
            ...optionProps,
        },
        () => label
    );
}

// tag
function renderTag(label: string, optionProps: AnyProps = {}) {
    return h(ElTag, optionProps, { default: () => label });
}*/
