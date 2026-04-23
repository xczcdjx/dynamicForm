import {
    computed,
    defineComponent,
    nextTick,
    onBeforeUnmount,
    onMounted,
    type PropType,
    ref,
    type SlotsType,
    type VNode
} from 'vue'
import '../../../index.less'
import {getMarginY, getPadY} from "@/utils/tools.ts";

export default defineComponent({
    name: 'BottomTouchFetch',
    props: {
        loading: {
            type: Boolean,
            default: true
        },
        isError: {
            type: Boolean,
            default: false
        },
        loadData: {
            type: Function as PropType<() => Promise<void>>,
            required: true
        },
        scrollNode: {
            type: String,
            required: true
        },
        loadingTxt: {
            type: String,
            default: 'loading...'
        },
        finishedTxt: {
            type: String,
            default: 'no more data'
        },
        errorTxt: {
            type: String,
            default: 'fetch error , click again'
        },
        finished: {
            type: Boolean,
            default: false
        },
        offset: {
            type: Number,
            default: 20
        },
        memoryScroll: {
            type: Boolean,
            default: false
        },
    },
    emits: {
        'update:loading': (v: boolean) => true,
        'update:isError': (v: boolean) => true,
    },
    slots: Object as SlotsType<{
        default: (hintHeight: number) => VNode
        bottomHint: () => VNode
        errorTxt: () => VNode
        loadingTxt: () => VNode
        finishedTxt: () => VNode
    }>,
    setup(props, {slots, emit}) {
        const wrapRef = ref<HTMLElement | null>(null)
        const botHintRef = ref<HTMLDivElement | null>(null)
        const ignoreScroll = ref(true)  // 防止初始化请求两次
        const botHeight = ref<number>(0)
        const hintHeight = computed(() => (props.loading || props.finished || props.isError) ? botHeight.value : 0)
        let scrollEl: HTMLElement | null = null

        function handleScroll(e: Event) {
            if (ignoreScroll.value || props.loading || props.finished || props.isError) return
            const target = e.target as HTMLElement
            const reachBottom =
                target.scrollTop + target.clientHeight >= target.scrollHeight - props.offset

            if (reachBottom) {
                emit('update:loading', true)
                fetchData()
            }
        }

        async function bindScroll() {
            ignoreScroll.value = true
            await nextTick()
            const newScrollEl = wrapRef.value?.querySelector(props.scrollNode
            ) as HTMLElement | null
            if (scrollEl) {
                scrollEl.removeEventListener("scroll", handleScroll)
            }

            scrollEl = newScrollEl

            if (scrollEl) {
                if (!props.memoryScroll) scrollEl.scrollTop = 0
                scrollEl.addEventListener("scroll", handleScroll)
            }
            requestAnimationFrame(() => {
                ignoreScroll.value = false
            })
        }

        async function bindHintHeight() {
            const botRef = botHintRef.value?.getElementsByTagName('div')[0] as HTMLElement | null
            botHeight.value = (botRef?.clientHeight ?? 0) + getMarginY(botRef)
        }

        async function fetchData() {
            return props.loadData().then(v => {
                emit('update:loading', false)
            }).catch(r => {
                emit('update:loading', false)
                emit('update:isError', true)
            })
        }

        onMounted(async () => {
            await bindHintHeight()
            await fetchData()
            await bindScroll()
        })

        onBeforeUnmount(() => {
            if (scrollEl) {
                scrollEl.removeEventListener("scroll", handleScroll)
            }
        })
        return () => <div ref={wrapRef} class='loadedScroll'>
            {slots.default?.(hintHeight.value)}
            <div ref={botHintRef}>
                {slots.bottomHint ? slots.bottomHint?.() : props.finished ?
                    <div class='hintText'>{slots.finishedTxt?.() ?? props.finishedTxt}</div> :
                    <>
                        {props.loading && <div class='hintText'>{slots.loadingTxt?.() ?? props.loadingTxt}</div>}
                        {(props.isError && !props.loading) && <div class='hintText errorTxt' onClick={() => {
                            emit('update:loading', true)
                            emit('update:isError', false)
                            fetchData()
                        }}>{slots.errorTxt?.() ?? props.errorTxt}</div>}
                    </>}
            </div>
        </div>
    }
})