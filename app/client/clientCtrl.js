'use strict';

angular
    .module('droneCafe')
    .controller('clientCtrl', function($scope, clientCtrlService) {

    let socket = io();
    
    $scope.userLogin = false;
    //получение информации о клиенте при входе
    $scope.accountData = function(user) {
        $scope.userLogin = true;

        $scope.user = user;
        clientCtrlService.getUserInfo($scope.user).then(function(data) {
            if(data.data.length == 0) {
                //создание нового клиента
                $scope.user.balance = 100;                clientCtrlService.createNewUser($scope.user).then(function(data) {
                    $scope.user = data.data;
                });
            } else {
                $scope.user = data.data[0];
                //получение списка заказанных блюд пользователя
                clientCtrlService.getUserOrders($scope.user._id).then(function(data) {
                    if(data.data.length !== undefined) {
                        $scope.userOrder = data.data;
                    };
                });
            }
        });
    };
    //обновление баланса клиента
    $scope.addAmount = function(){
        $scope.user.balance = $scope.user.balance + 100;
        clientCtrlService.updateUserBalance($scope.user._id, $scope.user.balance)
    };
    //получение списка блюд в меню
    $scope.openMenu = function(){
        $scope.menuListDisplay = true;
        clientCtrlService.getMenu().then(function(data) {
            $scope.meals = data.data;
        });
    };
    //закрытие меню
    $scope.closeMenu = function(){
        $scope.menuListDisplay = false;
    };
    //добавление блюда к заказу
    $scope.addMealToOrder = function(singleMealId, singleMealTitle, singleMealPrice){
        $scope.user.balance = $scope.user.balance - singleMealPrice;

        clientCtrlService.updateUserBalance($scope.user._id, $scope.user.balance);

        clientCtrlService.createOrder($scope.user._id, singleMealId);
    };
    //добавление блюда к заказу со скидкой при неудачной доставке
    $scope.addMealToOrderWithSale = function(order, orderIndex){
        $scope.user.balance = $scope.user.balance - (order.price/100*5);
        clientCtrlService.updateUserBalance($scope.user._id, $scope.user.balance);
        
        order.status = 'Заказано';
        socket.emit('order status changed', order);
        clientCtrlService.updateOrderStatus(order._id, order.status);
    };
    //удаление блюда из заказа
    $scope.deleteMealFromOrder = function(order, orderIndex){     
        $scope.user.balance = $scope.user.balance + order.price;

        clientCtrlService.updateUserBalance($scope.user._id, $scope.user.balance);
        
        clientCtrlService.deleteOrder(order._id);
        $scope.userOrder.splice(orderIndex, 1);
    };
    
    socket.on('order created', function(){
        clientCtrlService.getUserOrders($scope.user._id).then(function(data) {
            if(data.data.length !== undefined) {
                $scope.userOrder = data.data;
            };
        });
    });

    socket.on('status changed', function(order){
        if ($scope.userOrder.length != 0) {
            for (let i=0; i<$scope.userOrder.length; i++){
                if($scope.userOrder[i]._id == order._id){
                    $scope.userOrder[i].status = order.status;
                    $scope.$apply();
                    break;
                }
            };
        }
    });
    
    socket.on('order deleted', function(){
        clientCtrlService.getUserOrders($scope.user._id).then(function(data) {
            if(data.data.length !== undefined) {
                $scope.userOrder = data.data;
            };
        });
    });

    socket.on('connect_error', function() {
        socket.disconnect();
    });
    
})