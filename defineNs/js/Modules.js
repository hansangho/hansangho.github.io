
var utils = {
    testUtil: function (_str) {
        return _str + ' call testUtil';
    }
}

var myPrj = new defineNs();

myPrj.define('aModule', [], function () {
    'use strict';

    function hellow (_str) {
        return 'A say hi~' + _str;
    }

    return {
        hellow: hellow
    }
});

myPrj.define('bModule', ['aModule'], function (am) {
    'use strict';

    function start () {
        console.log( 'myPrj - i am B!' );
        console.log( 'myPrj - B call A:', am.hellow('B') );
    }

    return {
        start: start
    }
});

myPrj.define('cModule', ['aModule', 'bModule', 'utils'], function ( am, bm, ut ) {
    'use strict';

    console.log( 'myPrj - i am C!', this );
    console.log( 'myPrj - C call A:', am.hellow('C') );
    bm.start();
    console.log( ut.testUtil('C') );
    console.log( myPrj );

    return {
    }
});
