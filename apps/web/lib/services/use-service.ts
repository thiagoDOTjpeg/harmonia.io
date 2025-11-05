import { UserDashboardResponse } from "../types/user";
import { fetchApi } from "./api";


export const userService = {
  getDashboardSummary: async (token: string): Promise<UserDashboardResponse> => {
    return fetchApi<UserDashboardResponse>('/user/dashboard', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  }
}