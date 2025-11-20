import DynamicForm from "./components/DynamicForm";
export { DynamicForm }

export default {
    install(app:any) {
        app.component('DyDynamicForm', DynamicForm)
    }
}
