import {defineComponent, nextTick, onMounted, type PropType, ref, type SlotsType, type VNode, watch} from "vue";
import {NaiDynamicForm, type naiDynamicFormRef} from "@/naiveUi";
import type {DyFormItem} from "@/types/form.ts";
import {NButton, NDrawer, NDrawerContent} from "naive-ui";
import useWindowSize from "@/hooks/useTool.ts";
import {useDyForm} from "@/hooks/useDyForm.ts";

type NaiZealTableSearchSlots = {
    title?: (obj: { isMobile: boolean }) => VNode[]
}
export const NaiZealTableSearch = defineComponent({
    name: 'NaiZealTableSearch',
    props: {
        title: {
            type: String,
        },
        drawerTitle: {
            type: String,
        },
        searchItems: {
            type: Array as PropType<Array<DyFormItem>>,
            default: []
        },
        searchFormMaxHeight: {
            type: String,
            default: '200px'
        },
        drawerMaxHeight: {
            type: Number,
            default: 420
        },
        checkWindowSize: {
            type: Array as PropType<number[]>,
            default: [756, 500]
        },
        drawerOpenTxt: {
            type: String,
            default: 'Search Drawer'
        },
        searchBtnTxt: {
            type: Array as PropType<string[]>,
            default: () => ['Reset', 'Search']
        },
        closeDrawerAuto: {
            type: Boolean,
            default: true
        },
        copyDefault: {
            type: Boolean,
            default: false
        }
    },
    emits: {
        onReset: () => true,
        onSearch: (data: object) => true,
    },
    slots: Object as SlotsType<NaiZealTableSearchSlots>,
    setup(props, {emit, slots, expose}) {
        const drawShow = ref<boolean>(false)
        const searchDynamicFormRef = ref<naiDynamicFormRef | null>(null)
        const copyData = ref<any>({})
        const useForm = useDyForm(props.searchItems)
        const {isMobile} = useWindowSize(...props.checkWindowSize)
        const toggleDrawer = (f?: boolean) => {
            drawShow.value = f ?? !drawShow.value
        }
        const onReset = () => {
            if (props.copyDefault) {
                useForm.setValues(copyData.value)
            } else useForm.onReset(null)
            emit('onReset')
            toggleDrawer(false)
        }
        const onSearch = () => {
            const data = useForm.getValues()
            emit('onSearch', data)
            toggleDrawer(false)
            return data
        }
        watch(() => isMobile.value, (n) => {
            if (props.closeDrawerAuto) return
            if (!n) toggleDrawer(false)
        })
        onMounted(async () => {
            await nextTick()
            if (props.copyDefault) {
                copyData.value = useForm.getValues()
            }
        })
        expose({
            onReset,
            onSearch,
            toggleDrawer
        })
        return () => {
            const [rTxt, sTxt] = props.searchBtnTxt
            return <div class='naiZealTableSearch'>
                {
                    isMobile.value ? <div class='drawerSearchBtn'>
                        {slots.title?.({isMobile: isMobile.value}) ?? <div class="naiTitle">
                            {props.title}
                        </div>}
                        <NButton size="small" onClick={() => {
                            toggleDrawer(true)
                        }}>{props.drawerOpenTxt}</NButton>
                    </div> : <>
                        <div class="naiTitle">
                            {props.title}
                        </div>
                        <div class="searchForm" style={{
                            maxHeight: props.searchFormMaxHeight
                        }}>
                            <NaiDynamicForm items={props.searchItems} ref={searchDynamicFormRef} preset={'grid'}
                                            formConfig={{
                                                labelPlacement: 'left',
                                                // showFeedback: false
                                            }}/>
                        </div>
                        <div class="searchBtn">
                            <NButton size="small" onClick={onReset}>{rTxt}</NButton>
                            <NButton type="info" size="small" onClick={onSearch}>{sTxt}</NButton>
                        </div>
                    </>

                }
                <NDrawer class='naiZealSearchDrawer' v-model:show={drawShow.value} maxHeight={props.drawerMaxHeight}
                         trapFocus={false}
                         blockScroll={false} placement="top">
                    <NDrawerContent title={props.drawerTitle ?? props.title} v-slots={{
                        footer: () => <div class="searchBtn">
                            <NButton size="small" onClick={onReset}>{rTxt}</NButton>
                            <NButton type="info" size="small" onClick={onSearch}>{sTxt}</NButton>
                        </div>
                    }}>
                        <div class="searchForm">
                            <NaiDynamicForm formConfig={
                                {
                                    labelPlacement: 'left',
                                    size: 'small',
                                    // showFeedback: false
                                }
                            } items={props.searchItems} ref={searchDynamicFormRef}/>
                        </div>
                    </NDrawerContent>
                </NDrawer>
            </div>
        }
    }
})