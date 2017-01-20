var $ = require('jquery');

$.fn.conditional = function (options) {
    var $conditionals = this;

    $conditionals.each(function (index, el) {
        var $el = $(el),
            depsString = $el.attr('data-conditionals'),
            deps = depsString.split(','),
            $deps = deps.map(function(dep){
                return $(dep);
            }),
            depsCount = deps.length,
            depIdx;

        function update(val){
            var isSatisfied = true;
            debugger;
            $deps.forEach(function($dep){
                if (!$dep[0].checked){
                   isSatisfied = false;
                }
            })
            if(isSatisfied){
                $el.addClass('conditional--active');
            } else {
                $el.removeClass('conditional--active');
            }
        }

        update();
        $(depsString).on('change', function(evt){
            update();
        })
    })
};
