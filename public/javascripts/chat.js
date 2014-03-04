var chatApp = angular.module('ChatApp', ['ngUpload']);
var sock=new SockJS('http://192.168.1.19:3000/chat');

chatApp.controller('ChatCtrl', function ($scope){
  $scope.messages = [];
  $scope.userCount = 0;
  $scope.sendMessage = function(){
  	if(isOk()){
        var msgText = $scope.userName+':::::'+$scope.messageText;
  	    sock.send(msgText);
  	}
    $scope.messageText="";
  };

  sock.onmessage = function(e) {
  	if(e.data.indexOf(' has joined.')!=-1){
  		$scope.userCount +=1;
  	}
  	if(e.data.indexOf(' has left.')!=-1){
  		$scope.userCount -=1;
  	}
    $scope.messages.push(e.data);
    $scope.$apply();
  };

  $scope.clearMessages = function() {
    $scope.messages = [];
  }

  $scope.uploadFile = function (content, completed) {
    console.log('Upload Completed');
    console.log(content);
    $scope.messages.push('File Uploaded: '+completed);
    $scope.uploadResponse = 'Server Response: '+content;
  };

  $scope.clearServerResponse = function() {
    $scope.uploadResponse = '';
  }

  function isOk(){
	var text = $scope.messageText;
	var user = $scope.userName;
	if(text==undefined || text==''){
		alert('Do not enter empty text');
		return false;
	}else if(text.substring(0, 3)=='hmm'){
		alert('Please respond, do not hmm');
		return false;
	}else if(user==undefined || user==''){
		$scope.userName = 'Anon';
	}
	return true;
  }
});