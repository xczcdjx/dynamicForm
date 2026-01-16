import type {ExposeDyFType, ExposePopupMType, ExposeType, ExposeZealTSearchType} from "@/types";
import EleDynamicInput from "./EleDynamicInput";
import EleDynamicCascadeInput from "./EleDynamicCascadeInput";
import EleDynamicForm from "./EleDynamicForm";
import ElePopupModal from "./ElePopupModal";
import EleZealCard from "./EleZealCard";
import {useDecorateForm} from './hooks/decorateForm'
import {EleZealTableSearch, EleZealTablePaginationControl,EleZealTable} from './EleZealTableTool'
import '../index.less'

type eleDynamicInputRef = InstanceType<typeof EleDynamicInput> & ExposeType
type eleCascadeDynamicInputRef = InstanceType<typeof EleDynamicCascadeInput> & ExposeType
type eleDynamicFormRef = InstanceType<typeof EleDynamicForm> & ExposeDyFType
type elePopupModalRef = InstanceType<typeof ElePopupModal> & ExposePopupMType
type eleZealTableSearchRef = InstanceType<typeof EleZealTableSearch> & ExposeZealTSearchType
export * from './hooks/renderForm'
export type{
    eleDynamicInputRef,
    eleCascadeDynamicInputRef,
    eleDynamicFormRef,
    elePopupModalRef,
    eleZealTableSearchRef
}
export {
    EleDynamicInput, EleDynamicCascadeInput,
    EleDynamicForm, ElePopupModal,
    EleZealCard, useDecorateForm,
    EleZealTableSearch, EleZealTablePaginationControl,EleZealTable
};
