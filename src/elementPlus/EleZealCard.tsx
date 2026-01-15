import {
    defineComponent,
    type PropType,
    type SlotsType,
} from "vue";
import {ElButton, ElCard} from "element-plus";
import type {ZealCardSlots} from "@/types/slots.ts";
import {useObserverSize} from "../hooks/useTool";

export default defineComponent({
    name: 'EleZealCard',
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
        }
    },
    slots: Object as SlotsType<ZealCardSlots>,
    setup(props, {slots}) {
        const {wrapRef, cardRef, restRef,tableHeight} = useObserverSize(ElCard)
        return () => <div class='zealCard' style={{height: `calc(${props.zealHeight} - ${props.outPadding * 2}px)`}}
                          ref={wrapRef}>
            <ElCard ref={cardRef} v-slots={{
                header: () => {
                    const [rTxt, sTxt] = props.searchBtnTxt
                    return <div class='header'>
                        {slots.header?.() ?? <>
                            <div class="title">{props.title}</div>
                            <div class="search">
                                {slots.searchForm?.()}
                                {slots.searchBtn?.() || (slots.searchForm && <div class="searchBtn">
                                    <ElButton size="small">{rTxt}</ElButton>
                                    <ElButton type="info" size="small">{sTxt}</ElButton>
                                </div>)}
                            </div>
                        </>}
                        <div class="controlBtn">
                            {slots.controlBtn?.()}
                            {slots.toolBtn?.()}
                        </div>
                    </div>
                },
                footer: () => <div class='footer'>
                    {slots.footer?.()}
                </div>
            }}>
                {slots.default?.({tableHeight: tableHeight.value})}
            </ElCard>
            <div ref={restRef}>{slots.rest?.()}</div>
        </div>
    }
})
