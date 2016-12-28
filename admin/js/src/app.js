var $ = require('jquery'),

  SelectElement = require('./views/select'),

  SettingsController = require('./controllers/settings-controller'),

  settingsController = new SettingsController({
    onKeyframesLoaded: function () {
      var $listItems = $('#wp-spa select').fillSelectOptions(settingsController.getKeyFrames());
    }
  });

module.exports = {
  controllers: (function () {
    return {
      settings: settingsController
    }
  })()
};