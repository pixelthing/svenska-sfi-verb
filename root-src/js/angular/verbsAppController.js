verbsApp.controller('VerbsListController', ['$rootScope', '$scope', '$timeout', 'verbsFactory', function($rootScope, $scope, $timeout, verbsFactory) {

    $scope.isLoading = true;
    $scope.verbs = [];
    $scope.verbsCount = 0;
    $scope.verbsFiltered = [];
    $scope.filterCurrentGroup = null;
    $scope.detailIsOpen = false;
    $scope.detailData = {};

    // PREFIX HELPER

    var prefix = (function () {
        var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice
                .call(styles)
                .join('') 
                .match(/-(moz|webkit|ms)-/)
            )[1] || '',
            dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];


        var jsPrefix = pre[0].toUpperCase() + pre.substr(1);
        var transformPrefixed = 'tranform';
        var transitionPrefixed = 'transition';
        if (dom.length) {
            transformPrefixed = pre + 'Transform';
            transitionPrefixed = pre + 'Transition';
        }
        return {
            dom: dom,
            lowercase: pre,
            css: '-' + pre + '-',
            js: jsPrefix,
            transform: transformPrefixed,
            transition: transitionPrefixed
        };
    })();

    // TOUCH SLIDE

    $scope.panRight = function(event) {
        var deltaX = event.deltaX;
        var deltaY = event.deltaY;
        if (Math.abs(deltaY)/3 > Math.abs(deltaX) || deltaY > 20 ) {
            event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
            return;
        }
        if (deltaX > 0) {
            event.element['0'].style[prefix.transform] = 'translate3d(' + deltaX + 'px,0,0)';
        }
    }
    $scope.panEnd = function(event) {
        event.element['0'].style[prefix.transition] = prefix.css + 'transform 200ms';
        event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
        setTimeout(function() {
            event.element['0'].style[prefix.transition] = 'none';
        },200);
    }

    // SEARCH/FILTER

    $scope.searchFocus = function() {
        document.querySelector('.js-vFilterInput').focus();
    }

    $scope.searchSubmit = function() {
        document.querySelector('.js-vFilterFocusTarget').focus();
    }

    $scope.searchClear = function() {
        $scope.search = '';
    }

    $scope.searchLoading = function() {
        scroll(0,0);
    }

    $scope.filterGroup = function(group) {
        scroll(0,0);
        $scope.isLoading = true;
        $scope.filterCurrentGroup = ( $scope.filterCurrentGroup === group ? null : group );
        $timeout(function() {
            $scope.isLoading = false;
        },1100);
    }

    $scope.filterClear = function() {
        $scope.search = '';
        $scope.filterCurrentGroup = null;
    }

    $scope.filterGroupFilter = function(value, index) {
        if ($scope.filterCurrentGroup != null) {
            if ('' + value.group === '' + $scope.filterCurrentGroup) {
                return value;
            }
        } else {
            return value;
        }
    }

    // DETAIL

    $scope.backgroundClick = function() {
        $rootScope.$broadcast('backgroundClick');
    }

    $scope.detailOpen = function(index) {
        document.querySelector('html').classList.add('modal');
        $scope.detailIsOpen = true;
        $scope.detailFill(index);
    }

    $scope.detailClose = function() {
        document.querySelector('html').classList.remove('modal');
        $scope.detailData = {};
        $scope.detailIsOpen = false;
    }


    $scope.detailFill = function(index) {
        $scope.detailData = $scope.verbsFiltered[index];
    }

    $rootScope.$on('backgroundClick', function () {
        $scope.detailClose();
    });

    verbsFactory
        .getVerbs()
        .then(function(verbs) {
            $scope.verbs = verbs;
            $scope.verbsCount = verbs.length;
            $scope.isLoading = false;
        });

}]);