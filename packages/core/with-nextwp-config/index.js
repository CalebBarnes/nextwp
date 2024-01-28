const { compileConfig } = require("./compiler");

function withNextWp(nextConfig = {}) {
  const { nextwp, ...restConfig } = nextConfig;
  if (process.env.NODE_ENV === "development") {
    const { watchConfig } = require("./watcher");
    watchConfig();
  }
  return {
    ...restConfig,
    webpack: (config, options) => {
      if (typeof restConfig.webpack === "function") {
        config = restConfig.webpack(config, options);
      }
      config.plugins.push(
        new options.webpack.NormalModuleReplacementPlugin(
          /^nextwp-config$/,
          (resource) => {
            resource.request = compileConfig();
          }
        )
      );

      return config;
    },
  };
}

module.exports = withNextWp;
