/**
 * date:2013-02-03;
 * explanation:在线编辑器;
 * version:v1.0
 * author:jessy@mfhui.com
 */

;;;(function(){
	if(!window.MFH){
		window['MFH'] = {}
	}

	var editor = {

	}
	window['MFH']['editor'] = editor;
})();

window.onload = function(){
	var editor = document.getElementById('editor_toolbar');
	var buttons = editor.getElementsByTagName('span');
	var selects = editor.getElementsByTagName('select');
	// var workaround = document.getElementById('editor_textarea_wrap');
	// workaround.contentEditable = true;

	var textarea = document.getElementById('editor_textarea');
	textarea.style.display = 'none';

	var iframe = document.createElement('iframe');
	iframe.style.width = '100%';
	iframe.style.height = '100px'
	iframe.frameBorder = '0';
	textarea.parentNode.insertBefore(iframe, textarea);

	var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
	iframeDocument.designMode = 'on';
	iframeDocument.open();
	iframeDocument.write('<html><head></head><body style="margin:0px; padding:0px; background-color:#fafafa; font-size:12px; line-height:1.75;"></body></html>');
	iframeDocument.close();

	for (var i = 0, l = buttons.length; i < l; i++) {
		buttons[i].onclick = new function(){
			var button = buttons[i];
			var command = buttons[i].getAttribute('title');
			return function(){
				if(command == 'createlink' || command == 'insertimage'){
					var value = prompt('请输入超链接：', 'http://');
					iframeDocument.execCommand(command, false, value);
				} else {
					iframeDocument.execCommand(command);
				}
				document.getElementById('J_editor_result').innerHTML = '调用了' + button.getAttribute('title') + '命令';
				// document.selection.createRange().execCommand(command);	// only for IE
			}
		}
	};

	for (var i = 0, l = selects.length; i < l; i++) {
		selects[i].onchange = new function(){
			var select = selects[i];
			return function(){
				var command = select.getAttribute('title');
				var value = select.options[select.selectedIndex].value;
				// 利用 /a/[-1] == 'a' 嗅探浏览器是否为FF
				if(command == 'backcolor' && /a/[-1] == 'a'){
					iframeDocument.execCommand('hilitecolor', false, value);
				} else {
					iframeDocument.execCommand(command, false, value);
				}
				document.getElementById('J_editor_result').innerHTML = '调用了' + select.getAttribute('title') + '命令，并传入了' + select.options[select.selectedIndex].value + '参数';
				// document.selection.createRange().execCommand(command, false, value); // only for IE
			}
		}
	};

	// 获取选中的文字
	var getRangeObject = function(){
		// W3C
		if(window.getSelection) {
			var range = document.createRange();
			var selection = window.getSelection();
			range.setStart(selection.anchorNode, selection.anchorOffset);
			range.setEnd(selection.focusNode, selection.focusOffset);
			return range;
		}
		// only for IE
		else {
			return document.selection.createRange();
		}
	}
}