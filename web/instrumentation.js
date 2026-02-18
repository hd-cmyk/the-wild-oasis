export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const globalAgent = require("global-agent");

    // Bootstrap global-agent with explicit proxy configuration
    globalAgent.bootstrap();

    // Set undici global dispatcher for fetch API
    if (process.env.GLOBAL_AGENT_HTTP_PROXY) {
      const { ProxyAgent, setGlobalDispatcher } = require("undici");
      const proxyAgent = new ProxyAgent(process.env.GLOBAL_AGENT_HTTP_PROXY);
      setGlobalDispatcher(proxyAgent);
    }
  }
}
