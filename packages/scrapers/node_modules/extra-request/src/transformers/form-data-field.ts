import { FormData } from 'extra-fetch'
import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import { isArray } from '@blackglory/prelude'

export function formDataField(
  name: string
, value: string | string[] | Blob
): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    const formData = options.payload instanceof FormData
      ? cloneFormData(options.payload)
      : new FormData()

    if (isArray(value)) {
      value.forEach(x => formData.append(name, x))
    } else {
      formData.append(name, value)
    }

    return {
      ...options
    , payload: formData
    }
  }
}

function cloneFormData(formData: FormData): FormData{
  const result = new FormData()
  for (const [name, value] of formData.entries()) {
    result.append(name, value)
  }
  return result
}
