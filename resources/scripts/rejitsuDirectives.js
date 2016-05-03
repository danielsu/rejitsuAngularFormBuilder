(function ( angular, _ ) {
    "use strict";

    angular.module( "rejitsuDirectives", ['rejitsuHelpers'] )
            .constant( "PARTIALS_PATH", "partials/" )
            .directive( "rejitsuElementBreakpoints", [
                'rejitsu',
                '$rootScope',
                function ( rejitsu, $rootScope ) {
                    /*
                     Rejitsu Element Breakpoints
                     is an directive which adds or removes classes depending on the available dimensions of this widget.
                     This allows responsive design on elementary level and decouples its design from page break points.

                     Configuration:
                     Add HTML-attribute 'element-breakpoints' which contains a JSON array containing objects with minWidth and className attributes
                     e.g.
                     <rejitsu-auto-styling-widget
                     class="..."
                     element-breakpoints="[{minWidth:'30em',className:'mediumView'},{minWidth:'60em',className:'largeView'}]"
                     ... content to be included ...
                     </rejitsu-auto-styling-widget>
                     */

                    return {
                        restrict: "A", // E-lement, A-ttribute or C-lassname
                        link: function link( scope, element, attrs ) {
//                            'attrs' contains attribute values from html tag
//                          HTML attribute contains values with singlequotes, so replace them by double quotes for JSON parse
                            var breakpointList = JSON.parse( attrs.rejitsuElementBreakpoints.replace( /'/g, '"' ) );

                            // set debounced eventlistener on window resize, debounce to reduce DOM intensive operations
                            window.addEventListener( 'resize', _.debounce( setWidgetStyle, 250 ) );
                            function setWidgetStyle() {
                                var currentWidth,
                                        currentClassName,
                                        classToAdd = "",
                                        lastPositiveClassName = "",
                                        classesToRemove = "";
                                for ( var i = 0; i < breakpointList.length; i++ ) {
                                    currentWidth = breakpointList[i].minWidth;
                                    currentClassName = breakpointList[i].className;
                                    if ( rejitsu.isElementWiderThanPixelOrEmValue( element.parent(), currentWidth ) ) {
                                        classToAdd = currentClassName;
                                        classesToRemove = classesToRemove + ' ' + lastPositiveClassName;
                                        lastPositiveClassName = currentClassName;
                                    } else {
                                        // remove, in case it was set
                                        classesToRemove = classesToRemove + ' ' + currentClassName;
                                    }
                                }
                                // keep only the last positive match, so remove last positive match,
                                // otherwise for the greatest breakpoint all classes would be added
                                console.log( 'widget +"' + classToAdd + '" and -"' + classesToRemove + '"' );
                                // only 2 DOM manipulations for all class updates on this widget
                                element.addClass( classToAdd )
                                        .removeClass( classesToRemove );

                                $rootScope.$broadcast( 'elementClassChanged' );
                            }

                            // call once to init
                            setWidgetStyle();
                        }
                    }
                }] )
            .directive( 'rejitsuFormBuilder', [
                '$compile',
                '$rootScope',
                'rejitsu',
                function ( $compile, $rootScope, rejitsu ) {
                    return{
                        restrict: 'EA',
                        template: '<h1>form builder dummy template to be replaced by link function</h1>',
                        link: function ( scope, element, attrs ) {
                            // attrs
                            // * formStyle
                            // * schema
                            // * submitFunction
                            var PARAM_SCHEMA = attrs.schema,
                                    PARAM_FORM_STYLE = attrs.formStyle,
                                    PARAM_SUBMIT_FN_STRING = attrs.submitFunction,

                                    FORM_NAME_FALLBACK = 'rejitsuForm',
                                    EMPTY_TYPE_FALLBACK = 'text';

                            var formInputDefinitions, dotNotatedString, tempSchemaObject, topLevelFormName,
                                    formHtml, groupHtmlHolder, formGroupPrefix, formGroupSuffix, commonAttrs, elementLabel, debugModelBox;

                            // Model Object
                            // = formData + topLevelFormName+'.' + fieldElement.name + '
                            // e.g. form name = myForm --> formDatamyForm

                            // has schema data at all?
                            if ( PARAM_SCHEMA.indexOf( '.' ) == -1 ) {
                                formInputDefinitions = scope[PARAM_SCHEMA];
                            } else {
                                dotNotatedString = PARAM_SCHEMA.split( '.' );
                                // walk down the dot notated object path
                                tempSchemaObject = scope;
                                for ( var i = 0; i < dotNotatedString.length; i++ ) {
                                    tempSchemaObject = tempSchemaObject[dotNotatedString[i]];
                                }
                                formInputDefinitions = tempSchemaObject;
                            }


                            if ( !formInputDefinitions ) {
                                element.html( getErrorAsHTML( 'Kein Formularschema gefunden. Sind die Variablennamen korrekt?' ) );
                                return;
                            }


                            // has fields data at all?
                            if ( !isArrayWithData( formInputDefinitions.fields ) ) {
                                element.html( getErrorAsHTML( 'Kein Definitionen von Feldern gefunden. Sind die Variablennamen korrekt?' ) );
                                return;
                            }

                            // introduce form data object
                            topLevelFormName = formInputDefinitions.formName || FORM_NAME_FALLBACK;

                            debugModelBox = '';
                            formHtml = '';
                            formGroupPrefix = '<div class="form-group">'; // may be modified down below
                            formGroupSuffix = '</div>';
                            formHtml = '<form id="' + topLevelFormName + '" name="' + topLevelFormName + '" class="' + PARAM_FORM_STYLE + '">';


                            // start parsing the entries
                            formHtml += parseFieldDefinitionArray( formInputDefinitions.fields );

                            // debug info textarea
//                            formHtml += '<textarea class="form-control debug" rows="20">' + debugModelBox + '</textarea>';

                            formHtml += generateSubmitButton();
                            // close form
                            formHtml += '</form>';

                            // compile code to evaluate containing ng-expressions
                            element.html( $compile( formHtml )( scope ) );

                            /*******************
                             * Input Type Helpers
                             *******************/

                            function parseFieldDefinitionArray( definitionArray ) {
                                var definitionHtml = '';

                                // ... iterate over all
                                definitionArray.forEach( function ( elementDefinition ) {
                                    if ( elementDefinition.groupName ) {
                                        definitionHtml += parseGroupElement( elementDefinition );

                                    } else {
                                        definitionHtml += parseSingleFieldElement( elementDefinition );
                                    }
                                } );
                                return definitionHtml;
                            }

                            function parseGroupElement( groupElement ) {


                                var groupHtml = '<fieldset name="' + groupElement.groupName + '">' +
                                        '<legend>' + (groupElement.groupLabel || groupElement.groupName) + '</legend>';
                                // recursive calls
                                if ( isArrayWithData( groupElement.fields ) ) {
                                    groupHtml += parseFieldDefinitionArray( groupElement.fields );
                                } else {
                                    groupHtml += getErrorAsHTML( 'Kein Definitionen von Feldern gefunden. Sind die Variablennamen korrekt?' );
                                }

                                //TODO insert fields

                                groupHtml += '</fieldset>';
                                return groupHtml;
                            }

                            function parseSingleFieldElement( fieldElement ) {
                                // add variable to form data object

                                // generate HTML fields
                                var id, idStr, label, modelStr, styleStr, nameStr, requiredStr, readonlyStr, placeholderStr,
                                        commonAttrs, labelTag, labelTextOnly, showWhenStr, extraAttributes, tooltipStr;
                                id = topLevelFormName + '_' + (fieldElement.id || fieldElement.name);
                                idStr = ' id="' + id + '"';
                                labelTextOnly = (fieldElement.label || fieldElement.name);
                                labelTag = '<label for="' + id + '" class="control-label">' + labelTextOnly + '</label>';
                                // variable 'models' will be created by angular
                                modelStr = ' ng-model="' + 'formData' + topLevelFormName + '.' + fieldElement.name + '"';
                                styleStr = ' class="form-group"';
                                nameStr = ' name="' + (fieldElement.name) + '"';
                                requiredStr = fieldElement.required ? ' required' : '';
                                readonlyStr = fieldElement.readonly ? ' readonly' : '';
                                tooltipStr = (fieldElement.help ? ' tooltip="' + fieldElement.help + '"' : '');
                                placeholderStr = (fieldElement.placeholder ? ' placeholder="' + fieldElement.placeholder + '"' : '');
                                extraAttributes = fieldElement.addAttributes || '';
                                commonAttrs = idStr + ' '
                                        + nameStr + ' '
                                        + modelStr + ' '
                                        + requiredStr + ' '
                                        + readonlyStr + ' '
                                        + placeholderStr + ' '
                                        + tooltipStr + ' '
                                        + extraAttributes + ' '
                                        + styleStr;

                                showWhenStr = (fieldElement.showWhen ? ' ng-show="' + fieldElement.showWhen + '"' : '');
                                formGroupPrefix = showWhenStr ? '<div class="form-group"' + showWhenStr + '>' : '<div class="form-group">';

                                debugModelBox += labelTextOnly + ': {{formData' + topLevelFormName + '.' + fieldElement.name + '}} \n';


                                // local type to avoid manipulation with empty-default-fallback on soruce data
                                var localType = (fieldElement.type ? fieldElement.type : EMPTY_TYPE_FALLBACK);
                                switch ( localType ) {
                                    case 'submit':
                                        return generateSubmitButton( fieldElement, commonAttrs, labelTextOnly );
                                        break;
                                    case 'button':
                                        return generateButton( fieldElement, commonAttrs, labelTextOnly );
                                        break;
                                    case 'checkbox':
                                        return generateCheckbox( fieldElement, commonAttrs, labelTag );
                                        break;
                                    case 'select':
                                        return generateSelect( fieldElement, commonAttrs, labelTag );
                                        break;
                                    case 'textarea':
                                        return generateTextarea( fieldElement, commonAttrs, labelTag );
                                        break;
                                    case 'radio':
                                        return generateRadio( fieldElement, commonAttrs, labelTextOnly );
                                        break;
                                    case 'text':
                                        return generateInput( fieldElement, commonAttrs, labelTag );
                                        break;
                                    default:
                                        console.warn( 'form builder: fallback to handle type:' + localType );
                                        return generateInput( fieldElement, commonAttrs, labelTag );
                                        break;
                                }
                            }

                            function generateInput( fieldMetaData, attrs, labelElement ) {
                                return formGroupPrefix + ' '
                                        + labelElement + ' '
                                        + '<input' + ' type="' + (fieldMetaData.type || 'text') + '"' + ' class="form-control" ' + attrs + '> '
                                        + formGroupSuffix;
                            }

                            function generateTextarea( fieldMetaData, attrs, labelElement ) {
                                var rowString = ' rows="' + (fieldMetaData.rows || 3) + '" ';
                                return formGroupPrefix + ' '
                                        + labelElement + ' '
                                        + '<textarea class="form-control" ' + attrs + rowString + '></textarea>'
                                        + formGroupSuffix;
                            }

                            function generateSelect( fieldMetaData, attrs, labelElement ) {
                                var optionTags = '';
                                if ( angular.isArray( fieldMetaData.options ) ) {
                                    // angular.forEach iterates over arrays and objects, returns (value 1st, key 2nd)
                                    angular.forEach( fieldMetaData.options, function ( optValue ) {
                                        if ( angular.isObject( optValue ) ) {
                                            optionTags += '<option value="' + optValue.value + '">' + optValue.label + '</option>';
                                        } else {
                                            optionTags += '<option>' + optValue + '</option>';
                                        }
                                        //todo to avoid additional empty item, select first one
                                        // http://stackoverflow.com/questions/12654631/why-does-angularjs-include-an-empty-option-in-select
//                                        localFormData[fieldMetaData.name] = fieldMetaData.options[0];
                                    } );
                                }

                                return formGroupPrefix + ' '
                                        + labelElement + ' '
                                        + '<select class="form-control"' + attrs + '> ' + optionTags + '</select>'
                                        + formGroupSuffix;
                            }

                            /**
                             *
                             * @param fieldMetaData
                             * @param attrs
                             * @param labelTextOnly text only, NO tag as radio group has multiple IDs
                             */
                            function generateRadio( fieldMetaData, attrs, labelTextOnly ) {
                                var radioTags = '';
                                if ( angular.isArray( fieldMetaData.options ) ) {
                                    // angular.forEach iterates over arrays and objects, returns ( value 1st, key 2nd)
                                    angular.forEach( fieldMetaData.options, function ( optValue, key ) {
                                        // replace group id with local suffixes
                                        var attrsWithLocalID = addSuffixToIdString( attrs, key );
                                        var label, value;
                                        if ( angular.isObject( optValue ) ) {
                                            value = optValue.value;
                                            label = optValue.label;
                                        } else {
                                            value = optValue;
                                            label = optValue;
                                        }
                                        radioTags += '<div class="radio"><label>'
                                                + '<input type="radio" ' + attrsWithLocalID + ' value="' + value + '">' + label
                                                + '</label></div>';
                                    } );
                                }

                                return formGroupPrefix + ' '
                                        + '<label>' + labelTextOnly + '</label> '
                                        + radioTags
                                        + formGroupSuffix;
                            }

                            function generateButton( fieldMetaData, attrs, labelTextOnly ) {
                                var elementHtml = '<button type="button" ';
                                elementHtml += '>'; // close opening tag
                                // label
                                elementHtml += labelTextOnly;
                                // maybe include images etc to button
                                elementHtml += '</button>';
                                // TODO button click handler
                                return elementHtml;
                            }

                            function generateSubmitButton( fieldMetaData, attrs, labelTextOnly ) {
                                var elementHtml = '<button type="submit" ';
                                // click handler
                                elementHtml += 'ng-click="' + PARAM_SUBMIT_FN_STRING + '(formData' + topLevelFormName + ', ' + topLevelFormName + '.$valid)"';
                                elementHtml += '>'; // close opening tag
                                // label
                                elementHtml += 'absenden';
                                // maybe include images etc to button
                                elementHtml += '</button>';
                                return elementHtml;
                            }

                            /*
                             * Bootstrap Checkbox has different HTML structure then input fields
                             */
                            function generateCheckbox( fieldMetaData, attrs, labelElement ) {
                                var checkBoxPrefix = '<div class="checkbox">';
                                var checkBoxSuffix = '</div>';
                                var hasArrayOfValues = (angular.isArray( fieldMetaData.options ));
                                var checkboxTags = '';
                                if ( hasArrayOfValues ) {
                                    // angular.forEach iterates over arrays and objects, returns ( value 1st, key 2nd)
                                    angular.forEach( fieldMetaData.options, function ( optValue, key ) {
                                        // replace group id with local suffixes
                                        var attrsWithLocalID = addSuffixToIdString( attrs, key );
                                        var label, value;
                                        if ( angular.isObject( optValue ) ) {
                                            value = optValue.value;
                                            label = optValue.label;
                                        } else {
                                            value = optValue;
                                            label = optValue;
                                        }
                                        checkboxTags += checkBoxPrefix + ' '
                                                + '<label><input type="checkbox" ' + attrsWithLocalID + ' value="' + value + '"> ' + label + '</label>'
                                                + checkBoxSuffix;
                                        console.warn( 'form builder: multi select checkboxes have same ID, how to handle server side?' );
                                    } );
                                    return labelElement + checkboxTags;
                                } else {
                                    // handle single checkbox, no upper label
                                    return checkBoxPrefix + ' '
                                            + '<label><input type="checkbox" ' + attrs + '> ' + fieldMetaData.label + '</label>' + ' '
                                            + checkBoxSuffix;
                                }
                            }

                            /**
                             * Search id string and append the suffix.
                             * @param attributeStr
                             * @param suffix
                             * @returns {String} with sufficed ID
                             */
                            function addSuffixToIdString( attributeStr, suffix ) {
                                return attributeStr.replace( /id="(\w+)"/i, 'id="$1_' + suffix + '"' );
                            }

                            function getErrorAsHTML( msg ) {
                                console.warn( msg );
                                return '<span class="error">FEHLER: ' + msg + '</span>';
                            }

                            function isArrayWithData( arrayToTest ) {
                                return arrayToTest && angular.isArray( arrayToTest ) && arrayToTest.length > 0;
                            }
                        }

                    }
                }
            ] );
}( angular, _ ));