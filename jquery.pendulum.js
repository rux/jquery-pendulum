(function( $ ){

	$.fn.pendulum = function( options ) {  

		// Create some defaults, extending them with any options that were provided
		var settings = $.extend( {
			'startingAngle'	: 30,	// should be from -90 to 90 please
			'rodLength'		: 100,	// pixel length of displacement of the element downwards
			'damping'			:1.9,	// this tweaks the way in which the pendulum action decays
			'period'			:0.9,	// in seconds, for a complete swing and swing back
			'overallDuration'	:11.1	// in seconds for the complete animation to last
		}, options);


		// CSS Names
		//	.pendulum = overall construct (mainly for styling)
		//  .swinger = this thing is made to swing (for making things active).
		//	.pendulum-rod = The displacing element that connects the original
		// 					element to the pivot point of the pendulum
		//	.pendulum-bob = the part at the end of the rod, ie the element being pendulumised.

		return this.each(function() { 



			var $this = $(this),
				pendulum,
				rod;	


			if (!$this.hasClass("pendulum-bob") ) { // this stops us creating multiple pendulums on the same element
				pendulum = $("<div class='pendulum swinger'>"),
				rod = $("<div class='pendulum-rod'>");

				$this.addClass("pendulum-bob");
				$this.wrap(pendulum);
				$this.before(rod);
			} else {
				pendulum = $this.parent(),
				rod = pendulum.children(".pendulum-rod");
			}

			rod.css("height", settings.rodLength);



			startSwinging(settings.startingAngle, $this.parent());  // parent, because $this is the pendulum-bob


		});

	};
})( jQuery );