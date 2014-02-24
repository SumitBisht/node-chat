
var sock=new SockJS('http://192.168.1.19:3000/chat');

function ChatCtrl($scope){
  $scope.messages = [];
  $scope.sendMessage = function(){
  	if(isOk()){
        var msgText = $scope.userName+':::::'+$scope.messageText;
  	    sock.send(msgText);
  	}
    $scope.messageText="";
  };

  sock.onmessage = function(e) {
    $scope.messages.push(e.data);
    $scope.$apply();
  };

  $scope.clearMessages = function() {
    $scope.messages = [];
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
}