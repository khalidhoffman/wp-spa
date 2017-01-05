var $ = require('jquery'),

    ToolTipster = require('tooltipster'),

    SelectElement = require('./views/select'),
    DemoView = require('./views/demo'),
    FeedbackView = require('./views/feedback'),
    SettingsController = require('./controllers/settings-controller'),

    settingsController = new SettingsController({
        onKeyframesLoaded: function () {
            var $demo = $('.wpspa-demo').wpspaDemo(),
                $listItems = $('#wp-spa select').fillSelectOptions(settingsController.getKeyFrames()),
                $feedback = $('#wp-spa .feedback').wpspaFeedback(),
                $inputs = $('#wp-spa [data-description]');

            $inputs.each(function(index, el){
                var $input = $(el),
                    $inputLabels = $input.parents('td').tooltipster({
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