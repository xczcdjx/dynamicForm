export {}
declare global {
    type DyCFormItem = {
        rId: string;
        key: string;
        value: string;
        isArray?: boolean;
        isNumber?: boolean;
    };
    type DyBtnConfig = Record<'resetTxt' | 'newTxt' | 'mergeTxt', string>
    type DyConfig = {
        // 隐藏重置按钮
        hideReset?: boolean;
        // 输入栏最大高度
        maxHeight?: string;
    }
    type DyListConfig = {
        // 分隔符
        arraySplitSymbol: string
    }
    type ValueType = Record<string, any>
}