import qs from "qs"

export class BusinessError {
  message: string
  code: string
  constructor(err: { message: string; code: string }) {
    this.message = err.message
    this.code = err.code
  }
}

export class ServerError {}
export class UrlNotFound {}
export class UnAuthorizedError {} // 未登录
export class InsufficientAuthority {} // 权限不足

export const errorHandler = async (response: Response) => {
  if (response.status === 401) {
    throw new UnAuthorizedError()
  } else if (response.status === 403) {
    throw new InsufficientAuthority()
  } else if (response.status === 404) {
    throw new UrlNotFound()
  } else if (response.status >= 400 && response.status < 500) {
    const error = await response.json()
    throw new BusinessError({ code: error.code, message: error.message })
  } else if (response.status >= 500) {
    throw new ServerError()
  } else {
    throw response
  }
}

export const jsonResponseHandler = async <T>(response: Response) => {
  if (response.status === 200) {
    try {
      const json: Promise<T> = await response.json()
      return json
    } catch (error) {
      throw error
    }
  }

  return errorHandler(response)
}

export const get = async (url: string, query: Record<string, any>) => {
  const q = qs.stringify(query)
  const response = await fetch(url + `${q ? "?" + q : ""}`, {
    method: "GET",
  })

  return response
}
