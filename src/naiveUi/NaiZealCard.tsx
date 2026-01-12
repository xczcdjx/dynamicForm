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
    default?: (tableHeight: number) => VNode[]
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
        const tableHeight = ref<number>(200)
        const bodyRef = ref<HTMLDivElement | null>(null)
        const wrapRef = ref<HTMLDivElement | null>(null)
        let ro: ResizeObserver | null = null

        const update = () => {
            tableHeight.value = bodyRef.value?.clientHeight ?? 0
            console.log('scrollHeight',wrapRef.value?.scrollHeight)
        }
        /*const onScroll = (e: Event) => {
            const el = e.target as HTMLElement;
            const { scrollTop, scrollHeight, clientHeight } = el;
            // 触底判断
            const reachBottom = scrollTop + clientHeight >= scrollHeight - 2;
            tableHeight.value=tableHeight.value-scrollTop
            console.log(window.pageYOffset)
            console.log("scrollTop:", scrollTop, "reachBottom:", reachBottom);
        };*/
        const onScroll = () => {
            const el = document.scrollingElement!;
            console.log("page scrollTop:", el.scrollTop);
        };
        onMounted(async () => {
            // wrapRef.value!.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener('resize',onScroll, { passive: true })
            await nextTick()
            update()
            // ro = new ResizeObserver(update)
            // bodyRef.value && ro.observe(bodyRef.value)
        })
        return () => <div class='zealCard' ref={wrapRef}>
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
                <div ref={bodyRef} style={{flex: 1, overflow: 'auto'}}>
                    {slots.default?.(tableHeight.value)}
                </div>
            </NCard>
            {slots.rest?.()}
        </div>
    }
})