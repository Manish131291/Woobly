import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { SessionStorage } from "../core-utils/async-storage.util";
import { handleError } from "../core-utils/error-bucketing.util";
import { ServerError } from "./models/server-error.model";

const { REACT_APP_IV } = process.env;

const defaultConfig = {
  headers: {
    Accept: "application/json",
  },
};

const checkAvailUrl = (list: string[], str): boolean => {
  return list.some((item) => item === str.match(item?.trim())?.[0]);
};

const { REACT_APP_STRAPI_URL, REACT_APP_TYPE, REACT_APP_RESPONSE_TIMEOUT } =
  process.env;
export const instance = axios.create(defaultConfig);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response.status === 401 &&
      SessionStorage.getItem("accessToken")
    ) {
      SessionStorage.clear();
      localStorage.clear();
      window.location.href = "/";
    } else {
      return Promise.reject(error);
    }
  }
);

async function post(
  url: string,
  params: any,
  source: CancelTokenSource,
  headers?: object | any,
  config?: object,
  value?: string
) {
  const deviceId: string = SessionStorage.getItem("browser_id") as string;
  const encryptedList = JSON.parse(
    SessionStorage.getItem("encryptedUrl") ?? "[]"
  );
  const timer = setTimeout(() => {
    source.cancel();
  }, (REACT_APP_RESPONSE_TIMEOUT as any) * 1000);
  const response = await instance.post(`${url}`, params, {
    cancelToken: source.token,
    headers: {
      ...headers,
      channel: "WEB",
    },
    ...config,
  });
  clearTimeout(timer);

  const isEncryption =
    encryptedList?.length > 0 && checkAvailUrl(encryptedList, url);
  return response;
}

async function get(
  url: string,
  source: CancelTokenSource,
  headers?: object | any
) {
  const timer = setTimeout(() => {
    source.cancel();
  }, (REACT_APP_RESPONSE_TIMEOUT as any) * 1000);

  const response = await instance.get(url, {
    cancelToken: source.token,
    headers: {
      ...headers,
    },
  });
  clearTimeout(timer);
  return response;
}

export async function send(
  params: {
    baseurl: string;
    method: string;
    url: string;
    obj?: FormData | object | string;
    reqToken?: CancelTokenSource;
  },
  headers?: object,
  config?: object
): Promise<any> {
  let Url;
  let Params;

  if (!params || typeof params !== "object") {
    throw new Error("params is undefined or not an object");
  }
  try {
    const cancelToken = params.reqToken ?? axios.CancelToken.source();
    const encryptedList = JSON.parse(
      SessionStorage.getItem("encryptedUrl") ?? "[]"
    );
    if (params.method === "POST") {
      Url = params.baseurl + params.url;
      const isMultipart: boolean =
        headers?.["Content-Type"] === "multipart/form-data";
      const isEncryption =
        encryptedList?.length > 0 && checkAvailUrl(encryptedList, Url);

      Params = params.obj;

      return await post(Url, Params, cancelToken, headers, config);
    } else {
      Url = params.baseurl + params.url;
      const strapiAuthKey = JSON.parse(
        SessionStorage.getItem("strapiAuth") ?? "{}"
      );

      if (Url?.includes(REACT_APP_STRAPI_URL) && strapiAuthKey) {
        headers = {
          ...headers,
          strapiauth: strapiAuthKey,
        };
      }

      return await get(Url, cancelToken, headers);
    }
  } catch (err: any) {
    let errData;
    if (err.code === "ERR_CANCELED" || err.code === "ERR_NETWORK") {
      errData = {
        error: {
          errorCode: err.code,
        },
      };
    } else {
      errData = err?.response?.data;
    }
    const error = handleError(errData);

    throw new ServerError(error);
  }
}
