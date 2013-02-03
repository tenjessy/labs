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

	for (var i = 0, l = buttons.length; i < l; i++) {
		buttons[i].onclick = new function(){
			var button = buttons[i];
			return function(){
				document.getElementById('J_editor_result').innerHTML = '调用了' + button.getAttribute('title') + '命令';
			}
		}
	};

	for (var i = 0, l = selects.length; i < l; i++) {
		selects[i].onchange = new function(){
			var select = selects[i];
			return function(){
				document.getElementById('J_editor_result').innerHTML = '调用了' + select.getAttribute('title') + '命令，并传入了' + select.options[select.selectedIndex].value + '参数';
			}
		}
	};
}