//计算base64图片size
function convertToBinary(dataURI) {
	var byteString = window.atob(dataURI.split(',')[1])
	var ab = new ArrayBuffer(byteString.length)
	var ia = new Uint8Array(ab)
	for(var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i)
	}
	var bb = new window.Blob([ab])
	return bb
}

var baseUrl = 'http://120.39.244.157:81';
// var organize_id = 23;//门店id
// var shop_name = '厦门盛成';
 
//试乘试驾协议
var message = "<p>经贵公司销售顾问的详细说明，对于新车试乘试驾活动的规范已熟悉，保证在本次试乘试驾过程中，严格遵守一切行车驾驶的交通法律法规和要求。注意行车安全，文明驾驶，确保行人和车辆安全。若造成交通事故或贵公司的一切损失，将由本人独自承担由此造成的一切经济损失和法律责任。</p>" + "<p>特此声明<p>" + "<p>试乘或试驾人员同意以上条款</p>";
var title = "试乘试驾协议";