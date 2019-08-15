/**
 * Full page
 */
(function () {
	'use strict';
	
	/**
	 * Full scroll main function
	 */
	var fullPageScroll = function (params) {
		/**
		 * Main div
		 * @type {Object}
		 */
		var main = document.getElementById("main");
		
		/**
		 * Sections divclass
		 * @type {Array}
		 */
		var sections = document.querySelectorAll('main>section');
		
		var id = ""
		/**
		 * Full page scroll configurations
		 * @type {Object}
		 */
		var defaults = {
			container : params.mainElement || main,
			sections : params.sectionElements || sections,
			animateTime : params.animateTime || 0.7,
			animateFunction : params.animateFunction || 'ease',
			maxPosition: sections.length - 1,
			id: params.id || id,
			currentPosition: 0,
			displayDots: typeof params.displayDots != 'undefined' ? params.displayDots : true,
			dotsPosition: params.dotsPosition || 'left'
		};

		this.defaults = defaults;
		/**
		 * Init build
		 */
		this.init();
	};

	/**
	 * Init plugin
	 */
	fullPageScroll.prototype.init = function () {
		this.buildPublicFunctions()
			.buildSections()
			.buildDots()
			.addEvents();

		var anchor = location.hash.replace('#', '').split('/')[0];
		location.hash = 0;
		this.changeCurrentPosition(anchor);
		this.registerIeTags();
	};

	/**
	 * Build sections
	 * @return {Object} this(fullPageScroll)
	 */
	fullPageScroll.prototype.buildSections = function () {
		var sections = this.defaults.sections;
		for (var i = 0; i < sections.length; i++) {
			sections[i].setAttribute('data-index', i);
		}
		return this;
	};

	/**
	 * Build dots navigation
	 * @return {Object} this (fullPageScroll)
	 */
	fullPageScroll.prototype.buildDots = function () {		
		this.navigationContainer = document.createElement("div") 
		this.navigationContainer.className = this.updateClass(1, this.defaults.dotsPosition == 'right' ? 'navigation-right' : 'navigation-left', this.navigationContainer.className);
		
		this.navigationContainer.appendChild(document.createElement('div'));
		this.ul = document.createElement('ul');
		this.navigationContainer.appendChild(this.ul);
		// this.navigationContainer.appendChild(document.createElement('div'));
		// this.ul.className = this.updateClass(1, this.defaults.dotsPosition == 'right' ? 'navigation-right' : 'navigation-left', this.ul.className);
		


		this.ul.className = this.updateClass(1, 'dots', this.ul.className);
		this.ul.className = this.updateClass(1, this.defaults.id, this.ul.className)

		var _self = this;
		var sections = this.defaults.sections;		

		for (var i = 0; i < sections.length; i++) {
			var li = document.createElement('li');
			var a = document.createElement('a');
		
			a.setAttribute('href', '#' + i);			
			li.appendChild(a);
			_self.ul.appendChild(li);
		}
		this.ul.childNodes[0].firstChild.className = this.updateClass(1, 'active', this.ul.childNodes[0].firstChild.className);

		if (this.defaults.displayDots) {
			document.body.appendChild(this.navigationContainer);
		}

		return this;
	};

	/**
	 * Add Events
	 * @return {Object} this(fullPageScroll)
	 */
	fullPageScroll.prototype.addEvents = function () {
		
		if (document.addEventListener) {
			document.addEventListener('mousewheel', this.mouseWheelAndKey, false);
			document.addEventListener('wheel', this.mouseWheelAndKey, false);
			document.addEventListener('keyup', this.mouseWheelAndKey, false);
			document.addEventListener('touchstart', this.touchStart, false);
			document.addEventListener('touchend', this.touchEnd, false);
			window.addEventListener("hashchange", this.hashChange, false);

			/**
			 * Enable scroll if decive don't have touch support
			 */
			if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				if(!('ontouchstart' in window)){
					document.body.style = "overflow: scroll;";
					document.documentElement.style = "overflow: scroll;";
				}
			}			

		} else {
			document.attachEvent('onmousewheel', this.mouseWheelAndKey, false);
			document.attachEvent('onkeyup', this.mouseWheelAndKey, false);
		}
		
		return this;
	};	

	/**
	 * Build public functions
	 * @return {[type]} [description]
	 */
	fullPageScroll.prototype.buildPublicFunctions = function () {
		var mTouchStart = 0;
		var mTouchEnd = 0;
		var _self = this;

		this.mouseWheelAndKey = function (event) {
			if (event.deltaY > 0 || event.keyCode == 40) {	
				_self.defaults.currentPosition ++;
				_self.changeCurrentPosition(_self.defaults.currentPosition);				
			} else if (event.deltaY < 0 || event.keyCode == 38) {
				_self.defaults.currentPosition --;
				_self.changeCurrentPosition(_self.defaults.currentPosition);	
			}
			_self.removeEvents();
		};

		this.touchStart = function (event) {
			mTouchStart = parseInt(event.changedTouches[0].clientY);
			mTouchEnd = 0;
		};

		this.touchEnd = function (event) {
			mTouchEnd = parseInt(event.changedTouches[0].clientY);
			if (mTouchEnd - mTouchStart > 100 || mTouchStart - mTouchEnd > 100) {
				if (mTouchEnd > mTouchStart) {
					_self.defaults.currentPosition --;
				} else {
					_self.defaults.currentPosition ++;					
				}
				_self.changeCurrentPosition(_self.defaults.currentPosition);
			}			
		};

		this.hashChange = function (event) {
			if (location) {
				var anchor = location.hash.replace('#', '').split('/')[0];
				if (anchor !== "") {
					if (anchor < 0) {
						_self.changeCurrentPosition(0);
					} else if (anchor > _self.defaults.maxPosition) {
						_self.changeCurrentPosition(_self.defaults.maxPosition);
					} else {
						_self.defaults.currentPosition = anchor;
						_self.animateScroll();
					}					
				}				
			}
		};

		this.removeEvents = function () {
			if (document.addEventListener) {
			document.removeEventListener('mousewheel', this.mouseWheelAndKey, false);
			document.removeEventListener('wheel', this.mouseWheelAndKey, false);
			document.removeEventListener('keyup', this.mouseWheelAndKey, false);
			document.removeEventListener('touchstart', this.touchStart, true);
			document.removeEventListener('touchend', this.touchEnd, true);

			} else {
				document.detachEvent('onmousewheel', this.mouseWheelAndKey, false);
				document.detachEvent('onkeyup', this.mouseWheelAndKey, false);
			}

			setTimeout(function(){
				_self.addEvents();
			}, 600);
		};

		this.animateScroll = function () {
			var animateTime = this.defaults.animateTime;
			var animateFunction = this.defaults.animateFunction;
			var position = this.defaults.currentPosition * 100;

			this.defaults.sections.forEach(el => {
				el.style.transition = 'all ' + animateTime + 's linear';
				el.style.transform = 'translateY(-' + position + '%)';
			})
			var currentSection = document.getElementById("section" + this.defaults.currentPosition);
			currentSection.style.transition = 'all ' + animateTime + 's ' + animateFunction + "";

			for (var i = 0; i < this.ul.childNodes.length; i++) {
					this.ul.childNodes[i].firstChild.className = this.updateClass(2, 'active', this.ul.childNodes[i].firstChild.className);
					if (i == this.defaults.currentPosition) {
					this.ul.childNodes[i].firstChild.className = this.updateClass(1, 'active', this.ul.childNodes[i].firstChild.className);
				}
			}
		};

		this.changeCurrentPosition = function (position) {
			if (position !== "") {
				_self.defaults.currentPosition = position;
				location.hash = _self.defaults.currentPosition;
			}
		};

		this.registerIeTags = function () {
			document.createElement('section'); 
		};

		this.updateClass = function (type, newClass, currentClass) {
			if (type == 1) {
				return currentClass += ' ' + newClass;
			} else if (type == 2) {
				return currentClass.replace(newClass, '');
			}
		};

		return this;
	};
	window.fullPageScroll = fullPageScroll;
})();