const FRONTEND_NAME = "frontend";
const BACKEND_NAME = "backend";

const getDomain = () => window.location.hostname.split(FRONTEND_NAME);
const getProtocol = () => window.location.protocol;

const getBackend = () => getProtocol() + "//" + BACKEND_NAME + getDomain();

export const config = {
  baseURL: "http://backend.domain.com" //getBackend()
};
