import {
    defineComponent,
    nextTick,
    onMounted,
    type PropType,
    ref,
    type SlotsType,
    type VNode,
    type VNodeChild
} from "vue";
import {NButton, NCard} from "naive-ui";
import {zealData} from "@/components/final/dataTest.ts";

type ZealCardSlots = {
    searchForm?: () => VNode[]
    searchBtn?: () => VNode[]
    controlBtn?: () => VNode[]
    default?: () => VNode[]
    rest?: () => VNode[]
    footer?: () => VNode[]
}
export default defineComponent({
    name: 'NaiZealCard',
    props: {
        title: {
            type: String,
        }
    },
    slots: Object as SlotsType<ZealCardSlots>,
    setup(props, {slots}) {
        onMounted(async () => {

        })
        return () => <div class='zealCard'>
            <NCard content-style={{display: 'flex', flexDirection: 'column'}} v-slots={{
                header: () => <div class='header'>
                    <div class="title">{props.title}</div>
                    <div class="search">
                        {slots.searchForm?.()}
                        {slots.searchBtn?.() || (slots.searchForm && <div class="searchBtn">
                            <NButton size="small">Reset</NButton>
                            <NButton type="info" size="small">Search</NButton>
                        </div>)}
                    </div>
                    <div class="controlBtn">
                        {slots.controlBtn?.()}
                    </div>
                </div>,
                footer: () => <div class='footer'>
                    {slots.footer?.()}
                </div>
            }}>
                <div style={{flex: 1, overflow: 'auto'}}>
                    {slots.default?.()}
                </div>
            </NCard>
            {slots.rest?.()}
        </div>
    }
})