import {
    computed,
    defineComponent, type ExtractPropTypes,
    nextTick,
    onBeforeUnmount,
    onMounted,
    type PropType, type Ref,
    ref, type SetupContext,
    type SlotsType,
    type VNode,
    watch
} from 'vue'
import {getEventId, getClientY} from '@/utils/tools'
import type {ListenerItem, PullEvent} from "@/types";

const loadedScrollProps = {
    loading: {
        type: Boolean,
        default: false
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
    supportMode: {
        type: String as PropType<'pc' | 'mobile' | 'all'>,
        default: 'mobile'
    },
    refreshLoading: {
        type: Boolean,
        default: true
    },
    stackStatus: {
        // true 时常驻展示结束/错误提示，false 时仅在滚动底部展示
        type: Boolean,
        default: true
    },
}

const loadedScrollEmits = {
    'update:loading': (v: boolean) => true,
    'update:isError': (v: boolean) => true
}

type LoadedScrollProps = ExtractPropTypes<typeof loadedScrollProps>
type LoadedScrollEmit = SetupContext<typeof loadedScrollEmits>['emit']

export default defineComponent({
    name: 'LoadedScroll',
    props: loadedScrollProps,
    emits: loadedScrollEmits,
    slots: Object as SlotsType<{
        default: (obj: { hintHeight: number }) => VNode
        bottomHint: () => VNode
        errorTxt: () => VNode
        loadingTxt: () => VNode
        finishedTxt: () => VNode
        pullTxt: () => VNode
        releaseTxt: () => VNode
        refreshingTxt: () => VNode
    }>,
    setup(props, {slots, emit}) {
        // node
        const wrapRef = ref<HTMLElement | null>(null)
        let scrollEl: HTMLElement | null = null
        const isAtBottom = ref(false)
        // bottom
        const {
            ignoreScroll,
            botHintRef,
            hintHeight,
            handleScroll,
            updateBottomStatus,
            bindHintHeight,
            fetchData
        } = useBotLoaded(props, emit, f => {
            isAtBottom.value = f
        })
        // top
        const {pullY, pullText, touching, bindLoaded, unbindLoaded} = useTopRefresh(props, emit, wrapRef, bindScroll)
        const showBottomStatus = computed(() => {
            return props.stackStatus || isAtBottom.value
        })

        watch(() => [props.loading, props.finished, props.isError], () => {
            if (scrollEl) updateBottomStatus(scrollEl)
        }, {flush: 'post'})

        async function bindScroll() {
            ignoreScroll.value = true
            await nextTick()
            const newScrollEl = wrapRef.value?.querySelector(props.scrollNode as string) as HTMLElement | null
            scrollEl?.removeEventListener("scroll", handleScroll)


            scrollEl = newScrollEl

            if (scrollEl) {
                if (!props.memoryScroll) scrollEl.scrollTop = 0
                updateBottomStatus(scrollEl)
                scrollEl.addEventListener("scroll", handleScroll)
            } else {
                isAtBottom.value = false
            }
            setTimeout(() => {
                ignoreScroll.value = false
            })
        }


        onMounted(async () => {
            await bindHintHeight()
            await fetchData()
            await bindScroll()
            bindLoaded()
        })

        onBeforeUnmount(() => {
            if (scrollEl) {
                scrollEl.removeEventListener("scroll", handleScroll)
            }
            unbindLoaded()
        })

        return () => (
            <div ref={wrapRef} class='loadedScroll'>
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
                {slots.default?.({hintHeight: hintHeight.value})}
                <div ref={botHintRef} style={{display: 'flow-root'}}>
                    {slots.bottomHint ? slots.bottomHint?.() : (
                        <>
                            {props.loading && (
                                <div class='hintText'>
                                    {slots.loadingTxt?.() ?? props.loadingTxt}
                                </div>
                            )}

                            {showBottomStatus.value && props.finished && (
                                <div class='hintText'>
                                    {slots.finishedTxt?.() ?? props.finishedTxt}
                                </div>
                            )}

                            {showBottomStatus.value &&
                                props.isError &&
                                !props.loading && (
                                    <div
                                        class='hintText errorTxt'
                                        data-no-pull
                                        // @ts-ignore
                                        onPointerDown={(e) => e.stopPropagation()}
                                        // @ts-ignore
                                        onTouchStart={(e) => e.stopPropagation()}
                                        onClick={() => {
                                            emit('update:loading', true)
                                            emit('update:isError', false)
                                            fetchData()
                                        }}
                                    >
                                        {slots.errorTxt?.() ?? props.errorTxt}
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </div>
        )
    }
})

function useBotLoaded(props: LoadedScrollProps, emit: LoadedScrollEmit, cb: (f: boolean) => void) {
    const ignoreScroll = ref(true)  // 防止初始化请求两次
    const botHeight = ref<number>(0)
    const botHintRef = ref<HTMLDivElement | null>(null)
    // 根据实际渲染内容占位，提示隐藏或自定义插槽为空时高度为 0。
    const hintHeight = botHeight
    let hintObserver: ResizeObserver | undefined

    function updateBottomStatus(target: HTMLElement) {
        const reachBottom =
            target.scrollTop + target.clientHeight >= target.scrollHeight - props.offset
        // 提示出现会压缩表格高度，补回占位高度以避免显示/隐藏反复切换。
        cb(target.scrollTop + target.clientHeight + hintHeight.value >= target.scrollHeight - props.offset)
        return reachBottom
    }

    function handleScroll(e: Event) {
        // 状态提示仍需跟随滚动；终态只阻止继续请求数据。
        const reachBottom = updateBottomStatus(e.target as HTMLElement)
        if (
            ignoreScroll.value ||
            props.loading ||
            props.finished ||
            props.isError ||
            !reachBottom
        ) {
            return
        }
        emit('update:loading', true)
        fetchData()
    }

    async function bindHintHeight() {
        await nextTick()
        const botRef = botHintRef.value
        if (!botRef) return
        const measure = () => {
            botHeight.value = botRef.getBoundingClientRect().height
        }
        measure()
        hintObserver?.disconnect()
        hintObserver = new ResizeObserver(measure)
        hintObserver.observe(botRef)
    }

    onBeforeUnmount(() => hintObserver?.disconnect())

    async function fetchData() {
        return props.loadData?.().then(v => {
            emit('update:loading', false)
        }).catch(r => {
            emit('update:loading', false)
            emit('update:isError', true)
        })
    }

    return {
        ignoreScroll, hintHeight, botHeight, botHintRef,
        handleScroll, updateBottomStatus, bindHintHeight, fetchData
    }
}

function useTopRefresh(props: LoadedScrollProps, emit: LoadedScrollEmit, wrapRef: Ref<HTMLElement | null>, bindScroll: () => Promise<void>) {
    const pointerId = ref<number | null>(null)
    const touching = ref(false)
    const refreshing = ref(false)
    const startY = ref(0)
    const pullY = ref(0)
    const pullText = computed(() => {
        if (refreshing.value) return props.refreshingTxt
        if (pullY.value >= props.pullDistance) return props.releaseTxt
        return props.pullTxt
    })

    function isTop() {
        return !wrapRef.value || wrapRef.value.scrollTop <= 2
    }

    function canPullRefresh() {
        return props.pullRefresh &&
            isTop() &&
            !refreshing.value
    }

    function handleStart(e: PullEvent) {
        if (isNoPullTarget(e)) return
        touching.value = false

        if (!props.pullRefresh) return
        if (!isTop()) return
        if (refreshing.value) return

        touching.value = true
        startY.value = getClientY(e)
        pointerId.value = getEventId(e)

        if ('pointerId' in e) {
            ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
        }
    }

    function handleMove(e: PullEvent) {
        if (!touching.value) return

        if ('pointerId' in e && pointerId.value !== e.pointerId) return
        if (!canPullRefresh()) return

        const currentY = getClientY(e)
        const diff = currentY - startY.value

        if (diff <= 0) return

        e.preventDefault()

        pullY.value = Math.min(diff * 0.45, props.pullDistance + 30)
    }

    function handleEnd(e: PullEvent) {
        if (!touching.value) return

        if ('pointerId' in e && pointerId.value !== e.pointerId) return

        touching.value = false

        if ('pointerId' in e) {
            ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
        }

        pointerId.value = null

        if (pullY.value >= props.pullDistance) {
            doRefresh()
        } else {
            pullY.value = 0
        }
    }

    async function doRefresh() {
        if (refreshing.value) return
        refreshing.value = true
        if (props.refreshLoading) emit('update:loading', true)
        pullY.value = props.pullDistance
        try {
            emit('update:isError', false)
            await props.refreshData?.()
        } catch (e) {
            emit('update:isError', true)
        } finally {
            refreshing.value = false
            await nextTick()
            // await bindLoaded()
            await bindScroll()
            if (props.refreshLoading) emit('update:loading', false)
            setTimeout(() => {
                pullY.value = 0
            })
        }
    }

    async function bindLoaded() {
        await nextTick()
        unbindLoaded()


        if (!wrapRef.value || !props.pullRefresh) return
        getPullEvents().forEach(({name, handler, options}) => {
            wrapRef.value?.addEventListener(name, handler, options)
        })
    }

    function isNoPullTarget(e: Event) {
        const target = e.target as HTMLElement | null
        return !!target?.closest('[data-no-pull]')
    }

    function unbindLoaded() {
        getPullEvents().forEach(({name, handler, options}) => {
            wrapRef.value?.removeEventListener(name, handler, options)
        })
    }

    function getPullEvents(): ListenerItem[] {
        const start = handleStart as EventListener
        const move = handleMove as EventListener
        const end = handleEnd as EventListener
        const pcArr: ListenerItem[] = [
            {name: 'pointerdown', handler: start},
            {name: 'pointermove', handler: move},
            {name: 'pointerup', handler: end},
            {name: 'pointercancel', handler: end}
        ]
        const mobileArr: ListenerItem[] = [
            {name: 'touchstart', handler: start, options: {passive: true}},
            {name: 'touchmove', handler: move, options: {passive: false}},
            {name: 'touchend', handler: end},
            {name: 'touchcancel', handler: end}
        ]
        switch (props.supportMode) {
            case "pc":
                return pcArr
            case "mobile":
                return mobileArr
            default:
                return [...pcArr, ...mobileArr];
        }
    }

    return {
        pullY, touching, pullText, bindLoaded, unbindLoaded
    }
}
