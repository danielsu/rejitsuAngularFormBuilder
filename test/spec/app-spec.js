(function ( jasmine, describe, it, expect, beforeEach, afterEach, module, inject, angular ) {
    "use strict";
    describe( 'jits angular app', function () {
        var $rootScope;

        // Load the myApp module, which contains the directive
        beforeEach( module( 'jitsApp' ) );
        /*
         * if there are any broken file links the jitsApp will throw errors
         * use 'mvn jasmine:test -Ddebug' for error details
         */

        // Store references to $rootScope and $compile
        // so they are available to all tests in this describe block
        beforeEach( inject( function ( _$compile_, _$rootScope_ ) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $rootScope = _$rootScope_;
        } ) );

        it( 'should load app, modules and file dependencies and initialize successfully', function () {
            expect( $rootScope ).toBeDefined();
        } );
    } ); // describe app
}( jasmine, describe, it, expect, beforeEach, afterEach, module, inject, angular )); //IIFE
