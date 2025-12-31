import * as renderers from "./renderForm"
import {createUseDecorateForm} from "../../hooks/useDyForm.ts";

export const useDecorateForm = createUseDecorateForm(renderers)
