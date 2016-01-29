define(['text!modules/config.json', 'text!modules/views.json', 'namespace'], function (configJSON, viewsJSON, NS) {

    var sassConfig = JSON.parse(configJSON);

    NS.config = {
        breakpoints: {
            mobile: sassConfig.mobile || 768,
            tablet: sassConfig.tablet || 1024
        },
        header: {
            height: {
                default: sassConfig.headerBaseHeight || 144,
                mobile: sassConfig.headerMobileBaseHeight || 144
            }
        }
    };

    return NS.config;
});