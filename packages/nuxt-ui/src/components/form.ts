import { inject, provide, type InjectionKey } from "vue"

export interface FormItemContextValue {
  id: string
}

const FormItemKey: InjectionKey<FormItemContextValue> = Symbol("FormItem")

export function provideFormItem(value: FormItemContextValue) {
  provide(FormItemKey, value)
}

export function useFormItem(): FormItemContextValue {
  const ctx = inject(FormItemKey)
  if (!ctx) throw new Error("useFormItem should be used within <FormItem>")
  return ctx
}

export function formItemIds(id: string) {
  return {
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  }
}
