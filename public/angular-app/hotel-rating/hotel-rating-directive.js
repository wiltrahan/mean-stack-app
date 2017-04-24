angular.module('meanhotel').directive('hotelRating', hotelRating);

//this is a custom directive
function hotelRating() {
  return {
    restrict: 'E', //element
    template: '<span ng-repeat="star in vm.stars track by $index" class="glyphicon glyphicon-star">{{ star }}</span>',
    bindToController: true,
    controller: 'HotelController',
    controllerAs: 'vm',
    scope: {
      stars: '@'
    }
  }
}
