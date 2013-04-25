/*
    Sticky Divider
    
    @author Kevin Jantzer
    @since 2013-03-29
    
    
    USE:
      $('.scrolling-el').stickyDividers()
    	
    Make sure your dividers are positioned as "relative" and they have a background
*/
(function($) {

	$.fn.stickyDividers = function( opts ) {  
	
		opts = opts || {};
	
		return this.each(function() {
		
			switch(opts){
			
				case 'destroy':
				case 'unbind':
					if( !this.opts ) return;
					(this.opts.dividers || $(this).find(this.opts.dividerClass)).css({top:'0'}); // put the dividers back
					$(this).unbind('scroll', onScroll);
					break;
			
				default: 
		
					this.opts = $.extend({
						dividerClass: '.sticky-divider',
						cacheDividers: true
					}, opts)
					
					if( opts.dividers )
						this.opts.dividers = opts.dividers;
						
					else if( this.opts.cacheDividers )
						this.opts.dividers = $(this).find(this.opts.dividerClass);
					
					$(this).unbind('scroll', onScroll);
					$(this).scroll(onScroll);
					
					break;
			}
		
		});
	
	};
	
		
	
	var onScroll = function(e){
		
		// get info on the scrolled element
		var scrollEl = e.currentTarget,
			scrollH = scrollEl.scrollHeight,
			scrollT = scrollEl.scrollTop,
			scrollDir = (scrollEl.prevTop||0) < scrollT ? 'down': 'up',
			$labelEl = scrollEl.opts.dividers || $(scrollEl).find(scrollEl.opts.dividerClass);
		
		// save the scroll top so we can figure out which way the user is scrolling
		scrollEl.prevTop = scrollT;
		
		// for each "Dynamic Divider" found...
		$labelEl.each(function(indx, el){
			
			// get info on this divider (position, height, etc)
			var elOffsetT = el.offsetTop,			// offset from top of scrolling el
				elT = parseInt(el.style.top||0),	// css "top" (zero or positive number)
				elOffsetTOrig = elOffsetT - elT,	// offset top from orginal position
				elH = el.offsetHeight,				// height of el
				elDiff = scrollT - elOffsetTOrig,	// how far from the top of the scrolling el?
				elB = elOffsetT + elH;				// offset from top of scrolling el relative to the bottom of this el
			
			
			// is this divider below the top of the scrolling div...then don't move it
			if( elOffsetTOrig > scrollT ){
			
				if( elT > 0 ) // if this divider has a top set more than zero, reset it back to zero (fix for scrolling too fast)
					el.style.top = 0;
					
				return;
			}
			
			// lets get the divder that will come next
			var nextEl = $labelEl[indx+1];
			
			// if there is one, lets do some checks
			if( nextEl ){
				
				// how far is this next divider from the scrolling el top?
				nextElOffsetH = nextEl.offsetTop - parseInt(nextEl.style.top||0);
				
				// if we are scrolling and this divider comes in "contact" with the next divider, don't move it
				if( (scrollDir == 'down' && nextElOffsetH <= elB)
				|| (scrollDir == 'up' && elOffsetT < scrollT))
					return;
			}
			
			// set the top of this divider so that it stays at the top of the scrolling el
			el.style.top = elDiff +'px';
			
		})
	
	}


})(jQuery);
