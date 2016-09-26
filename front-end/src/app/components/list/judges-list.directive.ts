'use strict';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import { escapeRegExp } from '../../common/helper';
import { IDropDownOption } from '../../common/interfaces';
import { JUDGE } from '../../common/constants/constants';

let context: any = null;

/** @ngInject */
interface IScope extends angular.IScope {
	data: any;
	fullMode: boolean;
	_api: any;
	vm: JudgesListController;
}

export function list(): angular.IDirective {
	return {
		restrict: 'E',
		scope: {
			data: '=data',
			fullMode: '='
		},
		templateUrl: 'app/components/list/judges-list.view.html',
		controller: JudgesListController,
		controllerAs: 'vm',
		bindToController: true,
		link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
			const table = element.find('.table__wrapper'),
				th = table.find('th');

			th.on('click', function () {
				const target = this;
				const isReversed = !Boolean(angular.element(target).attr('data-reversed'));
				const sortKey = angular.element(target).attr('data-sort');

				scope.vm.changeOrder(sortKey, isReversed);

				if (isReversed) {
					angular.element(target).attr('data-reversed', 'true');
				} else {
					angular.element(target).removeAttr('data-reversed');
				}

				scope.$apply();
			});
		}
	};

}
const DISPLAYING_LENGTH: number = 10;
/** @ngInject */

class JudgesListController {
	data: any;
	limit: number;
	skiped: number;
	_api: any;
	partialData: any;
	searchQuery: string;
	_originalData: any;
	allRegions: Array<IDropDownOption>;
	filterApplyed: boolean = false;
	selectedRegion: IDropDownOption;
	$scope: IScope;
	private _state: any;
	private _detailsUrl: string;
	private $filter: any;

	constructor($state: any, urls: any, Api: any, $scope: IScope, $filter: angular.IFilterProvider) {
		context = this;

		this._detailsUrl = urls.details;
		this._state = $state;
		this.limit = DISPLAYING_LENGTH;
		this.skiped = 0;
		this._api = Api;
		this.$scope = $scope;
		this.$filter = $filter;

		// this._api.getJudgesList().then((res: any[]) => {
		// 	this.data = angular.copy(res);
		// 	this._originalData = angular.copy(res);
		//
		// 	this._api.getRegions().then(res => {
		// 		this.allRegions = res;
		//
		// 		this.selectedRegion = this.allRegions[0];
		// 		this.searchQuery = this._state.params.query;
		//
		// 		this.search();
		// 		$scope.$evalAsync();
		// 	});
		//
		// });
		var promiseArray = [];

		this._api.getJudgesList()
			.then(resp => {
				this.data = resp;
				this._originalData = angular.copy(resp);

				return this._api.getRegions();
			})
			.then(resp => {
				this.allRegions = resp;
				this.selectedRegion = this.allRegions[0];
				this.searchQuery = this._state.params.query;
				this.search();
				$scope.$applyAsync();
			});
	}

	toDetails(key: string) {
		this._state.go('details', {key});
	}

	toOrder(sortingKey: string, isReversed: boolean) {
		this.data.sort((prev: number, next: number) => {
			if (prev[sortingKey] > next[sortingKey]) {
				return 1;
			}
			if (prev[sortingKey] < next[sortingKey]) {
				return -1;
			}
			return 0;
		});

		if (isReversed) {
			this.data.reverse();
		}
	}

	changeOrder(sortingKey: string, isReversed: boolean) {
		this.toOrder(sortingKey, isReversed);
		this.getPartials();
	}

	showNext() {
		if (this.data.length > this.limit) {
			this.skiped += this.limit;
			this.getPartials();
		}
	}

	showPrevious() {
		if (this.skiped !== 0) {
			this.skiped -= this.limit;
			this.getPartials();
		}
	}

	getPartials() {
		this.partialData = this.data.slice(this.skiped, this.skiped + this.limit);
        this.$scope.$apply();
	}

	search() {
	    return this.filterByRegions()
            .then(() => {
                const searchQuery = escapeRegExp(this.searchQuery);
                let dataForSearch = this.filterApplyed ? this.data : this._originalData;
                const filtered = this.$filter('filterSearch')(dataForSearch, searchQuery);
                this.data = filtered.length > 0 ? filtered : [{n: 'Суддю не знайдено, спробуйте ще..', r: '', k: ''}];
                this.changeOrder(JUDGE.key, false);
            });
	}

	filterByRegions() {
		if (this.filterApplyed) {
            return this.$filter('filterByField')(this._originalData, this.selectedRegion.title, JUDGE.region)
                .then((data: Array) => {
                    this.data = data;
                });
		} else {
			this.data = this._originalData;
            return Promise.resolve();
		}

	}

	toFilter(region: IDropDownOption) {
		context.selectedRegion = region;
		context.filterApplyed = !!context.selectedRegion.key;
		context.search();
	}
}


