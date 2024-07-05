import { notification } from "antd"

import {
  BusinessError,
  InsufficientAuthority,
  ServerError,
  UnAuthorizedError,
  UrlNotFound,
} from "./methods"

const withErrorHandler = async <T>(fn: () => Promise<T>) => {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof BusinessError) {
      notification.error({
        message: "Exceptions",
        description: error.message,
      })
    } else if (error instanceof UrlNotFound) {
      notification.error({
        message: "Error",
        description: "api url not found",
      })
    } else if (error instanceof ServerError) {
      notification.error({
        message: "Error",
        description: "server error",
      })
    } else if (error instanceof UnAuthorizedError) {
      // window.location.href = `/login`
    } else if (error instanceof InsufficientAuthority) {
      notification.error({
        message: "Error",
        description: "InsufficientAuthority",
      })
    } else if (typeof error === "string") {
      notification.error({
        message: "Error",
        description: error,
      })
    }

    throw error
  }
}

export default withErrorHandler
