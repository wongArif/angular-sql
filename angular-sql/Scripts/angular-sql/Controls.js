﻿app.directive("asqlForm", ["$interpolate", "$parse", "$window", "$location", "$route", function ($interpolate, $parse, $window, $location, $route) {
    return {
        restrict: "E",
        templateUrl: "controls/asqlForm.html",
        transclude: true,
        scope: false,
        controller: function ($scope) {
            $scope.asqlForm = {};
            this.formDirty = function () { return $scope.asqlFormX.$dirty; };
        },
        link: function (scope, iElement, iAttrs, controller) {
            scope.asqlForm.alert = null;
            scope.asqlForm.dismissAlert = function () { scope.asqlForm.alert = null };
            scope.asqlForm.heading = function () { return $interpolate(iAttrs["heading"])(scope); };
            scope.asqlForm.canEdit = function () { return angular.isDefined(scope.Save); };
            scope.asqlForm.editing = function () { return scope.asqlForm.canEdit() && scope.asqlFormX.$dirty; };
            scope.asqlForm.hasError = function () { return scope.asqlForm.editing() && scope.asqlFormX.$invalid; };
            scope.asqlForm.back = function () { if (iAttrs["back"]) $location.path(iAttrs["back"]); else $window.history.back(); };
            scope.asqlForm.undo = function () { $route.reload(); };
            scope.asqlForm.save = function () {
                scope.Save.Execute(scope)
                    .success(function (data) { scope.asqlForm.alert = { type: "success", message: "Saved successfully." }; scope.asqlFormX.$setPristine(); })
                    .error(function (response, status) { scope.asqlForm.alert = { type: "danger", message: response }; });
            }
        }
    };
}]);

app.directive("asqlSubForm", [function () {
    return {
        restrict: "A",
        require: ["form", "^^asqlForm"],
        scope: true,
        link: function (scope, iElement, iAttrs, controller) {
            iElement.attr("novalidate", true);
            scope.formDirty = function () { return controller[1].formDirty(); };
            scope.hasError = function () { return scope.formDirty() && controller[0].$invalid; };
        }
    };
}]);

app.directive("asqlLabel", [function () {
    return {
        restrict: "E",
        templateUrl: "controls/asqlLabel.html",
        transclude: true,
        scope: { text: "@" }
    };
}]);

app.directive("asqlControl", [function () {
    return {
        restrict: "A",
        link: function (scope, iElement, iAttrs, controller) {
            if (!iElement.hasClass("form-control")) iElement.addClass("form-control");
        }
    };
}]);