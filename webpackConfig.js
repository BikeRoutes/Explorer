module.exports = (config, { NODE_ENV }) => {
  if (NODE_ENV === "production") {
    return {
      ...config,
      output: {
        ...config.output,
        publicPath: "/Explorer/"
      }
    };
  } else {
    return config;
  }
};
