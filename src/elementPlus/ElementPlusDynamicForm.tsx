import {computed, defineComponent, nextTick, ref} from "vue";
import type {PropType} from 'vue'
export default defineComponent({
    name: "ElementPlusDynamicForm",
    props: {
        dyCls: {
            type: String,
        },
        btnConfigs: {
            type: Object as PropType<Partial<DyBtnConfig>>,
        },
        configs: {
            type: Object as PropType<DyConfig>,
        },
        dyListConfigs: {
            type: Object as PropType<DyListConfig>,
        },
        modelValue: {
            type: Object as PropType<ValueType>,
            required: true
        }
    },
    emits: {
        "update:modelValue": (v: ValueType) => true,
        onReset: () => true,
        onMerge: (v: ValueType) => true,
    },
    setup(props, {emit}) {
        return ()=><div>123</div>
    }
});