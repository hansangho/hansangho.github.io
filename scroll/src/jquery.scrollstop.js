

<SCRIPT language='javascript'>
alert('세션 지연시간에 의해 로그아웃 되었습니다. 다시 로그인 해 주십시오.');
if(opener==undefined)
	top.location.href = '/Login.do';
else {
   this.close();
	opener.top.location.href = '/Login.do';
}
</SCRIPT>
