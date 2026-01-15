import {
    defineComponent,
    nextTick,
    onMounted,
    ref,
    watch,
    toRef,
} from "vue";
import type {PropType, SlotsType, VNode,} from 'vue'
import type {DyFormItem, PageModal, ZealPagination} from "@/types/form";
import type {EleZealTablePaginationSlots, ZealTableSearchSlots} from "@/types/slots";

import {ElPagination,ElButton,ElDrawer} from 'element-plus'
import {NaiDynamicForm} from "../naiveUi";
import {useDyForm} from "../hooks/useDyForm";
import {useWindowSize} from "../hooks/useTool";
import type {PaginationProps} from "element-plus/es/components/pagination/src/pagination";


export const EleZealTableSearch = defineComponent({
    name: 'EleZealTableSearch',
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
        size: {
            type: [Number,String],
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
        mobileDrawer: {
            type: Boolean,
            default: true
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
    slots: Object as SlotsType<ZealTableSearchSlots>,
    setup(props, {emit, slots, expose}) {
        const drawShow = ref<boolean>(false)
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
            toggleDrawer,
            getParams: () => useForm.getValues()
        })
        return () => {
            const [rTxt, sTxt] = props.searchBtnTxt
            return <div class='naiZealTableSearch'>
                {
                    !props.mobileDrawer || !isMobile.value ?
                        <>
                            {slots.title?.({isMobile: isMobile.value}) ?? <div class="naiTitle">
                                {props.title}
                            </div>}
                            <div class="searchForm" style={{
                                maxHeight: props.searchFormMaxHeight
                            }}>
                                <NaiDynamicForm items={props.searchItems} preset={'grid'}
                                                formConfig={{
                                                    labelPlacement: 'left',
                                                    // showFeedback: false
                                                }}/>
                            </div>
                            <div class="searchBtn">
                                <ElButton size="small" onClick={onReset}>{rTxt}</ElButton>
                                <ElButton type="info" size="small" onClick={onSearch}>{sTxt}</ElButton>
                            </div>
                        </> :
                        <div class='drawerSearchBtn'>
                            {slots.title?.({isMobile: isMobile.value}) ?? <div class="naiTitle">
                                {props.title}
                            </div>}
                            <ElButton size="small" onClick={() => {
                                toggleDrawer(true)
                            }}>{props.drawerOpenTxt}</ElButton>
                        </div>

                }
                <ElDrawer class='naiZealSearchDrawer' v-model={drawShow.value} size={props.size}
                         trapFocus={false} direction="ttb">
                    {/*<NDrawerContent title={props.drawerTitle ?? props.title} v-slots={{
                        footer: () => <div class="searchBtn">
                            <ElButton size="small" onClick={onReset}>{rTxt}</ElButton>
                            <ElButton type="info" size="small" onClick={onSearch}>{sTxt}</ElButton>
                        </div>
                    }}>
                        <div class="searchForm">
                            <NaiDynamicForm formConfig={
                                {
                                    labelPlacement: 'left',
                                    size: 'small',
                                    // showFeedback: false
                                }
                            } items={props.searchItems}/>
                        </div>
                    </NDrawerContent>*/}
                </ElDrawer>
            </div>
        }
    }
})

export const EleZealTablePaginationControl = defineComponent({
    name: 'EleZealTablePaginationControl',
    props: {
        pagination: {
            type: Object as PropType<ZealPagination>,
            required: true
        },
        pageConfig: {
            type: Object as PropType<PaginationProps>
        },
        checkWindowSize: {
            type: Array as PropType<number[]>,
            default: [756, 500]
        },
    },
    slots: Object as SlotsType<EleZealTablePaginationSlots>,
    setup(props, {slots}) {
        const pm = toRef(props, 'pagination')
        const {isMobile} = useWindowSize(...props.checkWindowSize)

        function onChange(page: number) {
            pm.value!.pageNo = page
            pm.value?.onChange()
        }

        function onPageSizeChange(pageSize: number) {
            pm.value!.pageNo = 1
            pm.value!.pageSize = pageSize
            pm.value?.onPageSizeChange()
        }

        return () => <ElPagination currentPage={pm.value?.pageNo}
                                   page-size={pm.value?.pageSize}
                                   total={pm.value?.total}
                                   pageSizes={pm.value?.pageSizes}
                                   layout={slots.default && isMobile.value ? replaceLayout(pm.value?.layout) : pm.value?.layout}
                                   onUpdate:current-page={onChange}
                                   onUpdate:page-size={onPageSizeChange}
                                   {...props.pageConfig}
                                   v-slots={{
                                       ...slots
                                   }}
        />
    }
})
const replaceLayout = (t?: string) =>
    t?.split(',').filter(it => ['sizes', 'jumper'].includes(it)).join(',')