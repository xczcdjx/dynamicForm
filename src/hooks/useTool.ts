import {type ComponentPublicInstance, computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref} from "vue";
import {Debounce, getPadY} from "../utils/tools";

type VueComponentCtor = abstract new (...args: any) => ComponentPublicInstance

function useWindowSize(mobileWidth: number = 756, delay: number = 500) {
    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)
    const listenSize = Debounce(() => {
        width.value = window.innerWidth
        height.value = window.innerHeight
    }, delay)
    const isMobile = computed(() => width.value <= mobileWidth)
    onMounted(() => {
        window.addEventListener('resize', listenSize)
    })
    onUnmounted(() => {
        window.removeEventListener('resize', listenSize)
    })
    return {
        width, height, isMobile
    }
}

function useObserverSize<T extends VueComponentCtor>(ct: T,delay:number=120) {
    const prefix = ct.name === 'ElCard' ? 'el' : 'n'
    const wrapRef = ref<HTMLDivElement | null>(null);
    const restRef = ref<HTMLDivElement | null>(null);
    const cardRef = ref<InstanceType<typeof ct> | null>(null);

    const tableHeight = ref(0);

    let ro: ResizeObserver | null = null;

    const getCardNodes = () => {
        const cardEl = (cardRef.value?.$el as HTMLElement | undefined) ?? null;
        if (!cardEl) {
            return {
                cardEl: null,
                headerWrap: null,
                footerWrap: null,
                contentEl: null
            };
        }

        const headerWrap =
            (cardEl.querySelector(`.${prefix}-card__header`) as HTMLElement | null) ||
            (cardEl.querySelector(`.${prefix}-card-header`) as HTMLElement | null);

        const footerWrap =
            (cardEl.querySelector(`.${prefix}-card__footer`) as HTMLElement | null);

        const contentEl =
            (cardEl.querySelector(`.${prefix}-card__body`) as HTMLElement | null) ||
            (cardEl.querySelector(`.${prefix}-card__content`) as HTMLElement | null);

        return {
            cardEl,
            headerWrap,
            footerWrap,
            contentEl
        };
    };

    const calcCore = () => {
        const wrap = wrapRef.value;
        const { cardEl, headerWrap, footerWrap, contentEl } = getCardNodes();
        if (!wrap || !cardEl) return;

        const wrapInnerH = wrap.clientHeight - getPadY(wrap);
        const restH = restRef.value?.offsetHeight ?? 0;
        const headerH = headerWrap?.offsetHeight ?? 0;
        const footerH = footerWrap?.offsetHeight ?? 0;
        const contentPadY = getPadY(contentEl);
        tableHeight.value = Math.max(
            0,
            wrapInnerH - restH - headerH - footerH - contentPadY
        );
    };

    onMounted(async () => {
        await nextTick();
        const calc=Debounce(calcCore,delay)

        ro = new ResizeObserver(calc);
        wrapRef.value && ro.observe(wrapRef.value);
        restRef.value && ro.observe(restRef.value);
        // header/footer/content 的高度变化也会影响 tableHeight，直接观察 card 根节点最省事
        // cardRef.value?.$el && ro.observe(cardRef.value.$el as HTMLElement);
        const { cardEl, headerWrap } = getCardNodes();
        cardEl && ro.observe(cardEl);
        if (prefix==='n') headerWrap && ro.observe(headerWrap);
    });

    onBeforeUnmount(() => {
        ro?.disconnect();
        ro = null;
    });
    return {
        wrapRef, cardRef, restRef, tableHeight
    }
}

export {
    useWindowSize, useObserverSize
}
