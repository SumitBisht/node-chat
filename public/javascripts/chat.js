
var sock=new SockJS('http://192.168.1.19:3000/chat');

function ChatCtrl($scope){
  $scope.messages = [];
  $scope.sendMessage = function(){
    sock.send($scope.messageText);
    $scope.messageText="";
  };

  sock.onmessage = function(e) {
    $scope.messages.push(e.data);
    $scope.$apply();
  };

}
