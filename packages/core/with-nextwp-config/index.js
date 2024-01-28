const { compileConfig } = require("./compiler");

function withNextWp(nextConfig = {}) {
  if (process.env.NODE_ENV === "development") {
    const { watchConfig } = require("./watcher");
    watchConfig();
  }

  return {
    ...nextConfig,
    webpack: (config, options) => {
      if (typeof nextConfig.webpack === "function") {
        config = nextConfig.webpack(config, options);
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
