( function () {
	'use strict';

	$( 'a.page-scroll' ).click( function () {
		if ( location.pathname.replace( /^\//, '' ) == this.pathname.replace( /^\//, '' ) && location.hostname == this.hostname ) {
			var target = $( this.hash );
			target = target.length ? target : $( '[name=' + this.hash.slice( 1 ) + ']' );
			if ( target.length ) {
				$( 'html,body' ).animate( {
					scrollTop: target.offset().top
				}, 900 );
				return false;
			}
		}
	} );

	// Portfolio isotope filter
	$( window ).load( function () {
		var $container = $( '.portfolio-items' );
		$container.isotope( {
			filter: '*',
			animationOptions: {
				duration: 750,
				easing: 'linear',
				queue: false
			}
		} );
		$( '.cat a' ).click( function () {
			$( '.cat .active' ).removeClass( 'active' );
			$( this ).addClass( 'active' );
			var selector = $( this ).attr( 'data-filter' );
			$container.isotope( {
				filter: selector,
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				}
			} );
			return false;
		} );

	} );

	var typesContainer = $( '#types-container' ),
		itemsContainer = $( '#items-container' ),
		itemModal = $( '#item-modal' ),
		itemModalContent = $( '#item-modal-content' ),
		itemModalTitle = $( '#item-modal-title' ),
		items = [];

	// Remove content of modal on close
	itemModal.on( 'hidden.bs.modal', function () {
		itemModalContent.html( '' );
	} );

	$.get( 'data/data.json', function ( result ) {
		if ( !result || result.length === 0 || !result.hasOwnProperty( 'items' ) ) {
			return;
		}

		// Save items for later use
		items = result.items;

		// Get unique types and display item contents
		var uniqueTypes = [];
		result.items.forEach( function ( item, index ) {
			if ( uniqueTypes.indexOf( item.type ) === -1 ) {
				uniqueTypes.push( item.type );
			}

			// Build item markup then append to container
			var html = '<div class="col-sm-6 col-md-4 ' + item.type + '">';
			html += '<div class="portfolio-item">';
			html += '<div class="hover-bg"><a href="#" class="js-open-modal" data-index="' + index + '" title="' + item.title + '">';
			html += '<div class="hover-text">';
			html += '<div class="overlay-caption">';
			html += '<div class="overlay-content">';
			html += '<h4>' + item.title + '</h4>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<img src="' + item.thumbnail_image + '" class="img-responsive" alt="' + item.title + '"> </a> </div>';
			html += '</div>';
			html += '</div>';

			itemsContainer.append( html );

			// Initialize modal trigger
			$( '.js-open-modal' ).click( function ( event ) {
				event.preventDefault();
				var index = $( this ).data( 'index' ),
					content = '';

				// Show content to modal
				switch ( items[index].type ) {
					case 'music':
						content += '<p><div class="embed-responsive embed-responsive-16by9"><iframe src="' + items[index].embed_url + '" class="embed-responsive-item" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div></p>';
						break;
					default:
						content += '<p><img src="' + items[index].image + '" class="img-responsive"></p>';
						break;
				}

				content += '<p>' + items[index].description + '</p>';

				if ( items[index].type === 'web' ) {
					content += '<p class="text-center"><a class"btn btn-primary" target="_blank" rel="noreferrer nofollow" href="' + items[index].url + '">Visit site</a></p>'
				}

				itemModalContent.html( content );
				itemModalTitle.html( items[index].title );

				itemModal.modal( 'show' );
			} );
		} );

		// Display types
		if ( uniqueTypes.length > 0 ) {
			uniqueTypes.forEach( function ( item ) {
				typesContainer.append( '<li><a href="#" data-filter=".' + item + '">' + item + '</a></li>' );
			} );
		}
	} );
}() );