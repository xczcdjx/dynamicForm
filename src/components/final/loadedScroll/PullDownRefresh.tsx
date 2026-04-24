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

type PullEvent = TouchEvent | PointerEvent
type ListenerItem = {
    name: keyof HTMLElementEventMap
    handler: EventListener
    options?: AddEventListenerOptions | boolean
}

function getClientY(e: PullEvent) {
    if ('touches' in e) {
        return e.touches[0]?.clientY ?? 0
    }
    return e.clientY
}

function getEventId(e: PullEvent) {
    if ('pointerId' in e) {
        return e.pointerId
    }
    return null
}

export default defineComponent({
    name: 'PullDownRefresh',
    props: {
        isError: {
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
    },
    emits: {
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
            pullY.value = props.pullDistance
            try {
                emit('update:isError', false)
                await props.refreshData?.()
            } catch (e) {
                emit('update:isError', true)
            } finally {
                refreshing.value = false
                await nextTick()
                await bindScroll()
                setTimeout(() => {
                    pullY.value = 0
                })
            }
        }

        async function bindScroll() {
            await nextTick()
            unbindScroll()


            if (!wrapRef.value || !props.pullRefresh) return
            getPullEvents().forEach(({name, handler, options}) => {
                wrapRef.value?.addEventListener(name, handler, options)
            })
        }

        function unbindScroll() {
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

        onMounted(bindScroll)

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
            {slots.default?.(0)}
        </div>
    }
})