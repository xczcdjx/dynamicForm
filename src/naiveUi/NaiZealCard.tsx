import {
    defineComponent,
    nextTick, onBeforeUnmount,
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
        const wrapRef = ref<HTMLDivElement | null>(null);
        const headerRef = ref<HTMLDivElement | null>(null);
        const footerRef = ref<HTMLDivElement | null>(null);
        const restRef = ref<HTMLDivElement | null>(null);

        const tableHeight = ref(0);

        let ro: ResizeObserver | null = null;

        const calc = () => {
            const wrap = wrapRef.value;
            if (!wrap) return;

            const wrapH = wrap.clientHeight;
            const headerH = headerRef.value?.clientHeight ?? 0;
            const footerH = footerRef.value?.clientHeight ?? 0;
            const restH = restRef.value?.clientHeight ?? 0;

            // 如果你的 .zealCard 有 padding，clientHeight 已含 padding；
            // 你还需要视情况减掉 NCard 自己的 padding/边距（看你的布局）。
            console.log(wrap)
            const h = Math.max(0, wrapH - headerH - footerH - restH);
            tableHeight.value = h-wrap.scrollHeight;
            console.log(tableHeight.value)
        };

        onMounted(async () => {
            await nextTick();
            calc();

            ro = new ResizeObserver(calc);
            wrapRef.value && ro.observe(wrapRef.value);
            headerRef.value && ro.observe(headerRef.value);
            footerRef.value && ro.observe(footerRef.value);
            restRef.value && ro.observe(restRef.value);
        });

        onBeforeUnmount(() => {
            ro?.disconnect();
            ro = null;
        });
        return () => <div class='zealCard' ref={wrapRef}>
            <NCard v-slots={{
                header: () => <div class='header' ref={headerRef}>
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
                footer: () => <div class='footer' ref={footerRef}>
                    {slots.footer?.()}
                </div>
            }}>
                {slots.default?.(tableHeight.value)}
            </NCard>
            <div ref={restRef}>{slots.rest?.()}</div>
        </div>
    }
})