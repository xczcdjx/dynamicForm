import {
    defineComponent,
    nextTick, onBeforeUnmount,
    onMounted,
    ref,
    type PropType,
    type SlotsType,
    type VNode,
    type VNodeChild
} from "vue";
import {NButton, NCard} from "naive-ui";
import type {ZealCardSlots} from "@/types/slots.ts";

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
        const wrapRef = ref<HTMLDivElement | null>(null);
        const restRef = ref<HTMLDivElement | null>(null);
        const cardRef = ref<InstanceType<typeof NCard> | null>(null);

        const tableHeight = ref(0);

        let ro: ResizeObserver | null = null;

        const calc = () => {
            const wrap = wrapRef.value;
            const cardEl = (cardRef.value?.$el as HTMLElement | undefined) ?? null;
            if (!wrap || !cardEl) return;

            const wrapInnerH = wrap.clientHeight - getPadY(wrap);

            // rest 在 card
            const restH = restRef.value?.offsetHeight ?? 0;

            // card header/footer 容器
            const headerWrap =
                (cardEl.querySelector(".n-card__header") as HTMLElement | null) ||
                (cardEl.querySelector(".n-card-header") as HTMLElement | null);
            const footerWrap =
                (cardEl.querySelector(".n-card__footer") as HTMLElement | null) ||
                (cardEl.querySelector(".n-card-footer") as HTMLElement | null);

            const headerH = headerWrap?.offsetHeight ?? 0;
            const footerH = footerWrap?.offsetHeight ?? 0;

            // 量 content 的 padding
            const contentEl =
                (cardEl.querySelector(".n-card__content") as HTMLElement | null) ||
                (cardEl.querySelector(".n-card-content") as HTMLElement | null);
            const contentPadY = getPadY(contentEl);
            tableHeight.value = Math.max(
                0,
                wrapInnerH - restH - headerH - footerH - contentPadY
            );
        };

        onMounted(async () => {
            await nextTick();
            calc();

            ro = new ResizeObserver(calc);
            wrapRef.value && ro.observe(wrapRef.value);
            restRef.value && ro.observe(restRef.value);
            // header/footer/content 的高度变化也会影响 tableHeight，直接观察 card 根节点最省事
            cardRef.value?.$el && ro.observe(cardRef.value.$el as HTMLElement);
        });

        onBeforeUnmount(() => {
            ro?.disconnect();
            ro = null;
        });
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