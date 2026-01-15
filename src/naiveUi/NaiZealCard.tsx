import {
    defineComponent,
    type PropType,
    type SlotsType,
} from "vue";
import {NButton, NCard} from "naive-ui";
import type {ZealCardSlots} from "@/types/slots.ts";
import {useObserverSize} from "../hooks/useTool";

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
        }
    },
    slots: Object as SlotsType<ZealCardSlots>,
    setup(props, {slots}) {
        const {wrapRef, cardRef, restRef, tableHeight} = useObserverSize(NCard)
        return () => <div class='zealCard' style={{height: `calc(${props.zealHeight} - ${props.outPadding * 2}px)`}}
                          ref={wrapRef}>
            <NCard ref={cardRef} v-slots={{
                header: () => {
                    const [rTxt, sTxt] = props.searchBtnTxt
                    return <div class='header'>
                        {slots.header?.() ?? <>
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
            </NCard>
            <div ref={restRef}>{slots.rest?.()}</div>
        </div>
    }
})
const getPadY = (el: HTMLElement | null) => {
    if (!el) return 0;
    const s = getComputedStyle(el);
    return (parseFloat(s.paddingTop) || 0) + (parseFloat(s.paddingBottom) || 0);
};