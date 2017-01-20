console.log("require('modules/services/index')");

module.exports = {
    ResourceMonitor: require('modules/services/config-loader'),
    ConfigLoader: require('modules/services/config-loader'),
    ContentLoader: require('modules/services/content-loader')
};
