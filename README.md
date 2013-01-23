# jQuery Pendulum Plugin

## Overview

This plugin is used to add a danging pendulum effect to a targetted div.  It adds a containging .pendulum <div> around the selected element, a .pendulum-rod <div> immediately before it should you want to have a decoration showing the pendulum, and adds the class .pendulum-bob to the element itself.

It checks to see if an element has already been 'pendulumised' and if it has, calling it again will just activate the animation again.  Given that this plugin alters the shape of a div, may be worth manually constructing the aforementioned divs beforehand, so your content does not jump around, or calling .pendulum() at your document.onReady() with {startingAngle:0} as a parameter.

## Installing

Call the .js and the .css files from your html, as in the example.html file.


## Parameters

There are five.  Here they are, with their default vaules

- startingAngle (30) - angle in degrees, must be from -90 to +90
- rodLength (100) - size in pixels.  100 is a midpoint, and longer/shorter pendulums go slower/faster
- damping (1.9) - reflects how fast the SHM damping happens.  Large values mean not much damping
- period (0.9) - in seconds, time for a 100px pendulum to swing there and back
- overallDuration (11.1) - how many seconds will pass before the pendulum returns to exactly vertical

Pass these as an object to the .pendulum() method on a jquery object, eg for a shorter, faster pendulum than the defaults, this would work

$("myDiv").pendulum({
			'startingAngle' : 42,
			'rodLength' : 60,
			'damping' :1.8,
			'period' :0.8,
			'overallDuration' :10.1
})

## AOB

inspiration taken from http://daneden.me/labs/pendulum.html