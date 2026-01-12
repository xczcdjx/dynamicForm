export interface SongType {
    no: number
    title: string
    length: string
}
export type PageModal = {
    pageSize: number
    pageNo: number
}
const zealData: SongType[] = [
    {no: 3, title: 'Wonderwall', length: '4:18'},
    {no: 4, title: 'Don\'t Look Back in Anger', length: '4:48'},
    {no: 12, title: 'Champagne Supernova', length: '7:27'},
    ...Array.from({length: 10}).map((_, i) => ({no: i + 13, title: `test Data ${i + 1}`, length: `${i * i}`}))
]
export {zealData}