//IE9以下不能使用bind的处理。
if (!Function.prototype.bind) { 
	Function.prototype.bind = function (oThis) { 
		if (typeof this !== "function") { 
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); 
		} 
		var aArgs = Array.prototype.slice.call(arguments, 1), 
		fToBind = this, 
		fNOP = function () {}, 
		fBound = function () { 
			return fToBind.apply(this instanceof fNOP && oThis ? this: oThis, 
				aArgs.concat(Array.prototype.slice.call(arguments))); 
		}; 
		fNOP.prototype = this.prototype; 
		fBound.prototype = new fNOP(); 
		return fBound; 
	}; 
}

var Picker1 = function(startEle,endEle,day){
	this.md = new Date();
	this.startEle = startEle;
	this.endEle = endEle;
	this.day = -day;
}

Picker1.prototype = {
	init:function(){
		//初始化控件。给开始日期输入框和结束的输入框绑定事件。传入合理的参数。注意this。
		var that = this;
		document.getElementById(this.startEle).onfocus = function(){
			that.picker1rule(this);
		}
		document.getElementById(this.endEle).onfocus = function(){
			that.picker2rule(this);
		}
	},
	picker1rule:function(ele){
		//开始日期的输入框的规则

		var pickedfunBind = this.pickedFunc.bind(ele,this);
		var onclearedBind = this.clearedFun.bind({},this);

		WdatePicker({maxDate:'#F{$dp.$D(\''+this.endEle+'\')||\'new Date()\'}',minDate:'#F{$dp.$D(\''+this.endEle+'\',{d:'+this.day+'})}',onpicked:pickedfunBind,oncleared:onclearedBind})
	},
	pickedFunc:function(that){
		//开始日期的输入框的规则，onpicked时候的动作
		var Y=$dp.cal.getP('y');
		var M=$dp.cal.getP('M');
		var D=$dp.cal.getP('d');

		M=parseInt(M)-1;
		D=parseInt(D) - that.day;　//超过30天，也能自动处理。
		var d = new Date()
		d.setFullYear(Y,M,D) //设置时间

		var nowDate=new Date();　
		//跟现在的时间比较，如果算出来的值大于现在时间，修改全局变量md为现在时间。否则为算出来的时间。
		if(nowDate<=d){
			that.md=nowDate;
		}else{
			var month=d.getMonth()+1; //月份的范围是（0到11）;
			that.md=d.getFullYear()+"-"+month+"-"+d.getDate(); //直接把d给过去会有问题，所以拼成字符串发过去
		}
		// console.log(that.md,that,'in picked');
	},
	clearedFun:function(that){
		//开始日期的输入框的规则，onpicked时候的动作oncleared
		that.md=new Date();
		// console.log(that.md,that,'in clear');
	},
	picker2rule:function(ele){
		// console.log(this.md,this,"in picker2rule");
		WdatePicker({el:ele,minDate:'#F{$dp.$D(\''+this.startEle+'\')}',maxDate:this.md})
	}
};