import {
    defineComponent,
    nextTick,
    onMounted,
    ref,
    watch,
    toRef, type VNodeChild,
} from "vue";
import type {PropType, SlotsType, VNode} from 'vue'
import type {DyFormItem, ZealPagination} from "@/types/form";
import type {ZealTableBtnControlSlots, ZealTableSearchSlots} from "@/types/slots";
import type {PaginationProps, PaginationSlots} from "naive-ui/es/pagination/src/Pagination";
import {NButton, NDrawer, NDrawerContent, NDropdown, NPagination, NSpace} from "naive-ui";
import {NaiDynamicForm} from "../naiveUi";
import {useDyForm} from "../hooks/useDyForm";
import type {TableBtnType} from "@/types";


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
        },
        isMobile: {
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
        watch(() => props.isMobile, (n) => {
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
                    !props.mobileDrawer || !props.isMobile ?
                        <>
                            {slots.title?.() ?? <div class="naiTitle">
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
                            {
                                slots.searchBtn ? slots.searchBtn?.({onSearch, onReset}) : <div class="searchBtn">
                                    <NButton size="small" onClick={onReset}>{rTxt}</NButton>
                                    <NButton type="info" size="small" onClick={onSearch}>{sTxt}</NButton>
                                </div>
                            }
                        </> :
                        <div class='drawerSearchBtn'>
                            {slots.title?.() ?? <div class="naiTitle">
                                {props.title}
                            </div>}
                            {
                                slots.drawerBtn ? slots.drawerBtn?.({openDrawer: () => toggleDrawer(true)}) :
                                    <NButton size="small" onClick={() => {
                                        toggleDrawer(true)
                                    }}>{props.drawerOpenTxt}</NButton>
                            }
                        </div>

                }
                <NDrawer class='naiZealSearchDrawer' v-model:show={drawShow.value} maxHeight={props.drawerMaxHeight}
                         trapFocus={false}
                         blockScroll={false} placement="top">
                    <NDrawerContent title={props.drawerTitle ?? props.title} v-slots={{
                        footer: () => slots.searchBtn ? slots.searchBtn?.({onSearch, onReset}) : <div class="searchBtn">
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
                            } items={props.searchItems}/>
                        </div>
                    </NDrawerContent>
                </NDrawer>
            </div>
        }
    }
})
/* no support */
/*export const NaiZealTablePagination = defineComponent({
    name: 'NaiZealTablePagination',
    props: {
        pageKeyConfig: {
            type: Array as PropType<string[]>,
            default: () => ['pageNo', 'pageSize', 'total'],
        },
        pageConfig: {
            type: Object as PropType<PaginationProps>
        },
        pageSizes: {
            type: Array as PropType<number[]>,
            default: () => [25, 50, 100, 200],
        }
    },
    emits: {
        pageChange: (v: any) => true,
        pageSizeChange: (v: any) => true,
    },
    slots: Object as SlotsType<PaginationSlots>,
    setup(props, {emit, slots, expose}) {
        const [noKey = 'pageNo', sizeKey = 'pageSize', totalKey = 'total'] = props.pageKeyConfig
        const [initPageSize = 25] = props.pageSizes
        const pm = reactive<PageModal>({pageNo: 1, pageSize: initPageSize, total: 0})
        const setPageNo = (n: number) => {
            pm.pageNo = n
            emit('pageChange', {
                [noKey]: n,
                [sizeKey]: pm.pageSize
            })
        }
        const setPageSize = (n: number) => {
            pm.pageSize = n
            emit('pageSizeChange', {
                [noKey]: pm.pageNo,
                [sizeKey]: n
            })
        }
        const setPage = (v: Record<string, any>) => {
            pm.pageNo = v[noKey]
            pm.pageSize = v[sizeKey]
            pm.total = v[totalKey]
        }
        const setTotal = (total: number) => {
            pm.total = total
        }
        const reset = () => {
            pm.pageNo = 1
            pm.pageSize = initPageSize
            pm.total = 0
        }
        expose({
            setPage,
            setTotal,
            reset
        })
        return () => <NPagination page={pm.pageNo}
                                  page-size={pm.pageSize}
                                  itemCount={pm.total}
                                  onUpdate:page={setPageNo}
                                  onUpdate:pageSize={setPageSize}
                                  {...props.pageConfig}
                                  v-slots={{
                                      // prefix:({itemCount})=><span>Total {itemCount}</span>
                                      ...slots
                                  }}
        />
    }
})*/
export const NaiZealTablePaginationControl = defineComponent({
    name: 'NaiZealTablePaginationControl',
    props: {
        pagination: {
            type: Object as PropType<ZealPagination>,
            required: true
        },
        pageConfig: {
            type: Object as PropType<PaginationProps>
        },
        isMobile: {
            type: Boolean,
            default: false
        }
    },
    slots: Object as SlotsType<PaginationSlots>,
    setup(props, {slots}) {
        const pm = toRef(props, 'pagination')

        function onChange(page: number) {
            pm.value!.pageNo = page
            pm.value?.onChange()
        }

        function onPageSizeChange(pageSize: number) {
            pm.value!.pageNo = 1
            pm.value!.pageSize = pageSize
            pm.value?.onPageSizeChange()
        }

        return () => <NPagination page={pm.value?.pageNo}
                                  page-size={pm.value?.pageSize}
                                  itemCount={pm.value?.total}
                                  pageSizes={pm.value?.pageSizes}
                                  pageSlot={pm.value?.pageSlot}
                                  showSizePicker={slots.prefix && props.isMobile ? false : pm.value?.showSizePicker}
                                  onUpdate:page={onChange}
                                  onUpdate:pageSize={onPageSizeChange}
                                  {...props.pageConfig}
                                  v-slots={{
                                      // prefix:({itemCount})=><span>Total {itemCount}</span>
                                      ...slots
                                  }}
        />
    }
})
export const NaiZealTableBtnControl = defineComponent({
    name: 'NaiZealTableBtnControl',
    props: {
        isMobile: {
            type: Boolean,
            default: false
        },
        btnItems: {
            type: Array as PropType<TableBtnType[]>,
            default: () => []
        },
        size: {
            type: String as PropType<"medium" | "small" | "large">,
        },
        dropDownText: {
            type: String,
            default: '更多'
        }
    },
    slots: Object as SlotsType<ZealTableBtnControlSlots>,
    emits: {
        onSelect: (k: string) => true
    },
    setup(props, {emit, slots}) {
        const items = props.btnItems
        const {dropDownText, size} = props
        const onSelect = (k: string) => {
            items.find(it => it.key === k)?.onSelect?.(k)
            emit('onSelect', k)
        }
        return () => <NSpace>
            {!props.isMobile ? items.map(it => {
                const {key, onSelect, title, ...p} = it
                // @ts-ignore
                return <NButton size={size} key={key} onClick={() => {
                    onSelect?.(key)
                    emit('onSelect', key)
                }} {...p}>{title}</NButton>
            }) : <NDropdown size={size} trigger='click'
                            onSelect={onSelect}
                            options={items.map(it => ({label: it.title, disabled: it.disabled, key: it.key}))}
                            v-slots={{
                                default: () => slots.text ? slots.text() : <NButton size={size}>
                                    {dropDownText}
                                </NButton>
                            }}
            />}
        </NSpace>
    }
})