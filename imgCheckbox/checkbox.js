/**
* author:ls
* email:liusaint@gmail.com
* date:2015年
*/


//删除字符串左右两端的空格
var uncheckUrl = 'images/uncheck.png';
var checkUrl = 'images/check.png';

$(document).ready(function() {


	//删除选中的数据
	$("#del").click(function() {

		var imgLength = $('.display_ID li img').length;
		var checkDom = '';

		for (var i = imgLength - 1; i >= 0; i--) {
			checkDom = $('.display_ID li img').eq(i);
			if(checkDom.attr("src") == checkUrl){
				checkDom.parent().remove();
			};
		};

		if($('.display_ID li img').length == 0){
			$("#SelectAllImg").attr("src",uncheckUrl);
		}

	});

	//点击复选框图片
	$("#ul").on('click', 'li img', function(event) {

		var imgDom = $(this);

		if(imgDom.attr("src")==checkUrl){
			$("#SelectAllImg").attr("src",uncheckUrl);
			imgDom.attr("src",uncheckUrl);
		}else{
			imgDom.attr("src",checkUrl);

			//上面部分是变换图片自身，下面部分是检测是否要变换全选图片。
			//通过比较图片总数量与选中图片数量来决定。
			var imgLength = $('#ul li img').length;
			var checkLength = 0;

			for (var i = 0; i <= imgLength; i++) {
				if($('#ul li img').eq(i).attr("src") == checkUrl){
					checkLength ++;
				}
			}

			if(imgLength == checkLength){
				$("#SelectAllImg").attr("src",checkUrl);	
			}
		}
	});


	//全选中的图标
	$("#SelectAllImg").click(function() {
		if($(this).attr("src")== checkUrl){
			$(this).attr("src",uncheckUrl);
			$(".display_ID li img").attr("src",uncheckUrl);
		}else{
			$(this).attr("src",checkUrl);
			$(".display_ID li img").attr("src",checkUrl);
		}
	});
});


//ajax提交注册
function regist() {

	var deviceIdArr = [];
	var deviceId ='';
	$('.display_ID li img').each(function() {
		if($(this).attr('src') == checkUrl){
			deviceid = $.trim($(this).parent().text());
			deviceIdArr.push(deviceid);
		}
	});
	console.log(deviceIdArr);
	if(deviceIdArr.length == 0){
		alert('没有选择，不可提交。');
		return;
	}
	$.ajax({
		type: "post",
		data: {
			deviceIdArr:deviceIdArr
		},
		url: "checkbox.php",
		dataType: "JSON",
		success:   function callback(data) {
			alert('已提交所选项，你选择的是：'+data);
		}
	});
	deviceIdArr = [];

}
