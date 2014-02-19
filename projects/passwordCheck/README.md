## **passwordCheck.js Project**

### INTRO
비밀번호 변경시 비밀번호 유효성 체크
자세한 사용법은 샘플 페이지 참고
[sample][samplepage1]

### USEAGE
``` javascript

// jQuery, passwordCheck.js 추가
<script language="javascript" type="text/javascript" src="http://static.plaync.co.kr/common/js/lib/jquery_171_min.js"></script>
<script language="javascript" type="text/javascript" src="passwordCheck.js"></script>

var pwc = new passwordCheck({
    pw: '#newPW',
    pwMsg: '#newPWMsg',
    security: '#securityLayer',
    pwCheck: '#newPWCheck',
    pwCheckMsg: '#newPWCheckMsg'
});

```


[samplepage1]: http://plat-lego.korea.ncsoft.corp/!/hansangho/passwordcheck-js/passwordCheck.html