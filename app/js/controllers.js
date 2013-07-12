/**
 * Zipcode controller
 */
function zipCodeFrmCtrl( $scope, $location ){
    $scope.sendZip = function( zipcode ) {
        $location.path("/main/"+ zipcode );
    }
};

/**
 * Main Controller
 */
function MainCtrl($scope) {

}