import {
    ElButton,
    ElCheckbox,
    ElCheckboxGroup,
    ElDatePicker,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElInput, ElInputNumber, ElInputTag,
    ElOption,
    ElOptionGroup,
    ElPopover,
    ElRadio,
    ElRadioButton,
    ElRadioGroup,
    ElSelect, ElSlider,
    ElSpace,
    ElSwitch,
    ElTag,
    ElTimePicker,
    ElTreeSelect,
} from "element-plus";
import {
    createVNode,
    h, ref,
} from "vue";
import type {Ref, VNode, AllowedComponentProps} from 'vue'
import type {InputProps, SelectProps} from 'element-plus'
import type {DyFormItem, SelectOptionItem} from "@/types/form";
import type {RadioGroupProps} from "element-plus/es/components/radio/src/radio-group";
import type {CheckboxGroupProps} from "element-plus/es/components/checkbox/src/checkbox-group";
import type {SwitchProps} from "element-plus/es/components/switch/src/switch";
import type {DatePickerProps} from "element-plus/es/components/date-picker/src/props";
import type {TimePickerDefaultProps} from "element-plus/es/components/time-picker/src/common/props";
import type {TreeComponentProps} from "element-plus/es/components/tree/src/tree.type";
import type {CheckboxProps} from "element-plus/es/components/checkbox/src/checkbox";
import type {SliderProps} from "element-plus/es/components/slider/src/slider";
import type {InputNumberProps} from "element-plus/es/components/input-number/src/input-number";
import type {InputTagProps} from "element-plus/es/components/input-tag/src/input-tag";

type AnyProps = Record<string, any> & AllowedComponentProps;
type BasicOption = Record<string, any>;
export type SelectOption = Omit<SelectOptionItem, 'class' | 'style'> | Record<string, any>
export type TreeSelectOption = {
    label?: string
    value: any
    disabled?: boolean
    children?: TreeSelectOption[]
} | Record<string, any>
type OptionsType<T> = Partial<T> & AllowedComponentProps

function getField<T extends BasicOption>(opt: T, field: string, fallback: any) {
    return opt?.[field] ?? fallback;
}

function isGroupOption(opt: any) {
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
    optionProps: OptionsType<InputProps> = {},
    rf?: DyFormItem
) {
    const {onChange, value, ...restRf} = rf as DyFormItem;
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
    options: SelectOption[],
    optionProps: OptionsType<SelectProps> = {},
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
// optionProps 暂未处理
export function renderPopSelect(
    model: Ref<string | number | Array<string | number> | null>,
    options: Array<SelectOption>,
    optionProps: AnyProps = {},
    rf?: DyFormItem,
    defaultRender?: VNode
) {
    const {labelField, valueField, options: rfOptions, onChange, ...restProps} = (rf ?? {}) as any;
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

        return h(ElButton, null, {default: () => text});
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
                            modelValue: model.value as any,
                            "onUpdate:modelValue": (newVal: Array<string | number>) => {
                                model.value = newVal;
                                rf?.onChange?.(newVal, rf, opts);
                            },
                        },
                        {
                            default: () =>
                                h(
                                    ElSpace,
                                    {wrap: true},
                                    {
                                        default: () =>
                                            opts.flatMap((it: any, idx: number) => {
                                                const list = it.__isGroup ? it.__children ?? [] : [it];
                                                return list.map((x: any, j: number) => {
                                                    const label = getField(x, labelF, x.label);
                                                    const value = getField(x, valueF, x.value);
                                                    return h(
                                                        ElCheckbox,
                                                        {
                                                            key: x.key ?? `${idx}-${j}`,
                                                            label: value,
                                                            disabled: x.disabled
                                                        },
                                                        {default: () => label}
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
                                    {key: x.key ?? `${idx}-${j}`, command: value, disabled: x.disabled},
                                    {default: () => label}
                                );
                            });
                        }),
                }),
        }
    );
}

export function renderTreeSelect(
    model: Ref<any>,
    options: TreeSelectOption[],
    optionProps: OptionsType<TreeComponentProps> = {},
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
    options: SelectOption[],
    optionProps: OptionsType<RadioGroupProps> = {},
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
    options: SelectOption[],
    optionProps: OptionsType<RadioGroupProps> = {},
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
    options: SelectOption[],
    optionProps: OptionsType<CheckboxGroupProps> = {},
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
    optionProps: OptionsType<SwitchProps> = {},
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
export function renderDatePicker(
    value: Ref<any>,
    optionProps: OptionsType<DatePickerProps> = {},
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
    optionProps: OptionsType<TimePickerDefaultProps> = {},
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

// 0.4.2 新增
/*type PropsOf<C> =
    C extends new (...args: any) => { $props: infer P } ? P :
        C extends FunctionalComponent<infer P> ? P :
            Record<string, any>

export function SimplyRender<F extends DyFormItem>(f: F) {
    const { value: _omit, ...restF } = f as any

    return function <C extends Component>(
        com: C,
        props?: Partial<PropsOf<C>>
    ): VNode {
        return h(com as any, {
            ...restF,
            ...(props as any),
        })
    }
}*/
export function renderCheckbox(
    model: Ref<boolean | number | string>,
    optionProps: OptionsType<CheckboxProps> = {},
    rf?: DyFormItem,
) {
    const {onChange, ...restRf} = (rf ?? {}) as DyFormItem;
    return h(ElCheckbox, {
        ...restRf as any,
        label: (optionProps as CheckboxProps)?.label ?? rf?.label,
        modelValue: model.value,
        "onUpdate:modelValue": (newVal: any) => {
            model.value = newVal
            rf?.onChange?.(model.value, rf)
        },
        ...optionProps,
    })
}

/*const dynamicTagsState = new WeakMap<object, { isCreate: Ref<boolean>; inputValue: Ref<string> }>()

function getDynamicTagsState(key: object) {
    let s = dynamicTagsState.get(key)
    if (!s) {
        s = { isCreate: ref(false), inputValue: ref("") }
        dynamicTagsState.set(key, s)
    }
    return s
}
export function renderDynamicTags(
    model: Ref<any[]>,
    optionProps: OptionsType<TagProps> = {},
    rf?: DyFormItem,
) {
    const stateKey = (rf ?? model) as unknown as object
    const { isCreate, inputValue } = getDynamicTagsState(stateKey)
    const {onChange, labelField, valueField, disabled, ...restRf} = (rf ?? {}) as DyFormItem;
    const {tagType, size} = optionProps
    const createNew = () => {
        const v = inputValue.value?.trim()
        if (!v) return
        model.value.push(valueField!==undefined?{[labelField??'label']:v,[valueField]:v}:v)
        rf?.onChange?.(model.value, rf)
        reset()
    }
    const reset = () => {
        inputValue.value = ""
        isCreate.value = false
    }
    return h(ElSpace, {}, [
        ...model.value.map(it => {
            const key = valueField ? it[valueField] : it
            const label = labelField ? it[labelField] : it
            return h(ElTag, {
                ...restRf as any,
                key: rf?.valueField ?? it,
                disabled,
                closable: disabled !== undefined ? !disabled : true,
                onClose() {
                    const index = model.value.findIndex(it2 => {
                        if (valueField) return it2[valueField] === key
                        else return it2 === it
                    })
                    if (index !== -1) {
                        model.value.splice(index, 1);
                        rf?.onChange?.(model.value, rf);
                    }
                },
                ...optionProps,
            }, () => label)
        }),
        // @ts-ignore
        h(ElInput, {
            class: 'w-10',
            size: size ?? 'small',
            style: {display: isCreate.value ? 'block' : 'none'},
            modelValue: inputValue.value,
            "onUpdate:modelValue"(v) {
                inputValue.value = v
            },
            onBlur:createNew,
            onKeydown(e:KeyboardEvent) {
                if (e.key === 'Enter') createNew()
                if (e.key==='Escape') reset()
            }
        }),
        h(ElButton, {
            size: size ?? 'small',
            style: {display: !isCreate.value ? 'block' : 'none'},
            plain: true,
            // @ts-ignore
            disabled, type: tagType,
            onClick() {
                isCreate.value = true
            }
        }, () => '+'),
    ])
}*/
export function renderDynamicTags(
    model: Ref<any[]>,
    optionProps: OptionsType<InputTagProps> = {},
    rf?: DyFormItem,
) {
    const {onChange, labelField = 'label', valueField, ...restRf} = (rf ?? {}) as DyFormItem;
    return h(ElInputTag, {
        ...restRf as any,
        modelValue: valueField ? model.value.map(it => it[valueField]) : model.value,
        "onUpdate:modelValue": (newVal: any[]) => {
            model.value = valueField ? newVal.map(it => ({
                [labelField]: it,
                [valueField]: it
            })) : newVal
            rf?.onChange?.(newVal, rf)
        },
        ...optionProps,
    })
}

export function renderSlider(
    model: Ref<number | number[]>,
    optionProps: OptionsType<SliderProps> = {},
    rf?: DyFormItem,
) {
    const {onChange, ...restRf} = (rf ?? {}) as DyFormItem;

    return h(ElSlider, {
        ...restRf as any,
        modelValue: model.value,
        "onUpdate:modelValue": (newVal: any) => {
            model.value = newVal as any
            rf?.onChange?.(newVal, rf)
        },
        ...optionProps,
    })
}

export function renderInputNumber(
    model: Ref<number | null>,
    optionProps: OptionsType<InputNumberProps> = {},
    rf?: DyFormItem,
) {
    const {onChange, ...restRf} = (rf ?? {}) as DyFormItem;

    return h(ElInputNumber, {
        ...restRf as any,
        modelValue: model.value,
        "onUpdate:modelValue": (newVal: any) => {
            model.value = (newVal ?? null) as number | null
            rf?.onChange?.(model.value, rf)
        },
        ...optionProps,
    })
}

// tag
function renderTag(label: string, optionProps: AnyProps = {}) {
    return h(ElTag, optionProps, {default: () => label});
}
