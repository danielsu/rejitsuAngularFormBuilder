(function ( jasmine, describe, it, expect, beforeEach, afterEach, module, inject, angular ) {
    "use strict";
    describe( 'responsiveJitsUtilityHelpers', function () {

        beforeEach( module( 'rejitsuHelpers' ) );

        var mockedJQueryElement = {};
        mockedJQueryElement.outerWidth = function () {
            return '400';
        };
        mockedJQueryElement.css = function ( attr ) {
            if ( attr == 'fontSize' ) {
                return '14.44444px'
            } else {
                return false;
            }
        };

//        beforeEach( module( 'services', 'constantsModule' ) );
        describe( 'compare elements to pixel and em-values', function () {
            var rejitsuInstance;
            beforeEach( inject( function ( rejitsu ) {
                rejitsuInstance = rejitsu;
            } ) );
            it( 'should evaluate "undefined" to false', function () {
                var comparisonValue = undefined;
                var result = rejitsuInstance.isElementWiderThanPixelOrEmValue( mockedJQueryElement, comparisonValue );
                expect( result ).toBeFalsy();
            } );
            it( 'should evaluate "null" to false', function () {
                var comparisonValue = null;
                var result = rejitsuInstance.isElementWiderThanPixelOrEmValue( mockedJQueryElement, comparisonValue );
                expect( result ).toBeFalsy();
            } );
            it( 'should evaluate "some string without numbers" to false', function () {
                var comparisonValue = null;
                var result = rejitsuInstance.isElementWiderThanPixelOrEmValue( mockedJQueryElement, comparisonValue );
                expect( result ).toBeFalsy();
            } );
            it( 'should compare 400px to be greater than 20px (px-unit)', function () {
                var comparisonValue = '20px';
                var result = rejitsuInstance.isElementWiderThanPixelOrEmValue( mockedJQueryElement, comparisonValue );
                expect( result ).toBeTruthy();
            } );
            it( 'should compare 400px to be greater than 20em (em-unit)', function () {
                // 20em * 14.4 = 288px
                var comparisonValue = '20em';
                var result = rejitsuInstance.isElementWiderThanPixelOrEmValue( mockedJQueryElement, comparisonValue );
                expect( result ).toBeTruthy();
            } );
            it( 'should compare 400px to be (slightly) greater than 27.5em (em-unit)', function () {
                // 400px / 14.4 = 27.7777px
                var comparisonValue = '27.5em';
                var result = rejitsuInstance.isElementWiderThanPixelOrEmValue( mockedJQueryElement, comparisonValue );
                expect( result ).toBeTruthy();
            } );
            it( 'should compare 400px to be greater than 20 (without unit)', function () {
                var comparisonValue = '20';
                var result = rejitsuInstance.isElementWiderThanPixelOrEmValue( mockedJQueryElement, comparisonValue );
                expect( result ).toBeTruthy();
            } );
            it( 'should compare 400px to NOT be greater than 500px (px-unit)', function () {
                var comparisonValue = '500px';
                var result = rejitsuInstance.isElementWiderThanPixelOrEmValue( mockedJQueryElement, comparisonValue );
                expect( result ).toBeFalsy();
            } );
            it( 'should compare 400px to NOT be greater than 500em (em-unit)', function () {
                var comparisonValue = '500em';
                var result = rejitsuInstance.isElementWiderThanPixelOrEmValue( mockedJQueryElement, comparisonValue );
                expect( result ).toBeFalsy();
            } );
            it( 'should compare 400px to NOT be greater than 500 (without unit)', function () {
                var comparisonValue = '500';
                var result = rejitsuInstance.isElementWiderThanPixelOrEmValue( mockedJQueryElement, comparisonValue );
                expect( result ).toBeFalsy();
            } );
        } ); // describe utils
    } ); // describe rejitsu
}( jasmine, describe, it, expect, beforeEach, afterEach, module, inject, angular )); //IIFE