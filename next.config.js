/** @type {import('next').NextConfig} */
module.exports = {
    // othor next config here...
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production' ? true : false,
    },
    webpack: config => {
      config.plugins.push(new VeliteWebpackPlugin())
      return config
    }
  };
