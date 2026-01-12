import {computed, defineComponent, type PropType, reactive, ref, type SlotsType, type VNodeChild} from "vue";
import {NButton, NModal} from "naive-ui";
import type {ModalProps, CardSlots} from "naive-ui";

export default defineComponent({
    name: 'NaiPopupModal',
    props: {
        title: {
            type: [String, Function] as PropType<string | (() => VNodeChild)>,
        },
        modalProps: {
            type: Object as PropType<ModalProps>
        },
        to: {
            type: String as PropType<string | HTMLElement>,
        },
        showClose: {
            type: Boolean,
            default: true
        },
        closeOnMask:{
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
    slots: Object as SlotsType<CardSlots>,
    /*emits: {
        cancel: () => true,
        submit: () => true,
    },*/
    setup(props, {expose, emit, slots}) {
        const mergedModalProps = computed<ModalProps>(() => ({
            preset: "card",
            draggable: true,
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
        return () => <NModal v-model:show={show.value} style={{width: props.width}}
                             title={props.title} to={props.to}
                             closable={props.showClose}
                             maskClosable={props.closeOnMask}
                             {...mergedModalProps.value}
                             v-slots={{
                                 footer: () => {
                                     const [cancelTxt, submitTxt] = props.footerTxt
                                     const {c: cLoading, s: sLoading} = btnObjLoading
                                     return <div class='flex justify-end align-center sm-gap'>
                                         <NButton size='small' onClick={onCancelClick}
                                                  loading={cLoading}>{cancelTxt}</NButton>
                                         <NButton size='small' type='success'
                                                  onClick={onSubmitClick} loading={sLoading}>{submitTxt}</NButton>
                                     </div>
                                 },
                                 ...slots
                             }}/>
    }
})