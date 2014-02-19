(function() {
    'use strict';

    var global = (function(){ return this || (0,eval)('this'); }());
        global.defineNs = global.defineNs || defineNamespace;

    function defineNamespace() {
        var names = [], depens = [], modules = [];

        function define(_nameStr, _depenArr, _moduleFn) {

            var args = [], module, depenName;

            for (var i = 0, len = _depenArr.length; i < len; i++) {
                depenName = _depenArr[i];
                module = modules[names.indexOf(depenName)] || global[depenName];
                if(depenName=='jquery') {
                    module = global.jQuery;
                }
                if(!module) {
                    throw new Error(depenName + ' is not defined!');
                }
                args.push(module);
            }

            names.push(_nameStr);
            depens.push(_depenArr);
            modules.push(_moduleFn.apply(global, args));
        }

        return {
            define: define,
            names: names, depens: depens, modules: modules
        };
    }
})();