System.register(['@angular/core', '@angular/http', 'rxjs/Observable', 'rxjs/add/operator/map', 'rxjs/add/operator/catch'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, http_2, Observable_1;
    var pictureService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
                http_2 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (_1) {},
            function (_2) {}],
        execute: function() {
            pictureService = (function () {
                function pictureService(http) {
                    this.http = http;
                    this._heroesUrl = '/api/productpictures';
                }
                pictureService.prototype.getHeroes = function () {
                    return this.http.get(this._heroesUrl)
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                pictureService.prototype.addHero = function (heroType) {
                    var body = JSON.stringify(heroType);
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.http.post(this._heroesUrl, body, options)
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                pictureService.prototype.editHero = function (heroType) {
                    var body = JSON.stringify(heroType);
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.http.put((this._heroesUrl + "/") + heroType.id, body, options)
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                pictureService.prototype.selectHero = function (heroType) {
                    return this.http.get(this._heroesUrl + "/heroType")
                        .retry(5)
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                pictureService.prototype.deleteHero = function (heroType) {
                    return this.http.delete(this._heroesUrl + "/" + heroType)
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                pictureService.prototype.handleError = function (error) {
                    console.error(error);
                    return Observable_1.Observable.throw(error.json().error || 'Server error');
                };
                pictureService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], pictureService);
                return pictureService;
            }());
            exports_1("pictureService", pictureService);
        }
    }
});
//# sourceMappingURL=pictureService.js.map