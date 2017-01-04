var $ = require('jquery'),

    ToolTipster = require('tooltipster'),

    SelectElement = require('./views/select'),
    SettingsController = require('./controllers/settings-controller'),

    settingsController = new SettingsController({
        onKeyframesLoaded: function () {
            var $listItems = $('#wp-spa select').fillSelectOptions(settingsController.getKeyFrames()),
                $inputs = $('#wp-spa [data-description]');

            $inputs.each(function(index, el){
                var $input = $(el),
                    $inputLabel = $input.parents('td').tooltipster({
                        content: $input.data('description')
                    })
            })
        }
    });

module.exports = {
    controllers: (function () {
        return {
            settings: settingsController
        }
    })()
};