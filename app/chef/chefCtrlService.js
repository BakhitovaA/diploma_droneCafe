angular
.module('droneCafe')
.factory('chefCtrlService', function($http) {

    return {
        //получение списка блюд
        getMeals: function(mealStatus) {
            let config = {
                params: {
                    status: mealStatus
                }
            };
            return $http.get('/api/orders', config);
        },
        //обновление статуса заказа
        updateOrderStatus: function(orderid, newStatus, orderPrice){
            let orderData = {
                status: newStatus,
                price: orderPrice
            };
            return $http({
                method: 'PUT',
                url: '/api/orders/' + orderid,
                data: orderData
            });
        }
    }

});
