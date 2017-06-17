'use strict';

angular
    .module('droneCafe')
    .controller('chefCtrl', function($scope, chefCtrlService) {

    let socket = io();
    
    //получение списка заказанных блюд
    chefCtrlService.getMeals('Заказано').then(function(data) {
        $scope.orderedMeals = data.data;
    });
    //получение списка готовящихся блюд
    chefCtrlService.getMeals('Готовится').then(function(data) {
        $scope.cookingMeals = data.data;
    });
    //переход к приготовлению заказа
    $scope.start = function(order, orderIndex) {
        order.status = 'Готовится';
        $scope.orderedMeals.splice(orderIndex, 1);
        $scope.cookingMeals.push(order);

        socket.emit('status changed', order);

        chefCtrlService.updateOrderStatus(order._id, order.status);
    };
    //переход к доставке заказа
    $scope.finish = function(order, orderIndex) {
        order.status = 'Доставляется';
        $scope.cookingMeals.splice(orderIndex, 1);

        socket.emit('status changed', order);

        chefCtrlService.updateOrderStatus(order._id, order.status);
    };

    socket.on('order created', function(){
        chefCtrlService.getMeals('Заказано').then(function(data) {
            if(data.data.length !== undefined) {
                $scope.orderedMeals = data.data;
            };
        });
    });
    
    socket.on('order deleted', function(){
        chefCtrlService.getMeals('Заказано').then(function(data) {
            $scope.orderedMeals = data.data;
        });
        chefCtrlService.getMeals('Готовится').then(function(data) {
            $scope.cookingMeals = data.data;
        });
    });    

    socket.on('connect_error', function() {
        socket.disconnect();
    });

});