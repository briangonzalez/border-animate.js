;(function(window, undefined){

    'use strict';

    // Config.
    //
    var CONFIG = {
        selector:       '[data-border-animate]',
        delimiter:      '|'
    };

    // Helper attached to "_".
    //
    var _ = {};

    _.getAttr = function(attr, el){
        return el.getAttribute(attr);
    };

    _.borderStrings = function(attrString){
        return attrString.split(CONFIG.delimiter);
    };

    _.each = function(collection, fxn){
        Array.prototype.forEach.call(collection, function(el, i){
            fxn(el, i);
        });
    };

    _.uid = function(){
        return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
    };

    _.transProperties = function(collection, fxn){
       return ['OTransition', 'MSTransition', 'WebkitTransition', 'MozTransition', 'transition' ];
    };

    // Faux Border Object.
    //
    function FauxBorder(opts){
        this.mainEl     = opts.mainEl;
        this.location   = opts.location; 
        var props = opts.borderString.split(',');
        this.properties = { border: props[0], transition: props[1], delay: props[2], direction: props[3] };
    }

    FauxBorder.prototype.draw = function(opts) {
        var self = this;
        this.applyInitialTransparentBorder();
        this.rect = this.getRect();

        this.createWrapper();
        this.createInner();
        this.append();
        this.animate(function(){
            self.applyRealBorder();
            self.destroy();
        });   
    };

    FauxBorder.prototype.createWrapper = function() {
        var rect = this.rect;
        this.wrapper = document.createElement('div');
        this.wrapper.style.position  = 'absolute';

        if ( this.orientation() === "horizontal" ){
            this.wrapper.style.left      = rect.left + 'px';
            this.wrapper.style.width     = (rect.right - rect.left) + 'px';

            if (this.location === 0)
                this.wrapper.style.top   = rect.top + 'px';

            if (this.location === 2)
                this.wrapper.style.top   = rect.bottom + 'px';

        } else {
            this.wrapper.style.top       = rect.top + 'px';
            this.wrapper.style.height    = (rect.bottom - rect.top) + 'px';

            if (this.location === 1)
                this.wrapper.style.left   = rect.right + 'px';

            if (this.location === 3)
                this.wrapper.style.left   = rect.left + 'px';
        }
    };

    FauxBorder.prototype.createInner = function() {
        var self = this;
        this.inner = document.createElement('div');

        if ( this.orientation() === "horizontal" ){
            this.inner.style.borderTop  = this.properties.border;
            this.inner.style.width      = 0;

            if ( this.properties.direction && this.properties.direction.match(/left/i) )
                this.inner.style.float = 'right';

        } else {
            this.inner.style.borderLeft = this.properties.border;
            this.inner.style.height     = 0;
        }

        _.each( _.transProperties(),function(type){
            self.inner.style[type] = ['all', self.properties.transition + 'ms', 'ease'].join(' ');
        });

        this.adjustWrapper();
        this.wrapper.appendChild(this.inner);
    };

    FauxBorder.prototype.append = function() {
        document.body.appendChild(this.wrapper);
    };

    FauxBorder.prototype.animate = function(callback) {
        var self = this;
        var delay = this.properties.delay || 0;

        if ( this.orientation() === "horizontal" ){
            setTimeout(function(){
                self.inner.style.width  = '100%'; 
                setTimeout(callback, self.properties.transition)
            }, delay);
        } else {
            setTimeout(function(){
                self.inner.style.height = '100%';
                setTimeout(callback, self.properties.transition)
            }, delay);
        }
    };

    FauxBorder.prototype.adjustWrapper = function() {

        // Push right in.
        if ( this.location === 1 )
            this.wrapper.style.left = parseFloat(this.wrapper.style.left) - parseFloat(this.inner.style.borderLeftWidth) + 'px';

        // Push bottom up.
        if ( this.location === 2 )
            this.wrapper.style.top = parseFloat(this.wrapper.style.top) - parseFloat(this.inner.style.borderTopWidth) + 'px';

    };

    FauxBorder.prototype.applyInitialTransparentBorder = function() {
        var borderArray = this.properties.border.split(' ');
        var border = [ borderArray[0], borderArray[1], 'transparent' ].join(' ');
        this.applyRealBorder(border);
    };

    FauxBorder.prototype.applyRealBorder = function(border) {
        border = border || this.properties.border;

        if ( this.location === 0 )
            this.mainEl.style.borderTop = border;

        if ( this.location === 1 )
            this.mainEl.style.borderRight = border;
        
        if ( this.location === 2 )
            this.mainEl.style.borderBottom = border;
        
        if ( this.location === 3 )
            this.mainEl.style.borderLeft = border;
    };

    FauxBorder.prototype.destroy = function() {
        document.body.removeChild(this.wrapper);
    };

    FauxBorder.prototype.orientation = function() {
        if ( this.location === 0 || this.location === 2 ){
            return "horizontal";
        } else {
            return "vertical";
        }
    };

    FauxBorder.prototype.getRect = function() {
        var rect = this.mainEl.getBoundingClientRect();
        rect = { 
            top:        this.mainEl.offsetTop, 
            left:       rect.left, 
            right:      rect.right, 
            bottom:     this.mainEl.offsetTop + rect.height
        };

        return rect;
    };


    // BorderAnimate Object.
    //
    function BorderAnimate(){}

    BorderAnimate.prototype.run = function(selection, animationComplete) {

        var self                    = this;
        this.borderDelayCache       = [];
        this.borderAnimTimeCache    = [];

        // Iterate over elements.
        _.each(selection, function(el, i){
            var attrString      = _.getAttr('data-border-animate', el);
            var borderStrings   = _.borderStrings(attrString);
            var uid             = _.uid();

            // Iterate over top (0), right (1), bottom (2), left(2) and draw.
            _.each(borderStrings, function(border, index){  

                if ( ['none', 'null'].indexOf(border) == -1 ) { 
                    new FauxBorder({
                        mainEl: el,
                        borderString: border,
                        location: index
                    }).draw();

                    var delay       = parseFloat(border.split(',')[2]) || 0;
                    var animTime    = parseFloat(border.split(',')[1]) || 0;

                    self.borderDelayCache[uid] = self.borderDelayCache[uid] || delay;
                    self.borderDelayCache[uid] = delay > self.borderDelayCache[uid] ? delay : self.borderDelayCache[uid];

                    self.borderAnimTimeCache[uid] = self.borderAnimTimeCache[uid] || animTime;
                    self.borderAnimTimeCache[uid] = animTime > self.borderAnimTimeCache[uid] ? animTime : self.borderAnimTimeCache[uid];
                }

            });

            setTimeout(function(){
                animationComplete && animationComplete(el);
            }, self.borderDelayCache[uid] + self.borderAnimTimeCache[uid] );

        }); 

    };

    // Attach it to the window.
    window.BorderAnimate = BorderAnimate;

})(window);