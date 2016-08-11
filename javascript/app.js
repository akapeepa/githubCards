var myApp = angular.module('myApp',['ngRoute','ngResource','firebase','ngMaterial']);

//Routes
myApp.config(function($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl:'pages/home.htm',
    controller:'homeController',
    controllerAs:'hc'
  })
});

//Service
myApp.service('myService',function($http){
  var vm = this;

  vm.getData = function(user){
    return $http.get('https://api.github.com/users/' + user);
  };
});


//Controller
myApp.controller('homeController',['$scope', '$firebaseArray','myService',function($scope,$firebaseArray,myService){
  var vm = this;
  var ref = new Firebase('https://githubcards.firebaseio.com/cardData');
  vm.cardData = $firebaseArray(ref);

  vm.user = '';

  vm.add = function(){
    var data = myService.getData(vm.user).then(function(res){
      console.log(res);

      function card(){
        this.pic = res.data.avatar_url;
        this.name = res.data.name;
        this.loc = res.data.location;
        this.fol = res.data.followers;
        this.url = res.data.html_url;
      }

      vm.newCard = new card();
      vm.cardData.$add(vm.newCard);
      console.log(vm.newCard);
    });
  }

  vm.delete = function(card){
    vm.cardData.$remove(card);
  }


  $scope.propertyName = 'name';
  $scope.reverse = true;
  $scope.cardData = vm.cardData;


  vm.sortBy = function(propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };

}]);
