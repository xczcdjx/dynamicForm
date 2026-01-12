import {computed, defineComponent, type PropType, reactive, ref, type SlotsType, type VNodeChild} from "vue";
import {ElButton, ElDialog} from "element-plus";
import type {DialogProps} from "element-plus/es/components/dialog/src/dialog";

type ElDialogSlots = {
    default?: () => VNodeChild;
    footer?: () => VNodeChild;
    title?: () => VNodeChild;
    header?: (scope: { close: () => void; titleId: string; titleClass: string }) => VNodeChild;
};

export default defineComponent({
    name: 'ElePopupModal',
    props: {
        title: {
            type: String,
        },
        modalProps: {
            type: Object as PropType<DialogProps>
        },
        to: {
            type: [String, Object] as PropType<string | HTMLElement>,
        },
        showClose: {
            type: Boolean,
            default: true
        },
        closeOnMask: {
            type: Boolean,
            default: true
        },
        width: {
            type: String,
            default: 'min(1080px,90%)'
        },
        onCancel: {
            type: Function as PropType<() => boolean | Promise<boolean>>,
            default: () => true
        },
        onSubmit: {
            type: Function as PropType<() => boolean | Promise<boolean>>,
            default: () => true
        },
        footerTxt: {
            type: Array as PropType<string[]>,
            default: () => ['Cancel', 'Submit']
        }
    },
    slots: Object as SlotsType<ElDialogSlots>,
    /*emits: {
        cancel: () => true,
        submit: () => true,
    },*/
    setup(props, {expose, emit, slots}) {
        const mergedModalProps = computed<Partial<DialogProps>>(() => ({
            alignCenter: true,
            draggable: true,
            appendToBody: true,
            ...(props.modalProps ?? {})
        }));
        const show = ref<boolean>(false)
        const btnObjLoading = reactive<Record<'c' | 's', boolean>>({
            c: false,
            s: false
        })
        const toggle = (f?: boolean) => {
            show.value = f ?? !show.value
        }
        expose({
            toggle
        })
        const onCancelClick = async () => {
            btnObjLoading.c = true
            const ok = (await props.onCancel?.()) ?? true
            if (ok) toggle(false)
            btnObjLoading.c = false
        }

        const onSubmitClick = async () => {
            btnObjLoading.s = true
            const ok = (await props.onSubmit?.()) ?? true
            if (ok) toggle(false)
            btnObjLoading.s = false
        }
        return () => <ElDialog v-model={show.value} showClose={props.showClose}
                               closeOnClickModal={props.closeOnMask}
                               style={{width: props.width}}
                               title={props.title} appendTo={props.to}
                               {...mergedModalProps.value}
                               v-slots={{
                                   footer: () => {
                                       const [cancelTxt, submitTxt] = props.footerTxt
                                       const {c: cLoading, s: sLoading} = btnObjLoading
                                       return <div class='flex justify-end align-center'>
                                           <ElButton size='small' onClick={onCancelClick}
                                                     loading={cLoading}>{cancelTxt}</ElButton>
                                           <ElButton size='small' type='success'
                                                     onClick={onSubmitClick} loading={sLoading}>{submitTxt}</ElButton>
                                       </div>
                                   },
                                   ...slots
                               }}/>
    }
})