angular
  .module('nodeapp', [])
  .controller("MainController", ["$scope", "$http", "$timeout", "$parse", function($scope, $http, $timeout, $parse){
    
    $scope.refreshData = function() {
      var url = "https://api.forecast.io/forecast/6572c1b762bc83b37b60de26df742b50/60.2087337,24.9671220?units=si&callback=JSON_CALLBACK";
      $http.jsonp(url)
      .success(function(data){
          moment.locale('en');
          for(item in data.daily.data){
            data.daily.data[item].localtime = moment.unix(data.daily.data[item].time).format("dddd");
          }
          for(item in data.hourly.data){
            data.hourly.data[item].localtime = moment.unix(data.hourly.data[item].time).format("HH:mm");
          }
          $scope.weatherdata = data;

          $timeout(function(){
            $scope.addIcons();
          }, 1000);
      });
    }

    $scope.refreshBusStopData = function(name, stop){
      var url = "http://api.reittiopas.fi/hsl/prod/?request=stop&user=nodeapp&pass=somepass&format=json&code="+stop;
      $http.get(url)
        .success(function(data){
          for(item in data){
            for(departure in data[item].departures){
              var hour = data[item].departures[departure].time.toString().slice(0,2);
              var minute = data[item].departures[departure].time.toString().slice(2,4);
              hour = hour > 23 ? hour - 24 : hour;
              hour = hour < 10 ? "0"+hour : hour;
              data[item].departures[departure].time = moment(hour+minute, 'HHmm').format('HH:mm');
              data[item].departures[departure].code = data[item].departures[departure].code.substring(1).replace(/^0+/, '').split(' ')[0];
            }
          }
          $scope[name] = data;
        })
    }

    

    $scope.addIcons = function(){
      var icons = new Skycons({"color": "#fff"}),
          list  = [
            "clear-day", "clear-night", "partly-cloudy-day",
            "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
            "fog"
          ];

      for(var i = 0; i < list.length; i++) {
          var weatherType = list[i];

          $("." + weatherType).each(function(i, o){
            icons.set(o, weatherType);
          });

      }

      icons.play();
    }

    $scope.intervalFunction = function(time){
      $timeout(function() {
        $scope.refreshData();
        $scope.refreshBusStopData("tyo","3598");
        $scope.refreshBusStopData("keskusta","3030");
        $scope.refreshBusStopData("viikki","3031");
        $scope.intervalFunction(300000);
      }, time)
    };

    // Kick off the interval
    $scope.intervalFunction(1);


  }]);

