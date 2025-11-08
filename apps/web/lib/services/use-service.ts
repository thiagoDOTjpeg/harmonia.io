import { UserSummary } from "@harmonia/shared";
import { fetchApi } from "./api";


export const userService = {
  getSummary: async (token: string): Promise<UserSummary> => {
    return fetchApi<UserSummary>('/user/dashboard', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  }
}