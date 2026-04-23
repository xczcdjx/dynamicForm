import {
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
        }
    },
    emits: {
        'update:loading': (v: boolean) => true,
        'update:isError': (v: boolean) => true,
    },
    slots: Object as SlotsType<{
        default: () => VNode
    }>,
    setup(props, {slots, emit}) {
        const ignoreScroll = ref(true)
        const wrapRef = ref<HTMLElement | null>(null)
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
                scrollEl.scrollTop = 0
                scrollEl.addEventListener("scroll", handleScroll)
            }
            requestAnimationFrame(() => {
                ignoreScroll.value = false
            })
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
            await fetchData()
            await bindScroll()
        })

        onBeforeUnmount(() => {
            if (scrollEl) {
                scrollEl.removeEventListener("scroll", handleScroll)
            }
        })
        return () => <div ref={wrapRef} class='loadedScroll'>
            {slots.default?.()}
            {props.finished ?
                <div class='hintText'>{props.finishedTxt}</div> :
                <>
                    {props.loading && <div class='hintText'>{props.loadingTxt}</div>}
                    {(props.isError && !props.loading) && <div class='hintText errorTxt' onClick={() => {
                        emit('update:isError', false)
                        fetchData()
                    }}>{props.errorTxt}</div>}
                </>}
        </div>
    }
})