import * as renderers from "./renderForm"
import {createUseDecorateForm} from "../../hooks/useDyForm";

export const useDecorateForm = createUseDecorateForm(renderers)