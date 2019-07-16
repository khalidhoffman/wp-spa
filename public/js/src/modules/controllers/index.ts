console.log("require('modules/controllers/index')");

module.exports = {
    Main: require('modules/controllers/main-controller'),
    UI: require('modules/controllers/ui-controller')
};

export * from './main-controller';
export * from './ui-controller'