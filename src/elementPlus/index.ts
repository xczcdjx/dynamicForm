import '../index.less'
import type {ExposeDyFType, ExposePopupMType, ExposeType, ExposeZealCardType, ExposeZealTSearchType} from "@/types";
import EleDynamicInput from "./EleDynamicInput";
import EleDynamicCascadeInput from "./EleDynamicCascadeInput";
import EleDynamicForm from "./EleDynamicForm";
import ElePopupModal from "./ElePopupModal";
import EleZealCard from "./EleZealCard";
import {useDecorateForm} from './hooks/decorateForm'
import {EleZealTableSearch, EleZealTablePaginationControl,EleZealTable,EleZealTableBtnControl} from './EleZealTableTool'

type eleDynamicInputRef = InstanceType<typeof EleDynamicInput> & ExposeType
type eleCascadeDynamicInputRef = InstanceType<typeof EleDynamicCascadeInput> & ExposeType
type eleDynamicFormRef = InstanceType<typeof EleDynamicForm> & ExposeDyFType
type elePopupModalRef = InstanceType<typeof ElePopupModal> & ExposePopupMType
type eleZealTableSearchRef = InstanceType<typeof EleZealTableSearch> & ExposeZealTSearchType
type eleZealCardRef = InstanceType<typeof EleZealCard> & ExposeZealCardType
export * from './hooks/renderForm'
export * from './hooks/useZealTool'
export type{
    eleDynamicInputRef,
    eleCascadeDynamicInputRef,
    eleDynamicFormRef,
    elePopupModalRef,
    eleZealCardRef,
    eleZealTableSearchRef
}
export {
    EleDynamicInput, EleDynamicCascadeInput,
    EleDynamicForm, ElePopupModal,
    EleZealCard, useDecorateForm,
    EleZealTableSearch, EleZealTablePaginationControl,EleZealTable,EleZealTableBtnControl
};
