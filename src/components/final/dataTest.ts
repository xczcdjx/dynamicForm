import {ref} from "vue";

export interface SongType {
    no: number|string
    title: string
    length: string
}
const zealData = ref<SongType[]>([
    {no: 3, title: 'Wonderwall', length: '4:18'},
    {no: 4, title: 'Don\'t Look Back in Anger', length: '4:48'},
    {no: 12, title: 'Champagne Supernova', length: '7:27'},
    ...Array.from({length: 50}).map((_, i) => ({no: i + 13, title: `test Data ${i + 1}`, length: `${i * i}`}))
])
export {zealData}