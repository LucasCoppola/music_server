interface ClientOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: { contentType?: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

export function useClient<T>() {
  return async (
    url: string,
    authToken: string | undefined | null,
    options: ClientOptions,
  ): Promise<T> => {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(url, {
      method: options.method,
      headers: {
        ...(options.headers?.contentType
          ? { "Content-Type": options.headers?.contentType }
          : {}),
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
      body: isFormData
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined,
    });

    if (!response.ok) {
      const data = await response.json();
      throw data;
    }

    return await response.json();
  };
}
