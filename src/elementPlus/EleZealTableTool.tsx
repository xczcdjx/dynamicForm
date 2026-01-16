import {
    defineComponent,
    nextTick,
    onMounted,
    ref,
    watch,
    toRef,
} from "vue";
import type {PropType, SlotsType,} from 'vue'
import type {DyFormItem, ZealColumn, ZealPagination} from "@/types/form";
import type {EleZealTablePaginationSlots, EleZealTableSlots, ZealTableSearchSlots} from "@/types/slots";

import {ElPagination, ElButton, ElDrawer, ElTable, ElTableColumn, type TableProps} from 'element-plus'
import {EleDynamicForm} from "../elementPlus";
import {useDyForm} from "../hooks/useDyForm";
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
            type: [Number, String],
            default: 240
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
            default: false
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
            return <div class='eleZealTableSearch'>
                {
                    !props.mobileDrawer || !props.isMobile ?
                        <>
                            {slots.title?.() ?? <div class="naiTitle">
                                {props.title}
                            </div>}
                            <div class="searchForm" style={{
                                maxHeight: props.searchFormMaxHeight
                            }}>
                                <EleDynamicForm items={props.searchItems} preset={'grid'}
                                                formConfig={{
                                                    labelPosition: 'left',
                                                    showMessage: false
                                                    // showFeedback: false
                                                }}/>
                            </div>
                            {
                                slots.searchBtn ? slots.searchBtn?.({onSearch, onReset}) : <div class="searchBtn">
                                    <ElButton size="small" onClick={onReset}>{rTxt}</ElButton>
                                    <ElButton type="primary" size="small" onClick={onSearch}>{sTxt}</ElButton>
                                </div>}
                        </> :
                        <div class='drawerSearchBtn'>
                            {slots.title?.() ?? <div class="naiTitle">
                                {props.title}
                            </div>}
                            {
                                slots.drawerBtn ? slots.drawerBtn?.({openDrawer: () => toggleDrawer(true)}) :
                                    <ElButton size="small" onClick={() => {
                                        toggleDrawer(true)
                                    }}>{props.drawerOpenTxt}</ElButton>}
                        </div>

                }
                <ElDrawer class='eleZealSearchDrawer' v-model={drawShow.value} size={props.size}
                          trapFocus={false} direction="ttb" v-slots={{
                    header: () => <div>
                        {props.drawerTitle ?? props.title}
                    </div>,
                    footer: () =>
                        slots.searchBtn ? slots.searchBtn?.({onSearch, onReset}) : <div class="searchBtn">
                            <ElButton size="small" onClick={onReset}>{rTxt}</ElButton>
                            <ElButton type="primary" size="small" onClick={onSearch}>{sTxt}</ElButton>
                        </div>
                }}>
                    <div class="searchForm">
                        <EleDynamicForm formConfig={
                            {
                                labelPosition: 'left',
                                size: 'small',
                                showMessage: false
                            }
                        } items={props.searchItems}/>
                    </div>
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
        isMobile: {
            type: Boolean,
            default: false
        }
    },
    slots: Object as SlotsType<EleZealTablePaginationSlots>,
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

        return () => <ElPagination currentPage={pm.value?.pageNo}
                                   page-size={pm.value?.pageSize}
                                   total={pm.value?.total}
                                   pageSizes={pm.value?.pageSizes}
                                   layout={!slots.default && props.isMobile ? replaceLayout(pm.value?.layout) : pm.value?.layout}
                                   onUpdate:current-page={onChange}
                                   onUpdate:page-size={onPageSizeChange}
                                   {...props.pageConfig}
                                   v-slots={{
                                       ...slots
                                   }}
        />
    }
})
const escapeReg = (s: string) =>
    s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const replaceLayout = (t?: string, removes: string[] = ['sizes', 'jumper']) => {
    if (!t || removes.length === 0) return t
    const reg = new RegExp(
        `(^|,\\s*)(${removes.map(escapeReg).join('|')})(?=\\s*,|$)`,
        'g'
    )
    return t
        .replace(reg, '')
        .replace(/^,|,$/g, '')
}

export const EleZealTable = defineComponent({
    name: "EleZealTable",
    props: {
        data: {type: Array as PropType<any[]>, default: () => []},
        columns: {type: Array as PropType<ZealColumn<any>[]>, default: () => []},
        loading: {type: Boolean, default: false},
        maxHeight: {type: [Number, String] as PropType<number | string>},
        columnAlign: {
            type: String as PropType<ZealColumn<any>['align']>
        },
        stripe: {type: Boolean, default: true},
        border: {type: Boolean, default: false},
        tableConfig: {
            type: Object as PropType<Partial<TableProps<any>>>
        }
    },
    slots: Object as SlotsType<EleZealTableSlots>,
    setup(props, {slots}) {
        return () => (
            <ElTable
                data={props.data}
                maxHeight={props.maxHeight as any}
                v-loading={props.loading}
                stripe={props.stripe}
                border={props.border}
                {...props.tableConfig}
                v-slots={slots}
            >
                {props.columns.map((c) => {
                    const key = c.key ?? String(c.prop ?? c.label);
                    const align = c.align ?? props.columnAlign
                    return (
                        // @ts-ignore
                        <ElTableColumn
                            {...c}
                            align={align}
                            key={key}
                            v-slots={{
                                default: (scope: any) => {
                                    // 1) 优先用 render（naive 风格）
                                    if (c.render) return c.render({row: scope.row, $index: scope.$index});

                                    // 2) 其次用具名 slot（template 风格）
                                    const slotName = c.slot ?? (c.prop ? String(c.prop) : "");
                                    const s = slotName ? (slots as any)[slotName] : undefined;
                                    if (s) return s(scope);

                                    // 3) 最后默认显示 row[prop]
                                    if (c.prop) return scope.row[c.prop as any];
                                    return null;
                                },
                            }}
                        />
                    );
                })}
            </ElTable>
        );
    },
});