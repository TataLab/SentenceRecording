/*
	Construct by Pixelarity
	pixelarity.com | hello@pixelarity.com
	License: pixelarity.com/license
*/


(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Enable IE flexbox workarounds.
			if (skel.vars.IEVersion < 12)
				$body.addClass('is-ie');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly();

		// Highlights.
			$('.highlights > section')
				.each(function() {

					var	$this = $(this),
						$image = $this.find('.image'),
						$img = $image.find('img'),
						x;

					// Assign image.
						$image.css('background-image', 'url(' + $img.attr('src') + ')');

					// Set background position.
						if (x = $img.data('position'))
							$image.css('background-position', x);

					// Hide <img>.
						$img.hide();

				});


	});

})(jQuery);
