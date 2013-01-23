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


		// functions for searching CSS
		// (1) - search the CSSOM for a specific rule
		function findCssRule(rule) {
			var ss = document.styleSheets;			// gather all stylesheets into an array
			for (var i = 0; i < ss.length; ++i) {	// loop through the stylesheets, and all the rules therein
				for (var j = 0; j < ss[i].cssRules.length; ++j) {
					// find the rule whose name matches our parameter and return that rule
					if (ss[i].cssRules[j].selectorText == rule)
						return ss[i].cssRules[j];
				}
			}
			return null;  // rule not found
		}

		// (2) - search the CSSOM for a specific -webkit-keyframe rule
		function findKeyframesRule(rule) {
			var ss = document.styleSheets;			// gather all stylesheets into an array
			for (var i = 0; i < ss.length; ++i) {	// loop through the stylesheets, and all the rules therein
				for (var j = 0; j < ss[i].cssRules.length; ++j) {
					// find the -webkit-keyframe rule whose name matches our parameter and return that rule
					if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule)
						return ss[i].cssRules[j];
				}
			}
			// rule not found
			return null;
		}

		console.log(document.styleSheets);

		var swingDurationRule = findCssRule(".swinger");



		// remove old keyframes and add new ones
		function change(anim, startingAngle) {
			// find our -webkit-keyframe rule
			var keyframes = findKeyframesRule(anim);
			
			// remove all of the existing % rules
			for (var key in keyframes) {
				var r = keyframes[key];
				if (r instanceof WebKitCSSKeyframeRule) {
					keyframes.deleteRule(r.keyText);
				}
			}
			

			swingDurationRule.style.webkitAnimationDuration = settings.overallDuration + "s"; // this may be overwritten by individual elements' swing rate, using modifySwingByPendulumLength()

			var swingTime = settings.period/2;
			// this generates keyframes for the animation.  The whole animation is mapped out
			// before the animation starts, the end angles being calculated at the relevant
			// intervals.
			// uncomment the comment to see the numbers.  They are kinda pretty, and good for
			// debugging if you want to tweak the settings.
			for (var time=0; time <= settings.overallDuration; time=time+swingTime) {
				var pc = time* (100/settings.overallDuration);
				var angle = getAngle(startingAngle, settings.period, time, settings.damping);
				// console.log("percent is " + pc + "% and time is " + time + ".  The new angle is " + angle);
				keyframes.insertRule( pc + "% { -webkit-transform: rotate("+angle+"deg); }");
			}
			// create rules
			keyframes.insertRule("100% { -webkit-transform: rotate(0deg); }"); // helps remove 'leaps' at the end


			// assign a modifier for duration, so larger pendulums swing slower
			$('.swinger').each( function() {
				modifySwingByPendulumLength( $(this) );
			});


			// assign the animation to our element (which will cause the animation to run)
			$('.swinger').each( function() { this.style.webkitAnimationName = anim; } );

			$(".swinger").each( function() { $(this).css("webkit-transform", "rotate(0deg)"); } );
		}

		// begin the new animation process
		function startSwinging( angle , elements) {
			// remove the old animation from our object
			elements.each( function() { this.style.webkitAnimationName = "none"; } );
			// correct for swings that are too large
			if (angle < -90) {angle = -90;}
			if (angle > 90) {angle = 90;}

			// call the change method, which will update the keyframe animation
			setTimeout( function(){
				change("swinging", angle);
			}, 0);
		}



		function getAngle(Θ, period, time, decayConstant) {
			// physics note - decayConstant should be really big for small damping.  Period is for a whole cycle.
			var angle = Θ * Math.exp(-time/decayConstant) * Math.cos((2* Math.PI * time) / period);
			return angle
		}

		function modifySwingByPendulumLength(pendulum) {
			// we're nominally shooting for 100px to be the "standard" pendulum (but set
			// it to any sensible value that's required to tune it), so deviation from that
			// length causes a modification in the overall time that the animation will take.
			var length = pendulum.outerHeight();
			var baselineLength = 100;
			var baselineDuration = parseFloat(swingDurationRule.style.webkitAnimationDuration.substr(0, swingDurationRule.style.webkitAnimationDuration.length-1));
			var ratio = Math.sqrt(pendulum.outerHeight()) / Math.sqrt(baselineLength);
			pendulum.css("webkitAnimationDuration", baselineDuration * ratio + "s");
		}





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

				pendulum.css("width", $this.outerWidth(true));

				$this.addClass("pendulum-bob");
				$this.wrap(pendulum);
				$this.before(rod);
			} else {
				pendulum = $this.parent(),
				rod = pendulum.children(".pendulum-rod");
			}

			rod.css("height", settings.rodLength);



			startSwinging(settings.startingAngle, $this.parent());  // parent, because '$this' is the .pendulum-bob




		});

	};
})( jQuery );