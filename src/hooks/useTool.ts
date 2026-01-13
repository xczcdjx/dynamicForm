import {computed, onMounted, onUnmounted, ref} from "vue";
import {Debounce} from "../utils/tools";

function useWindowSize(mobileWidth: number = 756, delay: number = 500) {
    const width = ref(window.innerWidth)
    const height = ref(window.innerWidth)
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
export {
    useWindowSize,
}
