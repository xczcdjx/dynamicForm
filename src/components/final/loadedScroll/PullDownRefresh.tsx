import {
    computed,
    defineComponent,
    nextTick,
    onBeforeUnmount,
    onMounted,
    type PropType,
    ref,
    type SlotsType,
    type VNode, watch
} from 'vue'
import '../../../index.less'
import {getMarginY, getPadY} from "@/utils/tools.ts";

export default defineComponent({
    name: 'PullDownRefresh',
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
        pullRefresh: {
            type: Boolean,
            default: false
        },
        refreshData: {
            type: Function as PropType<() => Promise<void>>,
        },
        pullDistance: {
            type: Number,
            default: 70
        },
        pullTxt: {
            type: String,
            default: 'pull to refresh'
        },
        releaseTxt: {
            type: String,
            default: 'release to refresh'
        },
        refreshingTxt: {
            type: String,
            default: 'refreshing...'
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

        const touching = ref(false)
        const refreshing = ref(false)
        const startY = ref(0)
        const pullY = ref(0)

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


        const pullText = computed(() => {
            if (refreshing.value) return props.refreshingTxt
            if (pullY.value >= props.pullDistance) return props.releaseTxt
            return props.pullTxt
        })

        function isTop() {
            return !scrollEl || scrollEl.scrollTop <= 2
        }

        function canPullRefresh() {
            return props.pullRefresh &&
                isTop() &&
                !props.loading &&
                !refreshing.value
        }

        function handleTouchStart(e: TouchEvent) {
            touching.value = false
            if (!props.pullRefresh || !scrollEl) return
            if (!isTop()) return
            if (props.loading || refreshing.value) return
            touching.value = true
            startY.value = e.touches[0]!.clientY
        }

        function handleTouchMove(e: TouchEvent) {
            if (!touching.value || !canPullRefresh()) return

            const currentY = e.touches[0]!.clientY
            const diff = currentY - startY.value

            if (diff <= 0) return

            // 阻止浏览器默认回弹
            e.preventDefault()

            // 阻尼效果
            pullY.value = Math.min(diff * 0.45, props.pullDistance + 30)
        }

        async function handleTouchEnd() {
            if (!touching.value) return

            touching.value = false

            if (pullY.value >= props.pullDistance) {
                await doRefresh()
            } else {
                pullY.value = 0
            }
        }

        async function doRefresh() {
            if (refreshing.value) return
            refreshing.value = true
            emit('update:loading', true)
            pullY.value = props.pullDistance
            try {
                emit('update:isError', false)
                if (props.refreshData) {
                    await props.refreshData()
                } else {
                    await props.loadData()
                }
            } catch (e) {
                emit('update:isError', true)
            } finally {
                refreshing.value = false
                emit('update:loading', false)
                await nextTick()
                await bindScroll()
                setTimeout(() => {
                    pullY.value = 0
                })
            }
        }

        async function bindScroll(resetScroll = false) {
            ignoreScroll.value = true
            await nextTick()
            const newScrollEl = wrapRef.value?.querySelector(props.scrollNode
            ) as HTMLElement | null
            unbindScroll()

            scrollEl = newScrollEl

            if (scrollEl) {
                if (resetScroll && !props.memoryScroll) scrollEl.scrollTop = 0
                scrollEl.addEventListener("scroll", handleScroll)
            }
            // 下拉刷新绑外层容器
            if (wrapRef.value && props.pullRefresh) {
                wrapRef.value.addEventListener('touchstart', handleTouchStart, {passive: true})
                wrapRef.value.addEventListener('touchmove', handleTouchMove, {passive: false})
                wrapRef.value.addEventListener('touchend', handleTouchEnd)
                wrapRef.value.addEventListener('touchcancel', handleTouchEnd)
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

        function unbindScroll() {
            if (scrollEl) {
                scrollEl.removeEventListener('scroll', handleScroll)
            }

            if (wrapRef.value) {
                wrapRef.value.removeEventListener('touchstart', handleTouchStart)
                wrapRef.value.removeEventListener('touchmove', handleTouchMove)
                wrapRef.value.removeEventListener('touchend', handleTouchEnd)
                wrapRef.value.removeEventListener('touchcancel', handleTouchEnd)
            }
        }

        onMounted(async () => {
            await bindHintHeight()
            await fetchData()
            await bindScroll()
        })

        onBeforeUnmount(unbindScroll)
        return () => <div ref={wrapRef} class='loadedScroll'>
            {props.pullRefresh && (
                <div
                    class='pullRefreshHint'
                    style={{
                        height: `${pullY.value}px`,
                        lineHeight: `${pullY.value}px`,
                        transition: touching.value ? 'none' : 'height .25s',
                        overflow: 'hidden',
                        textAlign: 'center'
                    }}
                >
                    {pullText.value}
                </div>
            )}
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