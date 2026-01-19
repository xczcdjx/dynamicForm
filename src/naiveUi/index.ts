import '../index.less'
import type {ExposeDyFType, ExposePopupMType, ExposeType, ExposeZealTSearchType} from "@/types";
import NaiDynamicInput from "./NaiDynamicInput";
import NaiDynamicCascadeInput from "./NaiDynamicCascadeInput";
import NaiDynamicForm from "./NaiDynamicForm";
import NaiPopupModal from "./NaiPopupModal";
import NaiZealCard from "./NaiZealCard";
import {useDecorateForm} from './hooks/decorateForm'
import {NaiZealTableSearch, NaiZealTablePaginationControl} from "./NaiZealTableTool";

type naiDynamicInputRef = InstanceType<typeof NaiDynamicInput> & ExposeType
type naiDynamicCascadeInputRef = InstanceType<typeof NaiDynamicCascadeInput> & ExposeType
type naiDynamicFormRef = InstanceType<typeof NaiDynamicForm> & ExposeDyFType
type naiPopupModalRef = InstanceType<typeof NaiPopupModal> & ExposePopupMType
type naiZealTableSearchRef = InstanceType<typeof NaiZealTableSearch> & ExposeZealTSearchType
export * from './hooks/renderForm'
export {
    NaiDynamicInput,
    NaiDynamicCascadeInput,
    NaiDynamicForm,
    NaiPopupModal,
    NaiZealCard,
    useDecorateForm,
    NaiZealTableSearch,
    NaiZealTablePaginationControl
};
export type {
    naiDynamicInputRef,
    naiDynamicCascadeInputRef,
    naiDynamicFormRef,
    naiPopupModalRef,
    naiZealTableSearchRef,
}
