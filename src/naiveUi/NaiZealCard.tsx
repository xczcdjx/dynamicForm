import {
    computed,
    defineComponent,
    type PropType,
    type SlotsType,
} from "vue";
import {NButton, NCard} from "naive-ui";
import type {ZealCardSlots} from "@/types/slots.ts";
import {useObserverSize, useWindowSize} from "../hooks/useTool";
import {unwrapObj} from "../utils/tools.ts";

export default defineComponent({
    name: 'NaiZealCard',
    props: {
        title: {
            type: String,
        },
        zealHeight: {
            type: String,
            default: '100vh'
        },
        outPadding: {
            type: Number,
            default: 20
        },
        searchBtnTxt: {
            type: Array as PropType<string[]>,
            default: () => ['Reset', 'Search']
        },
        checkWindowSize: {
            type: Array as PropType<number[]>,
            default: [756, 500]
        },
        observeDelay: {
            type: Number,
            default: 100
        }
    },
    slots: Object as SlotsType<ZealCardSlots>,
    setup(props, {slots, expose}) {
        const sizeObj = useWindowSize(...props.checkWindowSize)
        const {wrapRef, cardRef, restRef, tableHeight} = useObserverSize(NCard,props.observeDelay)
        expose({
            tableHeight,
            isMobile: computed(() => sizeObj.isMobile)
        })
        return () => {
            const unSizeObj = unwrapObj(sizeObj)
            return <div class='zealCard' style={{height: `calc(${props.zealHeight} - ${props.outPadding * 2}px)`}}
                        ref={wrapRef}>
                <NCard ref={cardRef} v-slots={{
                    header: () => {
                        const [rTxt, sTxt] = props.searchBtnTxt
                        return <div class='header'>
                            {slots.header?.(unSizeObj) ?? <>
                                <div class="title">{props.title}</div>
                                <div class="search">
                                    {slots.searchForm?.()}
                                    {slots.searchBtn?.() || (slots.searchForm && <div class="searchBtn">
                                        <NButton size="small">{rTxt}</NButton>
                                        <NButton type="info" size="small">{sTxt}</NButton>
                                    </div>)}
                                </div>
                            </>}
                            <div class="controlBtn">
                                <div>{slots.controlBtn?.()}</div>
                                {slots.toolBtn?.()}
                            </div>
                        </div>
                    },
                    footer: () => <div class='footer'>
                        {slots.footer?.(unSizeObj)}
                    </div>
                }}>
                    {slots.default?.({tableHeight: tableHeight.value, ...unSizeObj})}
                </NCard>
                <div ref={restRef}>{slots.rest?.()}</div>
            </div>
        }
    }
})