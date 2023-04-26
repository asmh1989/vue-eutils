export const APISettings = {
  token: "",
  headers: new Headers({
    Accept: "application/json",
  }),
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://192.168.2.212:4321"
      : "http://192.168.2.27:4321",
};
