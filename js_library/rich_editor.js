/**
 * date:2013-05-03
 * explanation:编辑器
 */

;;;(function(window, document){
	if(!window.editor){
		window.editor = {}
	}


})(window, document);

var addEvent = function(node, type, listener){
	if(node.addEventListener){
		node.addEventListener(type, listener, false);
		return true;
	} else if(node.attachEvent) {
		node.attachEvent('on' + type, listener);
		return true;
	} else {
		node['on' + type] = listener;
	}
	return false;
}
var removeEvent = function(node, type, listener){
	if(node.removeEventListener){
		node.removeEventListener(type, listener, false);
		return true;
	} else if(node.detachEvent){
		node.detachEvent('on' + type, listener);
		return true;
	} else {
		node['on' + type] = null;
		return true;
	}
	return false;
}

window.onload = function(){
	// 先隐藏textarea，并创建iframe
	var textarea = document.getElementById('J_editor_textarea');
	textarea.style.display = 'none';
	var iframe = document.createElement('iframe');
	iframe.style.width = '98%';
	iframe.style.height = '200px';
	iframe.style.border = '1px solid #999999';
	iframe.frameBorder = 0;
	textarea.parentNode.insertBefore(iframe, textarea);
	var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
	iframeDocument.designMode = 'on';
	iframeDocument.open();
	iframeDocument.write('<!DOCTYPE html><html><head></head><body style="background-color:#ffffff;"> </body></html>');
	iframeDocument.close();


	// 获取相应的按钮，并绑定相应的click和change事件
	var editor = document.getElementById('J_editor_toolbar');
	var buttons = editor.getElementsByTagName('span');
	var selects = editor.getElementsByTagName('select');
	for(var i = 0, l = buttons.length; i < l; i++){
		buttons[i].onclick = new function(){
			var button = buttons[i];
			var command = button.getAttribute('title');
			return function(){

				if(command == 'createlink' || command == 'insertimage'){
					var value = prompt('请输入超链接:', 'http://');
					iframeDocument.execCommand(command, false, value);
				} else {
					iframeDocument.execCommand(command);
				}
				// 在页面上显示出当前调用了哪个命令
				document.getElementById('J_editor_result').innerHTML = '这里是显示操作结果：调用了' + button.getAttribute('title') + '命令';
			}
		}
	};
	for(var i = 0, l = selects.length; i < l; i++){
		selects[i].onchange = new function(){
			var select = selects[i];
			return function(){
				var command = select.getAttribute('title');
				var value = select.options[select.selectedIndex].value;
				// Firefox的backcolor是针对文档的body元素的，要想和IE一致，需要用到hilitecolor
				if(command == 'backcolor' && /a/[-1] == 'a'){
					iframeDocument.execCommand('hilitecolor', false, value);
				} else {
					iframeDocument.execCommand(command, false, value);
				}

				// 在页面上显示出当前调用了哪个命令
				document.getElementById('J_editor_result').innerHTML = '这里显示操作结果：调用了' + select.getAttribute('title') + '命令，并传入了' + select.options[select.selectedIndex].value + '参数';
			}
		}
	}

	// 当iframe失去焦点的时候，获取iframe的内容，并把它塞到textarea当中
	var deliver = function(iframe){
		addEvent(iframe.contentWindow, 'blur', function(){
			var tips = document.getElementById('J_editor_result');
			iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
			tips.innerHTML = '失去焦点，并取得iframe的内容为：' + iframeDocument.body.innerHTML;
			tips.style.backgroundColor = '#fafafa';
		});
	}
	deliver(iframe);
}