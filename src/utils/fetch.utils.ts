import { handleErrorResponse } from "./error.utils";
import useUserStore from "@/stores/user.store";
import { BASE_URL } from "@/constants/network";
import { toast } from "@/hooks/use-toast";
import { RefreshTokenResponse } from "@/hooks/use-refresh-token";
interface FetchWrapperOptions {
  excludeAuthHeader: boolean;
}
export interface FetchResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
}
interface PostFormDataOptions {
  headers?: Headers;
  onUploadProgress?: (progressEvent: { loaded: number; total: number }) => void;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: Record<string, string[]>;
}

async function getAccessToken() {
  return useUserStore.getState().token;
}
export function unwrapErrors(
  errorObject: Record<string, string[]>
): { title: string; description: string }[] {
  const unwrappedErrors = [];

  for (const key in errorObject) {
    const title = key;
    const description = errorObject[key][0]; // Assuming the first element is the description

    unwrappedErrors.push({ title, description });
  }

  return unwrappedErrors;
}

export function objectToFormData(obj: any) {
  const formData = new FormData();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      formData.append(key, obj[key]);
    }
  }
  return formData;
}

export function logFormData(formData: FormData) {
  console.log("Logging formdata...");
  if (formData && formData.values()) {
    for (let value of formData.values()) {
      console.log(value);
    }
  } else {
    console.log("Formdata is undefined");
  }
}

export function objectToHeaders(obj: any) {
  const headers = new Headers();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      headers.append(key, obj[key]);
    }
  }
  console.log(headers, "updated headers");
  return headers;
}

export async function fetchGet<T>(
  url: string,
  headers: undefined | Headers = new Headers()
): Promise<T> {
  try {
    const token = getAccessToken();

    const headers_ = objectToHeaders({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
      XAT: "U",
      "X-IDT": "A",
    });

    const response = await fetch(url, {
      method: "GET",
      headers: headers_,
    });
    handleSessionExpiry(response.status);

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
// export async function axiosfetchGet<T>(
//   url: string,
//   headers?: RawAxiosRequestHeaders | AxiosHeaders
// ): Promise<T> {
//   try {
//     const response = await api.get(url, {
//       headers,
//     });
//     return await response.data;
//   } catch (error) {
//     console.error("Fetch error:", error);
//     throw error;
//   }
// }
// export async function axiosPost<T>(
//   url: string,
//   headers?: RawAxiosRequestHeaders | AxiosHeaders,
//   data?: any
// ): Promise<T> {
//   try {
//     const response = await api.post(url, data, {
//       headers: headers,
//     });
//     return await response.data;
//   } catch (error: any) {
//     handleErrorResponse(error);

//     console.error("Fetch error:", error);
//     throw error;
//   }
// }

export async function postJson<T>(
  url: string,
  dataObject: Record<string, any>,
  options: FetchWrapperOptions = {
    excludeAuthHeader: false,
  }
): Promise<FetchResponseWrapper<T>> {
  const makeRequest = async () => {
    const token = useUserStore.getState().token ?? null;
    const headers_ =
      options.excludeAuthHeader === false
        ? objectToHeaders({
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
            XAT: "U",
            "X-IDT": "A",
          })
        : new Headers({
            "content-type": "application/json",
            XAT: "U",
            "X-IDT": "A",
          });

    const body = JSON.stringify(dataObject);
    return fetch(url, {
      method: "POST",
      headers: headers_,
      body,
    });
  };

  try {
    const response = await makeRequest();
    const isSessionExpired = await handleSessionExpiry(response.status);

    if (isSessionExpired) {
      // Session expired and token refresh failed
      throw new Error("Session expired");
    }

    if (response.status === 401 || response.status === 403) {
      // Token was refreshed, retry the request with new token
      const newResponse = await makeRequest();
      return await newResponse.json();
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function deleteJson<T>(
  url: string,
  dataObject: Record<string, any>,
  options: FetchWrapperOptions = {
    excludeAuthHeader: false,
  }
): Promise<FetchResponseWrapper<T>> {
  const token = useUserStore.getState().token ?? null;
  const headers_ =
    options.excludeAuthHeader === false
      ? objectToHeaders({
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        })
      : new Headers({
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        });

  const body = JSON.stringify(dataObject);
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: headers_,
      body,
    });
    // alert(response.status);
    handleSessionExpiry(response.status);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function patchJson<T>(
  url: string,
  dataObject: Record<string, any>,
  options: FetchWrapperOptions = {
    excludeAuthHeader: false,
  }
): Promise<FetchResponseWrapper<T>> {
  const token = useUserStore.getState().token ?? null;
  const headers_ =
    options.excludeAuthHeader === false
      ? objectToHeaders({
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        })
      : new Headers({
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        });

  const body = JSON.stringify(dataObject);
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: headers_,
      body,
    });
    // alert(response.status);
    handleSessionExpiry(response.status);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function putJson<T>(
  url: string,
  dataObject: Record<string, any>,
  options: FetchWrapperOptions = {
    excludeAuthHeader: false,
  }
): Promise<FetchResponseWrapper<T>> {
  const token = useUserStore.getState().token ?? null;
  const headers_ =
    options.excludeAuthHeader === false
      ? objectToHeaders({
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        })
      : new Headers({
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        });

  const body = JSON.stringify(dataObject);
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: headers_,
      body,
    });
    // alert(response.status);
    handleSessionExpiry(response.status);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function fetchDelete<T>(
  url: string,
  headers: Headers = new Headers()
): Promise<T> {
  try {
    const token = useUserStore.getState().token ?? null;

    const headers_ = objectToHeaders({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
      XAT: "U",
      "X-IDT": "A",
    });

    console.log(headers_);
    const response = await fetch(url, {
      method: "DELETE",
      headers: headers_,
    });

    handleSessionExpiry(response.status);
    // alert(response);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function fetchPost<T>(
  url: string,
  dataObject: Record<string, any>,
  noAuthHeader = false
): Promise<T> {
  const token = useUserStore.getState().token ?? null;
  const headers_ =
    noAuthHeader === false
      ? objectToHeaders({
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        })
      : new Headers({
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        });

  const body = JSON.stringify(dataObject);
  console.log(body, "headers");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers_,

      body,
    });
    handleSessionExpiry(response.status);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function fetchJson<T>(
  url: string,
  options: FetchWrapperOptions = {
    excludeAuthHeader: false,
  }
): Promise<T> {
  const token = useUserStore.getState().token ?? null;
  const headers_ =
    options.excludeAuthHeader === false
      ? objectToHeaders({
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        })
      : new Headers();
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers_,
    });
    handleSessionExpiry(response.status);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function fetchWithFormData<T>(
  url: string,
  dataObject: Record<string, any>,
  method = "POST",
  headers: Headers = new Headers()
): Promise<T> {
  const formData = objectToFormData(dataObject);

  try {
    const response = await fetch(url, {
      method: method,
      body: formData,
      headers,
    });
    handleSessionExpiry(response.status);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function postFormData<T>(
  url: string,
  data: Record<string, any> | FormData,
  options: PostFormDataOptions = {}
): Promise<ApiResponse<T>> {
  const token = useUserStore.getState().token ?? null;

  try {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = data instanceof FormData ? data : new FormData();

      if (!(data instanceof FormData)) {
        console.log("Original data object:", data);

        Object.entries(data).forEach(([key, value]) => {
          console.log(`Processing key "${key}":`, value);

          if (value instanceof File) {
            console.log(`Appending file for "${key}":`, value);
            formData.append(key, value);
          } else if (value && typeof value === "object" && "uri" in value) {
            const fileObject = {
              uri: value.uri,
              type: value.type || "application/octet-stream",
              name: value.name || "file",
            };
            console.log(`Appending file-like object for "${key}":`, fileObject);
            formData.append(key, fileObject as any);
          } else if (Array.isArray(value)) {
            const arrayString = JSON.stringify(value);
            console.log(`Appending array for "${key}":`, arrayString);
            formData.append(key, arrayString);
          } else if (value !== null && value !== undefined) {
            console.log(`Appending value for "${key}":`, value.toString());
            formData.append(key, value.toString());
          }
        });
      }

      xhr.upload.onprogress = (event) => {
        if (options.onUploadProgress) {
          const progress = {
            loaded: event.loaded,
            total: event.total,
          };
          console.log("Upload progress:", progress);
          options.onUploadProgress(progress);
        }
      };

      xhr.onload = async () => {
        try {
          // Check for session expiry first
          const isExpired = await handleSessionExpiry(xhr.status);
          if (isExpired) {
            resolve({
              success: false,
              message: "Session expired",
              data: null,
              errors: {
                general: ["Session expired"],
              },
            });
            return;
          }

          const response = JSON.parse(xhr.responseText);
          console.log("Server response:", response);

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              success: true,
              message: response.message || "Operation successful",
              data: response.data || response,
            });
          } else {
            resolve({
              success: false,
              message: response.message || "Operation failed",
              data: null,
              errors: response.errors || {
                general: [`HTTP Error: ${xhr.status}`],
              },
            });
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          resolve({
            success: false,
            message: "Failed to parse server response",
            data: null,
            errors: {
              general: ["Invalid server response"],
            },
          });
        }
      };

      xhr.onerror = () => {
        console.error("XHR error occurred");
        resolve({
          success: false,
          message: "Network error occurred",
          data: null,
          errors: {
            general: ["Failed to connect to server"],
          },
        });
      };

      xhr.ontimeout = () => {
        console.error("XHR timeout occurred");
        resolve({
          success: false,
          message: "Request timed out",
          data: null,
          errors: {
            general: ["Server took too long to respond"],
          },
        });
      };

      xhr.open("POST", url, true);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }
      xhr.setRequestHeader("XAT", "U");
      xhr.setRequestHeader("X-IDT", "A");

      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          console.log(`Setting custom header: ${key}:`, value);
          xhr.setRequestHeader(key, value);
        });
      }

      console.log("Sending request:", {
        url,
        method: "POST",
        formData: formData,
        headers: {
          Authorization: token ? "Bearer [TOKEN]" : undefined,
          XAT: "U",
          "X-IDT": "A",
          ...options.headers,
        },
      });

      xhr.send(formData);
    });
  } catch (error) {
    console.error("Caught error in postFormData:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
      errors: {
        general: [error instanceof Error ? error.message : "Unknown error"],
      },
    };
  }
}

// Type definitions
interface PostFormDataOptions {
  headers?: Headers;
  onUploadProgress?: (progressEvent: { loaded: number; total: number }) => void;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: Record<string, string[]>;
}

export async function fetchWithParams<T>(
  url: string,
  params: { [key: string]: string | number | null | undefined },
  headersObj: { [key: string]: string } = {}
): Promise<T> {
  const filteredParams = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .reduce<{ [key: string]: string }>((acc, [key, value]) => {
      acc[key] = value as string;
      return acc;
    }, {});

  const searchParams = new URLSearchParams(filteredParams).toString();
  const fullUrl = searchParams ? `${url}?${searchParams}` : url;

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headersObj,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data from:", url, error);
    throw error;
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
};

export async function handleSessionExpiry(status: number): Promise<boolean> {
  if (status === 403 || status === 401) {
    const refreshToken = useUserStore.getState().refreshToken;

    if (!refreshToken) {
      handleLogout();
      return true;
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const response = await postJson<RefreshTokenResponse["data"]>(
          `${BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          { excludeAuthHeader: true }
        );

        if (response.success) {
          useUserStore.getState().setToken(response.data.access_token);
          useUserStore.getState().setRefreshToken(response.data.refresh_token);
          processQueue();
          return false;
        } else {
          processQueue(new Error("Failed to refresh token"));
          handleLogout();
          return true;
        }
      } catch (error) {
        processQueue(error);
        handleLogout();
        return true;
      } finally {
        isRefreshing = false;
      }
    }

    // If already refreshing, wait for it to complete
    return new Promise((resolve) => {
      failedQueue.push({
        resolve: () => resolve(false),
        reject: () => resolve(true),
      });
    });
  }
  return false;
}

function handleLogout() {
  toast({
    title: "Session expired",
    description: "Please login again",
    duration: 3000,
    variant: "default",
  });
  setTimeout(() => {
    useUserStore.getState().logout();
    window.location.href = "/login";
  }, 500);
}
