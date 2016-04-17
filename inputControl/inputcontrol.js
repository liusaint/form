/**
* author:ls
* email:liusaint@gmail.com
* date:2015年
*/

//ie8及以下不支持map函数。这里是做的处理。
if (!Array.prototype.map) {
	Array.prototype.map = function(callback, thisArg) {
		var T, A, k;
		if (this == null) {
			throw new TypeError(" this is null or not defined");
		}
		var O = Object(this);
		var len = O.length >>> 0;
		if (typeof callback !== "function") {
			throw new TypeError(callback + " is not a function");
		}
		if (thisArg) {
			T = thisArg;
		}
		A = new Array(len);
		k = 0;
		while(k < len) {
			var kValue, mappedValue;
			if (k in O) {
				kValue = O[ k ];
				mappedValue = callback.call(T, kValue, k, O);
				A[ k ] = mappedValue;
			}

			k++;
		}
		return A;
	};
}

//检测游标位置，来自网络。
function getLocation(elm) {  
	if(elm.createTextRange) { // IE               
		var range = document.selection.createRange();                 
		range.setEndPoint('StartToStart', elm.createTextRange());                 
		return range.text.length;  
	} else if(typeof elm.selectionStart == 'number') { // Firefox  
		return elm.selectionStart;  
	}  
}
    	
//设置游标位置。
function setLocation(elm, n) {  
	if(n > elm.value.length)  
		n = elm.value.length;  
	if(elm.createTextRange) {   // IE  
		var textRange = elm.createTextRange();  
		textRange.moveStart('character', n);              
		textRange.collapse();         
		textRange.select();       
	} else if(elm.setSelectionRange) { // Firefox  
		elm.setSelectionRange(n, n);  
		elm.focus();  
	}  
}
//替换字符串某一位的值。
function replaceChat(source,pos,newChar){  
	if(pos<0||pos>=source.length||source.length==0){  
		return ;  
	}  
	var iBeginPos= 0, iEndPos=source.length;  
	var sFrontPart=source.substr(iBeginPos,pos);  
	var sTailPart=source.substr(pos+1,source.length);  
	var sRet=sFrontPart+newChar+sTailPart;  
	return sRet;  
}

//简单判断内容是不是在数组中
function inArray(str,arr){
	for (var key in arr){
		if(arr[key] == str){
			return true;
		}
	}
	return false;
}

//上面的都是一些辅助函数。下面是正题

//输入控件。keydown触发,重写各个按键的反应。比如删除键，一次只删除一个。
//中文输入法keydown事件不是很友好，输入标点的时候会有问题。已做了处理。
function inputControl(e,fixedCharIndex,ORIVALUE,inputDom){

	var preVal = inputDom.value;//上一个值。
	var index = getLocation(inputDom);//索引
	var isie = (document.all) ? true : false;

	if(isie){
		var theKeyCode = window.event.keyCode;
	}else{
		var theKeyCode = e.keyCode;
	}

	//删除键的处理，重写删除。对删除键，不禁止连续按。		
	if(theKeyCode == 8){
		if(inArray(index,fixedCharIndex)||index == 0){
			setLocation(inputDom,index -1);
			if(isie){
				window.event.returnValue = false;
			}else{
				e.preventDefault();
			}
			return false;
		}else{
			index = getLocation(inputDom);
			var newVal = inputDom.value;
			var theVal1 =  replaceChat(newVal,index-1,ORIVALUE.charAt(index-1));//这个0还没有通用化。
			inputDom.value = theVal1;
			setLocation(inputDom,index-1);
			if(isie){
				window.event.returnValue = false;
			}else{
				e.preventDefault();
			}
			return false;
		}

	}else if(theKeyCode == 37 || theKeyCode == 39){//左移动键 右移动键
		return;
	}else if((theKeyCode>=96 && theKeyCode <=105) || (theKeyCode >=48 && theKeyCode<=57)){//数字0-9的键码
		if(index > ORIVALUE.length-1){
			if(isie){
				window.event.returnValue = false;
			}else{
				e.preventDefault();
			}
			return false;
		}

		var fixedCharIndexleft = fixedCharIndex.map(function(num){return num - 1;});
		if(inArray(index,fixedCharIndexleft)){
			index = index+1;
			setLocation(inputDom,index);
		}
		if(index == ORIVALUE.length){//如果到了最后一位，就不进行替换操作了。
			if(isie){
				window.event.returnValue = false;
			}else{
				e.preventDefault();
			}
			return false;
		}

		var theVal =  replaceChat(preVal,index,'');//先删除当前位的值。
		inputDom.value = theVal;
		setLocation(inputDom,index);//移动光标到删除后的位置
	}else{
		setTimeout(function() {		
			if(inputDom.value.length>ORIVALUE.length){
				alert('你可能在使用中文输入法，请切换到英文输入状态！');
				inputDom.value = ORIVALUE;
			}}, 10);
		if(isie){
			window.event.returnValue = false;
		}else{
			e.preventDefault();
		}
		return false;
	}
}

//初始化。绑定事件。
function initInput(ele,fixedCharIndex,ORIVALUE){
	ele = document.getElementById(ele);
	ele.onkeydown = function(e){
		inputControl(e,fixedCharIndex,ORIVALUE,ele);
	};
	ele.onpaste = function(e){
		window.event.returnValue = false;
		return false;
	}
}
