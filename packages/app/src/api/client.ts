import { authExchange } from "@urql/exchange-auth";
import { cacheExchange, Client, fetchExchange } from "urql";

const getToken = async (): Promise<string | null> => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    return token;
  }

  const code = new URL(location.href).searchParams.get("code");
  if (code === null) {
    return null;
  }

  const path =
    location.pathname +
    location.search.replace(/\bcode=\w+/, "").replace(/\?$/, "");
  history.pushState({}, "", path);

  const response = await fetch(import.meta.env.PUBLIC_WORKER_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ code })
  });

  const result = await response.json();

  if (result.error) {
    return null;
  }

  localStorage.setItem("token", result.token)

  return result.token;
}

export const client = new Client({
  url: "https://api.github.com/graphql",
  exchanges: [
    cacheExchange,
    authExchange(async utils => {
      const token = await getToken();
      return {
        addAuthToOperation(operation) {
          if (!token) {
            return operation;
          }
          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${token}`
          })
        },
        didAuthError(error, operation) {
          return localStorage.getItem("token") === null;
        },
        async refreshAuth() {

        },
      }
    }),
    fetchExchange,
  ]
});
