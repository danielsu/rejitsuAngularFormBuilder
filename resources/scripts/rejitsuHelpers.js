/**
 * Responsive JITS Utilities (ReJITSu)
 */
(function ( angular ) {
    "use strict";

    angular.module( 'rejitsuHelpers', [] )
            .factory( 'rejitsu', [
                function () {
                    // polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/contains
                    if ( !('contains' in String.prototype) ) {
                        String.prototype.contains = function ( str, startIndex ) {
                            return -1 !== String.prototype.indexOf.call( this, str, startIndex );
                        };
                    }

                    /**
                     *
                     * @param _jElement
                     * @param _emValue integer only, no 'em' extension
                     */
                    function compareElementWithEmValue( _jElement, _emValue ) {
                        // we have to parse the values
                        var elementWidthWithoutUnit = parseFloat( _jElement.outerWidth( true ) );
                        var fontSizeWithoutUnit = parseFloat( _jElement.css( 'fontSize' ) );
                        var pixelEquivalentValue = fontSizeWithoutUnit * _emValue;
                        return (elementWidthWithoutUnit > pixelEquivalentValue);
                    }

                    /**
                     * Compare width of an jQuery element to a given pixel or (responsive) em-value.
                     * @param _jElement jQuery element, needed for width and in case of em-value to get fontsize
                     * @param _comparisonPixelOrEmValue may contain 'em', 'px' or no unit
                     */
                    function isElementWiderThanPixelOrEmValue( _jElement, _comparisonPixelOrEmValue ) {
                        var elementWidthWithoutUnit;
                        var valueWithoutUnit = parseFloat( _comparisonPixelOrEmValue );
                        if ( !$.isNumeric( valueWithoutUnit ) ) {
                            return null;
                        }
                        if ( _comparisonPixelOrEmValue.contains( 'em' ) ) {
                            // pass to sub fantuion to handle em-unit
                            return compareElementWithEmValue( _jElement, valueWithoutUnit );
                        } else {
                            // any other suffix was stripped of
                            elementWidthWithoutUnit = parseFloat( _jElement.outerWidth( true ) );
                            return (elementWidthWithoutUnit > valueWithoutUnit);
                        }
                    }

                    return{
                        isElementWiderThanPixelOrEmValue: isElementWiderThanPixelOrEmValue
                    }
                }
            ] );
}( angular ));