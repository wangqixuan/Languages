"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Copyright (C) 2017 by WebCreative5 - Samuel Ronce

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var Languages = function () {

	var fs = void 0,
	    _instance = void 0,
	    isServerSide = false;

	if (typeof exports !== "undefined" && typeof window === "undefined") {
		fs = require('fs');
		isServerSide = true;
	}

	var Languages = function () {
		function Languages() {
			_classCallCheck(this, Languages);

			this.current = "en";
			this.data = {};
			this.options = {};
			this._path = null;
			this._cache = {};
			this._list = [];
		}

		_createClass(Languages, [{
			key: "instance",
			value: function instance() {
				return _instance = new Languages();
			}
		}, {
			key: "set",
			value: function set(id, callback) {
				this.init(id, this._path, callback);
				return this;
			}
		}, {
			key: "add",
			value: function add(id, path, namespace, callback) {
				this.init(id, path, callback, { namespace: namespace });
			}
		}, {
			key: "packages",
			value: function packages(languages) {
				var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

				var ids = [];

				var namespace = options.namespace || "self";
				if (!this._cache[namespace]) {
					this._cache[namespace] = {};
				}
				for (var key in languages) {
					this._cache[namespace][key] = languages[key];
					ids.push(key);
				}

				return this.init(ids, false, false, options);
			}
		}, {
			key: "default",
			value: function _default(id) {
				this.current = id;
			}

			// NodeJS only

		}, {
			key: "all",
			value: function all(path, callback) {
				var _this = this;

				var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


				var _callback = function _callback(files) {
					var filter = [],
					    ext = /\.json$/;
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var file = _step.value;

							if (ext.test(file)) {
								filter.push(file.replace(ext, ''));
							}
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}

					_this.init(filter, path, callback, options);
				};
				if (!callback) {
					_callback(fs.readdirSync(path));
				} else {
					fs.readdir(path, function (err, files) {
						if (err) throw err;
						_callback(files);
					});
				}
			}
		}, {
			key: "init",
			value: function init(id, path, callback) {
				var _this2 = this;

				var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


				var _path = void 0,
				    xhr = void 0;

				var namespace = options.namespace || "self";

				if (typeof path == "function") {
					callback = path;
					path = false;
				}

				this._path = path;

				if (!(id instanceof Array)) {
					id = [id];
				}

				this._list = id;

				var getCountryCode = function getCountryCode(lang) {
					return lang += '_' + lang.toUpperCase();
				};
				var userLang = getCountryCode(this.getUserLanguage().replace(/\-.+/, ""));
				if (this._list.indexOf(userLang) == -1) {
					this.current = this._list[0];
				} else {
					this.current = userLang;
				}

				if (path) {
					_path = path + this.current + ".json";
				}

				var _callback = function _callback(txt, id, notCall) {

					var json = void 0;

					if (!id) {
						id = _this2.current;
					}

					if (path) {
						txt = txt.toString('utf8');
						json = JSON.parse(txt);
					} else {
						json = txt;
					}

					if (!_this2._cache[namespace]) {
						_this2._cache[namespace] = {};
					}

					var _json = json,
					    _json2 = _slicedToArray(_json, 2),
					    data = _json2[0],
					    options = _json2[1];

					_this2.data[id] = {};
					_this2.options[id] = {};
					_this2.data[id][namespace] = _this2._initMultiple(data);
					_this2.options[id][namespace] = options;
					_this2._cache[namespace][id] = txt;
					if (callback && !notCall) callback.call(self);
				};

				if (this._cache[namespace]) {
					for (var lang in this._cache[namespace]) {
						_callback(this._cache[namespace][lang], lang);
					}
					return this;
				}

				if (fs) {
					if (!callback) {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = this._list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var _lang = _step2.value;

								_callback(fs.readFileSync(path + _lang + ".json"), _lang, true);
							}
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}
					} else {
						(function () {
							var index = 0;
							var _iteratorNormalCompletion3 = true;
							var _didIteratorError3 = false;
							var _iteratorError3 = undefined;

							try {
								var _loop = function _loop() {
									var lang = _step3.value;

									fs.readFile(path + lang + ".json", function (err, ret) {
										if (err) throw err;
										_callback(ret, lang, true);
										index++;
										if (callback && index == _this2._list.length) {
											callback.call(_this2);
										}
									});
								};

								for (var _iterator3 = _this2._list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
									_loop();
								}
							} catch (err) {
								_didIteratorError3 = true;
								_iteratorError3 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion3 && _iterator3.return) {
										_iterator3.return();
									}
								} finally {
									if (_didIteratorError3) {
										throw _iteratorError3;
									}
								}
							}
						})();
					}
					return this;
				}

				try {
					xhr = new XMLHttpRequest();
				} catch (e) {
					xhr = false;
				}

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4 && xhr.status == 200) {
						_callback(xhr.responseText);
					}
				};

				xhr.open("GET", _path, true);
				xhr.send();

				return this;
			}
		}, {
			key: "getUserLanguage",
			value: function getUserLanguage() {
				var first = this._list[0];
				if (isServerSide) {
					return first;
				} else {
					return navigator.language || navigator.userLanguage || first;
				}
			}
		}, {
			key: "_initMultiple",
			value: function _initMultiple(obj) {
				var ids = void 0,
				    specialId = void 0,
				    isGroup = void 0,
				    tmpObj = {},
				    finalObj = {};

				function replaceManyGroup(specialId, obj, key, originalObj) {

					var tmp = {};
					var groupObj = originalObj ? originalObj[specialId] : obj[specialId];
					var words = key.split(' ');

					var _loop2 = function _loop2(specialKey) {
						var id = key.replace(specialId, specialKey);
						if (obj[key].text) {
							tmp[id] = {
								text: obj[key].text,
								replacePattern: obj[key].replacePattern.map(function (w) {
									return specialId == w ? specialKey : w;
								})
							};
						} else {
							tmp[id] = {
								text: obj[key],
								replacePattern: words.map(function (w) {
									return specialId == w ? specialKey : w;
								})
							};
						}
					};

					for (var specialKey in groupObj) {
						_loop2(specialKey);
					}
					return tmp;
				}

				function mergeWithOriginal(obj, finalObj) {
					for (var finalKey in finalObj) {
						obj[finalKey] = finalObj[finalKey];
					}
					return obj;
				}

				var newObj = JSON.parse(JSON.stringify(obj));

				for (var key in newObj) {

					var _isGroup = /^\$[^ ]+$/.test(key);
					var regex = /\[(.+)\]/;
					var special = /\$[^ ]+/g;

					if (regex.test(key)) {
						ids = regex.exec(key)[1].split(',');
						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;

						try {
							for (var _iterator4 = ids[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								var _id = _step4.value;

								obj[key.replace(regex, _id)] = obj[key];
							}
						} catch (err) {
							_didIteratorError4 = true;
							_iteratorError4 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion4 && _iterator4.return) {
									_iterator4.return();
								}
							} finally {
								if (_didIteratorError4) {
									throw _iteratorError4;
								}
							}
						}
					}

					if (special.test(key) && !_isGroup) {
						tmpObj = {};
						finalObj = {};
						specialId = key.match(special);
						tmpObj = replaceManyGroup(specialId[0], obj, key);
						if (specialId.length > 1) {
							for (var tmpKey in tmpObj) {
								finalObj = replaceManyGroup(specialId[1], tmpObj, tmpKey, obj);
								mergeWithOriginal(obj, finalObj);
							}
						} else {
							mergeWithOriginal(obj, tmpObj);
						}
					}
					if (_isGroup) {
						for (var groupKey in obj[key]) {
							obj[groupKey] = obj[key][groupKey];
						}
					}
				}

				return obj;
			}
		}, {
			key: "get",
			value: function get(id, namespace, lang) {
				lang = lang || this.current;
				namespace = namespace || 'self';
				if (!this.data[lang][namespace]) {
					return '';
				}
				return this.replaceWorlds(this.data[lang][namespace][id], id, namespace);
			}
		}, {
			key: "capitalizeFirstLetter",
			value: function capitalizeFirstLetter(str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			}
		}, {
			key: "replaceWorlds",
			value: function replaceWorlds(str, id, namespace) {
				var _this3 = this;

				var params = {};
				if (!str) {
					return str;
				}
				if (str.text) {
					params = str;
					str = str.text;
				}
				return str.replace(/\{([0-9]+)\}/g, function (match, number) {
					var ids = params.replacePattern || id.split(' ');
					return _this3.get(ids[number - 1], namespace);
				});
			}
		}, {
			key: "getGroup",
			value: function getGroup(name) {
				var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'self';

				var groups = this.data[this.current][namespace]['$' + name];
				var array = [];
				for (var key in groups) {
					array.push(key);
				}
				return array;
			}
		}, {
			key: "render",
			value: function render(text) {
				var _this4 = this;

				var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
				    _ref$patternStart = _ref.patternStart,
				    patternStart = _ref$patternStart === undefined ? '{{' : _ref$patternStart,
				    _ref$patternEnd = _ref.patternEnd,
				    patternEnd = _ref$patternEnd === undefined ? '}}' : _ref$patternEnd,
				    _ref$pipe = _ref.pipe,
				    pipe = _ref$pipe === undefined ? '|' : _ref$pipe,
				    _ref$fnStart = _ref.fnStart,
				    fnStart = _ref$fnStart === undefined ? '' : _ref$fnStart,
				    _ref$fnEnd = _ref.fnEnd,
				    fnEnd = _ref$fnEnd === undefined ? '' : _ref$fnEnd,
				    _ref$paramsSeparator = _ref.paramsSeparator,
				    paramsSeparator = _ref$paramsSeparator === undefined ? ':' : _ref$paramsSeparator;

				var language = arguments[2];

				var escape = function escape(pattern) {
					return pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
				};
				patternStart = escape(patternStart);
				patternEnd = escape(patternEnd);
				pipe = escape(pipe);
				fnStart = escape(fnStart);
				fnEnd = escape(fnEnd);
				var escapeParamsSeparator = escape(paramsSeparator);
				var regexp = new RegExp(patternStart + "([^" + patternEnd + "]+)" + pipe + "[ ]*t(" + escapeParamsSeparator + "?" + fnStart + "([^" + patternEnd + "]+)" + fnEnd + ")?" + patternEnd, 'g');
				text = text.replace(regexp, function (match, key, t, params, offset, string) {
					key = key.replace(/["']/g, '');
					key = key.trim();
					if (params) {
						params = params.split(paramsSeparator);
						params = params.map(function (val) {
							val = val.trim();
							if (val >= 0 || val <= 0) {
								val = +val;
							} else if (val == 'true') {
								val = val === 'true';
							} else if (val == 'false') {
								val = val === 'false';
							}
							return val;
						});
					} else {
						params = [];
					}
					if (language) {
						params = [language].concat(_toConsumableArray(params));
					}
					return _this4.translate.apply(_this4, [key].concat(_toConsumableArray(params)));
				});
				return text;
			}
		}, {
			key: "getPlurial",
			value: function getPlurial(val, type, namespace, lang) {
				namespace = namespace || 'self';
				lang = lang || this.current;
				val = Math.abs(val);

				if (!/^[0-9]+$/.test(val)) {
					return false;
				}

				var plurial = this.options[lang][namespace].plurial[type];
				if (!plurial) {
					plurial = ["s"];
				}
				if (val > 2 && plurial[val - 1]) {
					return plurial[val - 1];
				} else if (val > 1) {
					return plurial[0];
				} else {
					return plurial[1] || '';
				}
			}
		}, {
			key: "format",
			value: function format(word, namespace, localCurrent) {
				for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
					args[_key - 3] = arguments[_key];
				}

				var _this5 = this;

				var i = -1,
				    plurial = void 0,
				    val = void 0;
				var match = word.match(/%[sdp]/g);
				if (!match) return word;
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = match[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var m = _step5.value;

						i++;
						if (m == "%d") {
							plurial = args[i];
						} else if (m == "%p") {
							break;
						}
					}
				} catch (err) {
					_didIteratorError5 = true;
					_iteratorError5 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion5 && _iterator5.return) {
							_iterator5.return();
						}
					} finally {
						if (_didIteratorError5) {
							throw _iteratorError5;
						}
					}
				}

				i = -1;
				return word.replace(/%[sdp]([0-9]+)?/g, function (match, number) {
					i++;
					val = typeof args[i] != 'undefined' ? args[i] : match;
					if (/^%p/.test(match)) {
						if (plurial == undefined) {
							plurial = val;
						}
						if (typeof plurial != "number") {
							plurial = 0;
						}
						val = _this5.getPlurial(plurial, match.replace("%", ""), namespace, localCurrent);
					}
					return val;
				});
			}
		}, {
			key: "translate",
			value: function translate(value) {
				for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
					args[_key2 - 1] = arguments[_key2];
				}

				var type,
				    txt,
				    namespace = "self",
				    localCurrent;

				var arg = args[0];

				function shift() {
					args.shift();
					arg = args[0];
				}

				if (this._list.indexOf(args[0]) != -1) {
					localCurrent = arg;
					shift();
				}
				if (typeof arg == "boolean") {
					var group = value.match(/\((.*?)\)/);
					if (group) {
						type = group[1].split("|");
						txt = arg ? value.replace(group[0], type[0].trim()) : value.replace(group[0], type[1].trim());
					} else {
						type = value.split("|");
						txt = arg ? type[0] : type[1];
					}
					shift();
				} else {
					txt = value;
				}
				var words = txt.split('+');
				var str = '',
				    word = void 0;
				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					for (var _iterator6 = words[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						var w = _step6.value;

						var match = void 0,
						    _namespace = void 0;
						if (match = /(.+)\.(.+)/.exec(w)) {
							_namespace = match[1];
							w = match[2];
						}
						var _word = this.get(w.trim(), _namespace, localCurrent);
						if (_word) {
							str += this.format.apply(this, [_word, _namespace, localCurrent].concat(args));
						}
						str += ' ';
					}
				} catch (err) {
					_didIteratorError6 = true;
					_iteratorError6 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion6 && _iterator6.return) {
							_iterator6.return();
						}
					} finally {
						if (_didIteratorError6) {
							throw _iteratorError6;
						}
					}
				}

				return this.capitalizeFirstLetter(str.trim());
			}
		}, {
			key: "load",
			get: function get() {
				var self = this;
				return {
					Handlebars: function (_Handlebars) {
						function Handlebars(_x6) {
							return _Handlebars.apply(this, arguments);
						}

						Handlebars.toString = function () {
							return _Handlebars.toString();
						};

						return Handlebars;
					}(function (Handlebars) {

						Handlebars.registerHelper('t', function (text, options) {
							var nb = options.hash.nb,
							    _if = options.hash.if;
							if (nb === undefined) {
								return text.t();
							} else {
								if (_if === undefined) {
									return text.t(+nb);
								} else {
									return text.t(_if, +nb);
								}
							}
						});

						return Handlebars;
					}),
					Pug: function Pug() {
						var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

						filters.translate = function (text) {
							return self.render(text);
						};
						return filters;
					},
					Angular: function Angular(angular) {
						angular.module("Languages", []).provider("Languages", function () {

							this.init = self.init.bind(Languages);

							this.$get = function () {
								return self;
							};
						}).filter('t', function () {

							return function (str) {
								for (var _len3 = arguments.length, expression = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
									expression[_key3 - 1] = arguments[_key3];
								}

								return str.t.apply(str, expression);
							};
						});
					},

					get Vue() {
						return {
							install: function install(Vue, options) {
								Vue.Languages = self;
								Vue.filter('t', function (value) {
									for (var _len4 = arguments.length, expression = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
										expression[_key4 - 1] = arguments[_key4];
									}

									return self.translate.apply(self, [value].concat(expression));
								});
							}
						}; // return
					}
				}; // second return
			}
		}]);

		return Languages;
	}();

	_instance = new Languages();

	String.prototype.t = function () {
		var _instance2;

		for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
			args[_key5] = arguments[_key5];
		}

		return (_instance2 = _instance).translate.apply(_instance2, [this].concat(args));
	};

	if (typeof Handlebars !== "undefined") _instance.load.Handlebars(Handlebars);
	if (typeof angular !== "undefined") _instance.load.Angular(angular);
	if (typeof Vue !== "undefined") Vue.use(_instance.load.Vue);

	return _instance;
}();

module.exports = Languages;
