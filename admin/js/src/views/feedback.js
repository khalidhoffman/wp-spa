var $ = require('jquery');

$.fn.wpspaFeedback = function (options) {
    var $feedback = this,
        $input = $feedback.find('textarea'),
        $submit = $feedback.find('.button--send');

    $submit.on('click', function () {
        $submit.prop('disabled', true);
        $.ajax({
            url: window.ajaxurl, // provided by WordPress
            method: "POST",
            crossDomain: true,
            data: {
                action: 'wp_spa', // WordPress requirement
                wpspa: 'email',
                data: {
                    contact: "wp-spa user",
                    message: $input.val(),
                    date: (new Date()).toISOString()
                }
            },
            complete: function (response) {
                $submit.prop('disabled', false);
                console.log('feedback response: %o', arguments);
                alert('Thank you for your feedback!');
                $input.val('');
            }
        })
    })
};