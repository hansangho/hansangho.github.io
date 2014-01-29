;(function($) {

    "use strict";

    var global = (function() {return this || (0, eval)('this');}());
    global.passwordCheck = function (_op) {
        if(!_op) return;

        var option = $.extend(true, {
            pw: '',
            pwMsg: '',
            security: '',
            pwCheck: '',
            pwCheckMsg: ''
        }, _op);

        var pw = $(option.pw),
            pwMsg = $(option.pwMsg),
            security = $(option.security),
            pwCheck = $(option.pwCheck),
            pwCheckMsg = $(option.pwCheckMsg);

        // var passwdStepIs = 0;


        pw.on('focusin', function(e) {
            if ($(this).val() == '') {
                security.hide();
            }
        });

        pw.on('focusout', function(e) {
            security.hide();
        });

        pw.on('blur', function(e) {
            security.hide();
            CheckPassword(this, pwMsg);
        });

        pw.on('keyup', function(e) {
            inputChange(e, pwCheck);
            if ($(this).val() == '') {
                security.hide();
                var ev = window.event || e.which;
                if(8 == ev.keyCode){
                    CheckPassword(this, pwMsg);
                }
            } else {
                security.show();
            }
        });

        pw.on('keypress', function(e) {
            noSpace(e);
            CapsLock(e, security);
        });

        pw.on('keydown', function(e) {
            security.show();
            if ($(this).val() == '') {
                security.hide();
            }
            validatePasswd(this, e, security.find('.grade'));
        });

        pwCheck.on('blur', function(e) {
            CheckPasswordVerify(pw.val(), $(this).val(), pwCheckMsg);
        });

        pwCheck.on('keypress', function(e) {
            noSpace(e);
        });
    }

    //-----------------------------------------------------------------------
    var numberString = "1234567890",
        lowerString = 'abcdefghijklmnopqrstuvwxyz',
        upperString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function CapsLock(e, teg) {
        var capsLock = false,
            priorCapsLock = capsLock,
            code = (e.keyCode ? e.keyCode : e.which);

        if (code >= 97 && code <= 122) {
            capsLock = e.shiftKey;
        } else if (code >= 65 && code <= 90 && !(e.shiftKey && /Mac/.test(navigator.platform))) {
            capsLock = !e.shiftKey;
        }

        if (capsLock != priorCapsLock) {
            teg.find('.capslock').show();
        } else {
            teg.find('.capslock').hide();
        }
    }

    function noSpace(e) {
        var keyCode;

        if (e.which != null) {
            keyCode = e.which;
        } else {
            keyCode = e.keyCode;
        }
        if (keyCode == 32) {
            return false;
        }
    }

    function validatePasswd(el, e, grade) {
        var event = window.event || e.which,
            keycode = event.keyCode;

        if (keycode == 32 || keycode == 16 || keycode == 18) {
            event.returnValue = false;
            return false;
        }

        setTimeout(function() {
            if (el.value) {
                if (el.value.match(/\s+/g)) {
                    el.value = el.value.replace(/\s+/g, '');
                }

                var pw = el.value,
                    len = pw.length, 
                    lenPoint = GetLengthPoint(pw), 
                    crossPoint = GetCrossPoint(pw), 
                    seqPoint = GetSequencePoint(pw), 
                    sum = lenPoint + seqPoint + crossPoint, 
                    fixSum;

                if (lenPoint + crossPoint >= 2 && sum < 2) {
                    fixSum = 2;
                } else {
                    fixSum = sum;
                }

                viewPasswdStep(fixSum, grade);
            }
        }, 10);
    }

    function GetLengthPoint(value) {
        var point = -999,
            len = value.length;

        if (len >= 15) point = 2;
        else if (len >= 12) point = 1;
        else if (len >= 8) point = 0;

        return point;
    }

    function GetCrossPoint(value) {
        var count = 0,
            beforeStatus = 0; //0:none, 1:num, 2:lower, 3:upper, 4:special
        for (var i = 0; i < value.length; i++) {
            var ch = value.charAt(i),
                chCharCode = ch.charCodeAt(0),
                currentStatus;

            if (chCharCode >= 48 && chCharCode <= 57) currentStatus = 1;
            else if (chCharCode >= 97 && chCharCode <= 122) currentStatus = 2;
            else if (chCharCode >= 65 && chCharCode <= 90) currentStatus = 3;
            else currentStatus = 4;

            if (beforeStatus != currentStatus) count++;
            beforeStatus = currentStatus;
        }
        if (count == 1) return -999;
        return count;
    }

    function GetSequencePoint(value) {
        return GetOrderPoint(value) + GetSameCharsPoint(value);
    }

    function GetOrderPoint(value) {
        var point = 0,
            existOrderMatchPossible;

        for (var i = 0; i < value.length - 3; i++) {
            //reg 구문을 깨뜨리는 '(' 및 ')' 문자를 제외하기 위해 숫자/대문자/소문자인 경우만 검사하도록 함 (match 함수 오류)
            if (IsSpecialChar(value.charAt(i)) || IsSpecialChar(value.charAt(i + 1)) || IsSpecialChar(value.charAt(i + 2)) || IsSpecialChar(value.charAt(i + 3))) {
                existOrderMatchPossible = false;
            } else {
                existOrderMatchPossible = true;
            }

            if (existOrderMatchPossible) {
                if (numberString.match(value.slice(i, i + 4)) || lowerString.match(value.slice(i, i + 4)) || upperString.match(value.slice(i, i + 4))) {
                    point--;
                }
            }
        }
        return point;
    }

    function IsSpecialChar(ch) {
        if ((ch.charCodeAt(0) >= 33 && ch.charCodeAt(0) <= 47) || (ch.charCodeAt(0) >= 58 && ch.charCodeAt(0) <= 64) || (ch.charCodeAt(0) >= 91 && ch.charCodeAt(0) <= 96) || (ch.charCodeAt(0) >= 123 && ch.charCodeAt(0) <= 126)) {
            return true;
        } else {
            return false;
        }
    }

    function IsNumericChar(ch) {
        if (48 <= ch.charCodeAt(0) && ch.charCodeAt(0) <= 57) {
            return true;
        } else {
            return false;
        }
    }

    function GetSameCharsPoint(value) {
        var count = 1,
            point = 0,
            beforeChar = "";

        for (var i = 0; i < value.length; i++) {
            var ch = value.charAt(i);

            if (beforeChar == ch) {
                count++;

                if (count >= 4) {
                    point--;
                }
            } else {
                count = 1;
            }

            beforeChar = ch;
        }
        return point;
    }

    // 비밀번호 보안 수준
    var passwdStepIs = 0;

    function viewPasswdStep(fixSum, grade) {
        if (fixSum <= 1) {
            passwdStepIs = 0;
        } else if (fixSum == 2) {
            passwdStepIs = 1;
        } else if (fixSum <= 4) {
            passwdStepIs = 2;
        } else if (fixSum <= 7) {
            passwdStepIs = 3;
        } else {
            passwdStepIs = 4;
        }

        grade.text(msgTemplate.grade[passwdStepIs]);
        grade.removeClass('grade0 grade1 grade2 grade3 grade4');
        grade.addClass('grade' + passwdStepIs);
    }

    function inputChange(e, pwCheck) {
        pwCheck.attr('value', '');

        if (passwdStepIs <= 0) {
            pwCheck.removeClass('on');
            pwCheck.attr("disabled", true);
        } else {
            pwCheck.addClass('on');
            pwCheck.attr("disabled", false);
        }
    }

    function CheckPassword(obj, pwMsg) {
        var password = obj.value,
            massage = '',
            classStr = 'msg_error',
            valid = false;

        if (password.length == 0) {
            massage = msgTemplate.pwMsg[0];
        } else if (password.length < 8) {
            massage = msgTemplate.pwMsg[2] + "(" + password.length + "자)";
        } else if (password == $("txtAccount").value) {
            massage = msgTemplate.pwMsg[3];
        } else if ((!IsAlphabetIncluded(password) && !IsNumOrSpecialIncluded(password)) || passwdStepIs == '') {
            massage = msgTemplate.pwMsg[4];
        } else if ((password.indexOf(">") > -1) || (password.indexOf("<") > -1) || (password.indexOf("&") > -1)) {
            massage = msgTemplate.pwMsg[5];
        } else{ 
            valid = true;
        }

        if (valid) {
            massage = msgTemplate.okMsg[passwdStepIs-1];
            classStr = 'msg_safety';
        }

        pwMsg.removeClass('msg msg_error msg_safety');
        pwMsg.addClass(classStr);
        pwMsg.text( massage );
    }

    function IsAlphabetIncluded(str) {
        var flag = false;
        for (var i = 0; i < str.length; i++) {
            flag = (('A' <= str.charAt(i) && str.charAt(i) <= 'Z') || ('a' <= str.charAt(i) && str.charAt(i) <= 'z'));
        }
        return flag;
    }

    function IsNumOrSpecialIncluded(str) {
        var flag = false;
        for (var i = 0; i < str.length; i++) {
            flag = (!(('A' <= str.charAt(i) && str.charAt(i) <= 'Z') || ('a' <= str.charAt(i) && str.charAt(i) <= 'z')));
        }
        return flag;
    }

    function CheckPasswordVerify(pw1, pw2, msg) {
        msg.removeClass('msg_error msg_safety');
        if (pw2.length == 0) {
            msg.text(msgTemplate.check[0]);
            msg.addClass('msg_error');
        } else {
            if (pw1 == pw2) {
                msg.addClass('msg_safety');
                msg.text(msgTemplate.check[1]);
            } else {
                msg.addClass('msg_error');
                msg.text(msgTemplate.check[2]);
            }
        }
    }

    var msgTemplate = {
        grade:[ '보안 수준 : 사용불가',
                '보안 수준 : 낮음',
                '보안 수준 : 보통',
                '보안 수준 : 좋음',
                '보안 수준 : 매우좋음'],

        pwMsg:[ '비밀번호를 입력하세요.',
                '8~16자의 영문, 숫자, 특수문자의 조합만 사용 가능합니다.',
                '비밀번호는 8자 이상이어야 합니다.',
                '사용할 수 없는 비밀번호 입니다.',
                '영문에 숫자 또는 특수문자를 함께 입력하세요.',
                '<, >, & 는 사용하실 수 없습니다.'],

        okMsg: ['보안 1단계 : 사용 가능하지만, 보안에 취약한 비밀번호입니다.',
                '보안 2단계 : 적정한 보안수준 비밀번호입니다.',
                '보안 3단계 : 안전한 비밀번호입니다.',
                '보안 4단계 : 매우 안전한 비밀번호입니다.'],

        check: ["비밀번호를 한번 더 입력해 주세요.",
                "비밀번호가 일치합니다. 꼭 기억해 두세요.",
                "비밀번호가 일치하지 않습니다. 다시 입력해 주세요."]
    };


}(jQuery));

            