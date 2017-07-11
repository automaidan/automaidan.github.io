import {routerConfig} from './index.route';
import {runBlock} from './index.run';

import {navbar} from './components/navbar/navbar.directive';
import {list} from './components/list/judges-list.directive';
import {plist} from './prosecutors/prosecutors.controller';
import {searchForm} from './components/search-form/search-form.directive';
import {footer} from './components/footer/footer.directive';
import {modalTable} from './components/modal-table/modal-table.directive';
import {dropDownMenu} from './components/drop-down-menu/drop-down-menu.directive';
import {chart} from './components/chart/chart.directive';

import {JudgesListController} from './list/list.controller';
import {ProsecutorsListController} from './prosecutors/prosecutors.controller';
import {DetailsController} from './details/details.controller';
import {HomeController} from './home/home.controller';
import {AboutController} from './about/about.controller';
import {AnalyticsController} from './analytics/analytics.controller';
import {AnalyticsProsecutorsController} from './analytics-prosecutors/analytics.controller';
import {ContactUs} from './contacts/contacts.controller';

import {StateDetector} from './common/directives/state-detector-directive';
import {ngRepeatTrack} from './common/directives/ngRepeatTrack.directive';
import {BarDirective} from './components/chart/bar.directive';

import {Api} from './common/services/api';

import {URLS, NAVBAR} from './common/constants/constants';

import {
    filterByField,
    filterSearch,
    filterByYear,
    filterByAnalyticsField,
    filterWhoHasStigma
} from './common/filters/filters';

// todo refactored in to modules system each component separated angular module

module frontEnd {
    'use strict';

    angular.module('frontEnd', [
        'ngAnimate',
        'ngCookies',
        'ngTouch',
        'ngSanitize',
        'ngMessages',
        'ngAria',
        'ui.router',
        'ngMaterial',
        'chart.js'])
        .constant('urls', URLS)
        .constant('navbarConstant', NAVBAR)
        .config(routerConfig)
        .run(runBlock)
        .service('Api', Api)
        .controller('JudgesListController', JudgesListController)
        .controller('ProsecutorsListController', ProsecutorsListController)
        .controller('HomeController', HomeController)
        .controller('AboutController', AboutController)
        .controller('DetailsController', DetailsController)
        .controller('ContactUsController', ContactUs)
        .controller('AnalyticsController', AnalyticsController)
        .controller('AnalyticsProsecutorsController', AnalyticsProsecutorsController)
        .directive('navbar', navbar)
        .directive('footer', footer)
        .directive('list', list)
        .directive('plist', plist)
        .directive('searchForm', searchForm)
        .directive('stateDetector', StateDetector)
        .directive('ngRepeatTrack', ngRepeatTrack)
        .directive('modalTable', modalTable)
        .directive('dropDownMenu', dropDownMenu)
        .directive('chart', chart)
        .directive('bar', BarDirective)
        .filter('filterByField', filterByField)
        .filter('filterSearch', filterSearch)
        .filter('filterByYear', filterByYear)
        .filter('filterByAnalyticsField', filterByAnalyticsField)
        .filter('filterWhoHasStigma', filterWhoHasStigma);
}
