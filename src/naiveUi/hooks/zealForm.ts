import {reactive} from "vue";
import type {ZealPagination} from "@/types/form.ts";

export const usePagination = function (cb?: () => void, options?: Partial<ZealPagination>) {
    function onChange() {
        cb?.();
    }

    function onPageSizeChange() {
        cb?.();
    }

    const paginationInfo = reactive<ZealPagination>({
        pageNo: 1,
        pageSize: 25,
        showSizePicker: true,
        pageSizes: [25, 50, 100, 200],
        pageSlot: 5,
        total: 0,
        onChange,
        onPageSizeChange,
        setTotalSize(totalSize: number) {
            paginationInfo.total = totalSize
        },
        ...options,
    });
    return paginationInfo;
};