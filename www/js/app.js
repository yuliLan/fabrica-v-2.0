
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
 
.factory('myService',function(){
    objeto = {
        foto: "",
        latitud: "",
        longitud: "",
        altura: "",
        orientacion: "",
        velocidad: "",
        imei:"",
        phone:"",
        mensaje:""
    };
    return objeto;
})
.controller('PhoneCtrl', function($scope){
  $scope.numero_celular = window.localStorage.getItem("numero_celular") ? JSON.parse(window.localStorage.getItem("numero_celular")):[];  
  $scope.addNumero = function(numero)
  {
    var existe = $scope.numero_celular.filter(function(el)
    {
        return el.numero_oficial == numero;
    })
    if (existe.length > 0)
     {
        alert("el numero ya existe");
        $scope.numero="";
        console.log($scope.numero_celular);
        return;
     }
     if ($scope.numero_celular !=null)
     {
        $scope.numero_celular.push({numero_oficial:numero});
        window.localStorage.setItem("numero_celular", JSON.stringify($scope.numero_celular));
     }
     else 
     {
        
        window.localStorage.setItem("numero_celular", JSON.stringify([{numero_oficial:numero}]));
     }
     $scope.numero="";
  }  
  console.log($scope.numero_oficial);
})
.controller('DeviceController', function($ionicPlatform, $scope, $cordovaDevice, myService, $timeout) {
    $ionicPlatform.ready(function() {
          
        $timeout(function() {
            var device = $cordovaDevice.getDevice();
            myService.imei = device.uuid;
            $scope.uuid = device.uuid;

        });
    });
})
.controller("camaraCtrl", function ($scope, $cordovaCamera, myService) {
    $scope.fotos = []
    $scope.takePhoto = function () {
        var options = {
            //para mas calidad en la imagen con 100 la totalida de pixceles
            quality: 75,
            //rl fotmato del valor de retorno de la imagen en este con base 64
            destinationType: Camera.DestinationType.DATA_URL,
            //elige el formato de retorno, ajusta la fuente de la imagen
            sourceType: Camera.PictureSourceType.CAMERA,
            //allowEdit: true,
            mediaType:Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth:300,
            targetHeight:300,
            //popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            myService.foto=imageData;
            //$scope.fotos=imageData;
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            $scope.fotos.push($scope.imgURI);

            
        }, function (err) {
            // An error occured. Show a message to the user
        });
    }
    $scope.choosePhoto = function () {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            //allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
           // popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.base="data:image/base64;base64,";
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            
        }, function (err) {
            // An error occured. Show a message to the user
        });
    }
})

.controller('GeolocationCtrl', function($scope, $cordovaGeolocation, myService) {
          
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
          myService.latitud = position.coords.latitude;
          myService.longitud = position.coords.longitude;
          myService.altura = position.coords.altitude;
          myService.velocidad=position.coords.speed;
        
      },function(err) {
        //alert("encienda su GPS");
       alert('code: ' + err.code + '\n' +
          'message: ' + err.message + '\n');
       }
     );
})

.controller('envia',function($scope,$cordovaDeviceOrientation,$http,$cordovaGeolocation,myService){
    
    document.addEventListener("deviceready", function () {
        $cordovaDeviceOrientation.getCurrentHeading().then(function(result) {
            myService.orientacion = result.magneticHeading;
            //alert(myService.orientacion + "orientacion");
            if(myService.orientacion === null)
            {
               myService.orientacion=-1;
            }  
        }, function(err) {
            console.log("error de la orientacion" + err);
        })
    });
    $scope.enviarDatos=function(){
        myService.mensaje = $scope.textoss;
     
        objeto = {
            //foto: myService.foto,
            foto: "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw",
            //latitud: myService.latitud,
            //longitud: myService.longitud,
            //altura: myService.altura,
            //orientacion: myService.orientacion,
            //velocidad: myService.velocidad,
            latitud: -17.3880667,
            longitud: -66.1645952,
            altura: 50,
            orientacion: 30,
            velocidad: 3,
            
            //imei: myService.imei,
            imei: " scesi con jhonas ",
            number_phone:64378089,
            mensaje: myService.mensaje, 
            //mensaje: "hola como estas benjamin"
        };
        //console.log(objeto);
        var msgdata =  {
            photo : objeto.foto,
            latitude : -17.3880667,
            longitude : -66.1645952,
            altitude : objeto.altura,
            orientation : objeto.orientacion,
            speed : objeto.velocidad,
            imei : objeto.imei,
            number_phone : objeto.number_phone,
            message : objeto.mensaje,
            date_creation:null,
            fire_percentage:null,
            is_read : false,
            is_valid : false
        }
        
        
       /* var url='http://incendios.delallajta.com/appmobile/services/?photo='+encodeURIComponent(objeto.foto)
        //var url='http://192.168.2.5:8000/appmobile/services/?photo='+encodeURIComponent(objeto.foto)
            url+='&'+'latitude='+encodeURIComponent(objeto.latitud)
            url+='&'+'longitude='+encodeURIComponent(objeto.longitud)
            url+='&'+'altitude='+encodeURIComponent(objeto.altura)
            url+='&'+'orientation='+encodeURIComponent(objeto.orientacion)
            url+='&'+'speed='+encodeURIComponent(objeto.velocidad)
            url+='&'+'imei='+encodeURIComponent(objeto.imei)
            url+='&'+'number_phone='+encodeURIComponent(objeto.number_phone)
            url+='&'+'message='+encodeURIComponent(objeto.mensaje);
            */
        //$http.get(url)
        //$http.post('http://192.168.1.163:8000/appmobile/', nuevo)
        console.log(msgdata)
          $http.post('http://incendios.delallajta.com/appmobile/', msgdata)
            .then(function(data,error){
                window.tes=data;
                alert(data.data);
               // alert(error);
                $scope.days=data.data;
                //location.reload();
                //window.close();
                ionic.Platform.exitApp();
            }, function(err) {
                console.log(msgdata);
                console.log(err);
               //location.reload();
                //window.close();
                ionic.Platform.exitApp();
            });
    }
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("button");
    $ionicConfigProvider.navBar.alignTitle("center");
    $stateProvider
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
    .state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
            }
        }
    })
    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
            }
        }
    });
    $urlRouterProvider.otherwise('/tab/dash');
})
