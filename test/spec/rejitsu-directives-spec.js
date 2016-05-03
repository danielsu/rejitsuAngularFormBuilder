(function ( jasmine, describe, it, expect, beforeEach, afterEach, module, inject, angular ) {
    "use strict";
    describe( 'responsiveJitsUtilityDirectives', function () {
        var $compile, $rootScope;

        // https://docs.angularjs.org/guide/unit-testing

        // following structure for directive tests
        // 1) Compile a piece of HTML containing the directive
        //    var element = $compile( directiveTag )( $rootScope );
        // 2) fire all the watches, so the scope expression {{1 + 1}} will be evaluated
        //    $rootScope.$digest();
        // 3) Check that the compiled element contains the templated content
        //    expect(...)


        // ATTR - jquery: element.attr('name') for attributes with values, returns undefined if no value is set
        // PROP - jquery: element.prop('name') for properties without values, e.g. disabled, selected, checked


        // Load the myApp module, which contains the directive
        beforeEach( module( 'jitsApp' ) );
//        beforeEach( module( 'rejitsuDirectives' ) );

        // Store references to $rootScope and $compile
        // so they are available to all tests in this describe block
        beforeEach( inject( function ( _$compile_, _$rootScope_ ) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        } ) );

        describe( 'formBuilder', function () {
            function getTypeOfElement( jElement ) {
                return jElement.attr( 'type' ) || jElement.prop( 'tagName' ).toLowerCase();
            }

            var element,
                    DEFAULT_FORM_NAME = 'testForm',
                    DEFAULT_FORM_NAME_WITH_SUFFIX = 'testForm_',
                    DEMO_NAME = 'demoFieldName',
                    DEMO_LABEL = 'Kundenabnahme durch',
                    DIRECTIVE_TAG = '<div rejitsu-form-builder form-style="" submitFunction="submitFn" schema="formMetaData"></div>';

            /*********************************
             * BASIC FORM HANDLING
             *********************************/
            describe( 'basic form handling', function () {

                it( 'should show error if no data is given at all', function () {
                    $rootScope.formMetaData = undefined; // intentionally undefined
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( "FEHLER:" );
                    expect( element.find( 'span' ).hasClass( 'error' ) ).toBeTruthy();
                } );

                it( 'should show error if form defined but field data is missing', function () {
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: undefined // intentionally undefined
                    };
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( "FEHLER:" );
                    expect( element.find( 'span' ).hasClass( 'error' ) ).toBeTruthy();
                } );

                it( 'should show error if form defined but field data is empty', function () {
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [] // intentionally undefined
                    };
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( "FEHLER:" );
                    expect( element.find( 'span' ).hasClass( 'error' ) ).toBeTruthy();
                } );

                it( 'should find (flat) data object and create a form tag', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        fields: [
                            {name: DEMO_NAME, label: DEMO_LABEL}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( "<form" );
                    expect( element.html() ).toContain( "</form>" );

                } );

                it( 'should find (nested) data object and create a form tag', function () {
                    // add form schema data to scope
                    $rootScope.task = {};
                    $rootScope.task.content = {};
                    $rootScope.task.content.formMetaData = {
                        fields: [
                            {name: DEMO_NAME, label: DEMO_LABEL}
                        ]};
                    var modified_directive_tag = '<div rejitsu-form-builder form-style="" submitFunction="submitFn" schema="task.content.formMetaData"></div>';
                    element = $compile( modified_directive_tag )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( "<form" );
                    expect( element.html() ).toContain( "</form>" );

                } );

                it( '[form w/o name] should create a form with given name', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        fields: [
                            {name: DEMO_NAME, label: DEMO_LABEL}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.find( 'form' ).attr( 'name' ) ).toContain( "rejitsuForm" );
                } );

                it( 'should create a form tag', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, label: DEMO_LABEL}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.find( 'form' ).attr( 'name' ) ).toContain( DEFAULT_FORM_NAME );

                } );
            } );

            /*********************************
             * INPUT TYPES
             *********************************/
            describe( 'input types', function () {

                it( '[type default] no type should create input type text', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( "form-group" );
                    expect( element.html() ).toContain( "<input" );
                    var compiledField = element.find( 'input' );
                    expect( compiledField.attr( 'name' ) ).toBe( DEMO_NAME );
                    expect( getTypeOfElement( compiledField ) ).toBe( 'text' );
                } );

                it( '[type textarea] should create input type textarea with default row count', function () {
                    var setDefaultRowCount = '3';
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, type: 'textarea', rows: setDefaultRowCount}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( "form-group" );
                    // due to another debug-textarea use more specified query
                    var compiledTextarea = element.find( '#' + DEFAULT_FORM_NAME_WITH_SUFFIX + DEMO_NAME );
                    expect( getTypeOfElement( compiledTextarea ) ).toBe( 'textarea' );
                    expect( compiledTextarea.attr( 'name' ) ).toBe( DEMO_NAME );
                    expect( compiledTextarea.attr( 'rows' ) ).toBe( setDefaultRowCount );
                } );

                it( '[textarea with rows] attribute given should be inserted', function () {
                    var setRowCount = '42';
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, type: 'textarea', rows: setRowCount}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    // due to another debug-textarea use more specified query
                    var compiledTextarea = element.find( '#' + DEFAULT_FORM_NAME_WITH_SUFFIX + DEMO_NAME );
                    expect( getTypeOfElement( compiledTextarea ) ).toBe( 'textarea' );
                    expect( compiledTextarea.attr( 'name' ) ).toBe( DEMO_NAME );
                    expect( compiledTextarea.attr( 'rows' ) ).toBe( setRowCount );
                } );


                it( '[type single checkbox] should create input type checkbox', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, type: 'checkbox'}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( "form-group" );
                    expect( element.html() ).toContain( 'class="checkbox"' );
                    // due to another debug-textarea use more specified query
                    var compiledField = element.find( 'input' );
                    expect( compiledField.attr( 'name' ) ).toBe( DEMO_NAME );
                    expect( getTypeOfElement( compiledField ) ).toBe( 'checkbox' );
                } );

                it( '[type multi checkbox] should create multiple inputs type checkboxes', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, type: 'checkbox', option: {

                            }}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( "form-group" );
                    expect( element.html() ).toContain( 'class="checkbox"' );
                    // due to another debug-textarea use more specified query
                    var compiledField = element.find( 'input' );
                    expect( compiledField.attr( 'name' ) ).toBe( DEMO_NAME );
                    expect( getTypeOfElement( compiledField ) ).toBe( 'checkbox' );
                } );


                xit( '[type radio w/o data] should create warning if no options given', function () {
                    expect( false ).toBeTruthy();
                } );

                xit( '[type radio with options] should create multiple inputs type radio', function () {
                    expect( false ).toBeTruthy();
                } );

                xit( '[type select w/o data] should create warning if no options given', function () {
                    expect( false ).toBeTruthy();
                } );

                xit( '[type select with options] should create type select with options', function () {
                    expect( false ).toBeTruthy();
                } );
            } );

            /*********************************
             * ATTRIBUTES and PROPERTIES
             *********************************/
            describe( 'attributes and properties', function () {
                it( '[id default] no id should create id from name', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, label: DEMO_LABEL}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.find( 'input' ).attr( 'id' ) ).toBe( DEFAULT_FORM_NAME_WITH_SUFFIX + DEMO_NAME );
                } );

                it( '[id given] should create id with this value', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, id: 'ownID', label: DEMO_LABEL}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.find( 'input' ).attr( 'id' ) ).toBe( DEFAULT_FORM_NAME_WITH_SUFFIX + 'ownID' );
                } );

                it( '[label default] no label should create label from name', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.find( 'label' ).html() ).toContain( DEMO_NAME );
                } );

                it( '[label given] should create label with this value', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, label: DEMO_LABEL}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( "form-group" );
                    expect( element.html() ).toContain( "<input" );
                    expect( element.find( 'input' ).attr( 'name' ) ).toBe( DEMO_NAME );

                    expect( element.html() ).toContain( "<label" );
                    expect( element.find( 'label' ).html() ).toBe( DEMO_LABEL );
                } );

                it( '[minimal working example] w/o type, label, attributes should create input text with label', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( "form-group" );
                    expect( element.html() ).toContain( "<input" );
                    var compiledField = element.find( 'input' );
                    expect( compiledField.attr( 'name' ) ).toBe( DEMO_NAME );
                    expect( getTypeOfElement( compiledField ) ).toBe( 'text' );
                    expect( element.html() ).toContain( "<label" );
                    expect( element.find( 'label' ).html() ).toContain( DEMO_NAME );

                    // negative match
                    expect( element.find( 'input' ).prop( 'readonly' ) ).not.toBeTruthy();
                } );


                it( '[required] property given should be inserted', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, required: true}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.find( 'input' ).prop( 'required' ) ).toBeTruthy();
                    // negative match
                    expect( element.find( 'input' ).prop( 'disabled' ) ).not.toBeTruthy();
                } );

                it( '[readonly] property given should be inserted', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, readonly: true}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.find( 'input' ).prop( 'readonly' ) ).toBeTruthy();
                    // negative match
                    expect( element.find( 'input' ).prop( 'disabled' ) ).not.toBeTruthy();
                } );

                it( '[placeholder] attribute given should be inserted', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, placeholder: 'Placeholder Demo Text'}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.find( 'input' ).attr( 'placeholder' ) ).toBe( 'Placeholder Demo Text' );
                    // negative match
                    expect( element.find( 'input' ).prop( 'readonly' ) ).not.toBeTruthy();
                } );

                it( '[help] attribute given should be inserted', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, help: 'Help Demo Text'}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.find( 'input' ).attr( 'tooltip' ) ).toBe( 'Help Demo Text' );
                    // negative match
                    expect( element.find( 'input' ).prop( 'readonly' ) ).not.toBeTruthy();
                } );


                it( '[ngShow] should create input with given ng attribute', function () {
                    var showString = '1 < 42';
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, showWhen: showString}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.find( 'input' ).parent().attr( 'ng-show' ) ).toBe( showString );
                } );


                it( '[custom attributes] should create input with given attributes', function () {
                    var clickFunctionString = 'alert(\'hello world\')';
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME, addAttributes: 'ng-click="' + clickFunctionString + '"'}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.find( 'input' ).attr( 'ng-click' ) ).toBe( clickFunctionString );
                } );

                it( '[full featured] should create text input with all given, possible attributes and properties', function () {
                    var placeholderString = 'Placeholder Demo Text',
                            helpString = 'Help Demo Text',
                            customId = 'myCustomID',
                            inputType = 'text',
                            showString = '1 < 42',
                            clickFunctionString = 'alert(\'hello world\')';
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {
                                name: DEMO_NAME,
                                label: DEMO_LABEL,
                                id: customId,
                                type: inputType,
                                help: helpString,
                                placeholder: placeholderString,
                                showWhen: showString,
                                addAttributes: 'ng-click="' + clickFunctionString + '"',
                                readonly: true,
                                required: true
                            }
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( '<input' );

                    var labelEl = element.find( 'label' );
                    expect( labelEl.html() ).toBe( DEMO_LABEL );

                    var inputEl = element.find( 'input' );
                    expect( inputEl.attr( 'name' ) ).toBe( DEMO_NAME );
                    expect( inputEl.attr( 'id' ) ).toBe( DEFAULT_FORM_NAME_WITH_SUFFIX + customId );
                    expect( getTypeOfElement( inputEl ) ).toBe( inputType );
                    expect( inputEl.attr( 'tooltip' ) ).toBe( helpString );
                    expect( inputEl.attr( 'placeholder' ) ).toBe( placeholderString );

                    expect( inputEl.attr( 'ng-click' ) ).toBe( clickFunctionString );
                    expect( inputEl.attr( 'ng-model' ) ).toBeDefined();

                    expect( inputEl.prop( 'readonly' ) ).toBeTruthy();
                    expect( inputEl.prop( 'required' ) ).toBeTruthy();
                    // negative match
                    expect( inputEl.attr( 'nonsense-qwerty' ) ).not.toBeDefined();

                    var wrapperEl = labelEl.parent();
                    expect( wrapperEl.attr( 'ng-show' ) ).toBe( showString );
                } );
            } );


            /*********************************
             * FORM GROUPS
             *********************************/
            describe( 'form groups / field sets', function () {
                it( '[no groups] should create simple form', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {name: DEMO_NAME}
                        ]};
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();
                    expect( element.html() ).toContain( '<form' );
                    expect( element.html() ).not.toContain( '<fieldset' );
                    expect( element.find( 'input' ).attr( 'name' ) ).toBe( DEMO_NAME );

                } );

                it( '[groups without fields] should create field sets with error message', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            { groupName: 'group1' }, // group without entries
                            { name: DEMO_NAME + 'Field_no_group' }

                        ]
                    };
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();
                    expect( element.html() ).toContain( '<form' );
                    expect( element.html() ).toContain( '<fieldset' );
                    var fieldsetOne = element.find( "fieldset[name='group1']" );
                    expect( fieldsetOne.length ).toBe( 1 );
                    expect( fieldsetOne.find( 'span' ).hasClass( 'error' ) ).toBeTruthy();
                } );

                it( '[groups w/o label] should create form with field sets, use name as legend', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {
                                groupName: 'group1'
                            },

                            {
                                groupName: 'group2'
                            },
                            {name: DEMO_NAME + 'Field_no_group' }
                        ]
                    };
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( '<form' );
                    expect( element.html() ).toContain( '<fieldset' );
                    var fieldsetOne = element.find( "fieldset[name='group1']" );
                    var fieldsetTwo = element.find( "fieldset[name='group2']" );
                    expect( fieldsetOne.length ).toBe( 1 );
                    expect( fieldsetTwo.length ).toBe( 1 );

                    expect( fieldsetOne.find( 'legend' ).html() ).toBe( 'group1' );
                    expect( fieldsetTwo.find( 'legend' ).html() ).toBe( 'group2' );
                } );

                it( '[groups with label] should create form with field sets, use label as legend', function () {
                    var label1 = 'Demo Group Number 1';
                    var label2 = 'Demo Group Number 2';
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {
                                groupName: 'group1',
                                groupLabel: label1
                            },

                            {
                                groupName: 'group2',
                                groupLabel: label2
                            },
                            {name: DEMO_NAME + 'Field_no_group' }

                        ]
                    };
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( '<form' );
                    expect( element.html() ).toContain( '<fieldset' );
                    var fieldsetOne = element.find( "fieldset[name='group1']" );
                    var fieldsetTwo = element.find( "fieldset[name='group2']" );
                    expect( fieldsetOne.length ).toBe( 1 );
                    expect( fieldsetTwo.length ).toBe( 1 );

                    expect( fieldsetOne.find( 'legend' ).html() ).toBe( label1 );
                    expect( fieldsetTwo.find( 'legend' ).html() ).toBe( label2 );
                } );


                it( '[fields in group] should create form with field sets containing specified fields', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [
                            {
                                groupName: 'group1',
                                groupLabel: 'Group number 1',
                                fields: [
                                    {name: DEMO_NAME + 'A_in_1' },
                                    {name: DEMO_NAME + 'C_in_1' }
                                ]
                            },
                            {
                                groupName: 'group2',
                                groupLabel: 'Group number 2',
                                fields: [
                                    {name: DEMO_NAME + 'B_in_2' }
                                ]
                            },
                            {name: DEMO_NAME + 'D_no_group' }
                        ]
                    };
                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).toContain( '<form' );
                    expect( element.html() ).toContain( '<fieldset' );

                    var fieldsetOne = element.find( "fieldset[name='group1']" );
                    var fieldsetTwo = element.find( "fieldset[name='group2']" );
                    expect( fieldsetOne.length ).toBe( 1 );
                    expect( fieldsetTwo.length ).toBe( 1 );

                    expect( fieldsetOne.find( 'input' ).length ).toBe( 2 );
                    expect( fieldsetOne.html() ).toContain( 'name="' + DEMO_NAME + 'A_in_1"' );
                    expect( fieldsetOne.html() ).toContain( 'name="' + DEMO_NAME + 'C_in_1"' );
                    expect( fieldsetOne.html() ).not.toContain( 'name="' + DEMO_NAME + 'B_in_2"' );
                    expect( fieldsetOne.html() ).not.toContain( 'name="' + DEMO_NAME + 'D_no_group"' );

                    expect( fieldsetTwo.find( 'input' ).length ).toBe( 1 );
                    expect( fieldsetTwo.html() ).toContain( 'name="' + DEMO_NAME + 'B_in_2"' );
                    expect( fieldsetTwo.html() ).not.toContain( 'name="' + DEMO_NAME + 'D_no_group"' );
                } );
            } );

            /*********************************
             * COMPLEX EXAMPLE
             *********************************/
            describe( 'complex example', function () {
                it( ' should create full form with all given field', function () {
                    // add form schema data to scope
                    $rootScope.formMetaData = {
                        formName: DEFAULT_FORM_NAME,
                        fields: [

                            {name: 'myForm', type: 'form', groups: ['groupA', 'groupB']},
                            {name: 'status1', type: 'radio', label: 'Status 1 (radio w. string-array)',
                                options: ['erfolgreich repariert',
                                          'anderen Fehler repariert',
                                          'nicht repariert, weil...'
                                ]},
                            {name: 'status2', type: 'select', label: 'Status 2 (select w. objects)',
                                options: [
                                    {label: 'erfolgreich repariert', value: 'repariert'},
                                    {label: 'anderen Fehler repariert', value: 'anderen_repariert'},
                                    {label: 'nicht repariert, weil...', value: 'nicht_repariert'}
                                ]},
                            {name: 'repairComment', label: 'Reparaturbericht', type: 'textarea', rows: '5'},
                            {name: 'replacementparts', label: 'benötigte Ersatzteile', type: 'checkbox',
                                options: [
                                    'Schraube',
                                    'Druckluftschlauch',
                                    'Niete',
                                    'Gummidichtung'
                                ]
                            },
                            {name: 'customerApprovalPerson', label: 'Kundenabnahme durch', required: true},
                            {name: 'customerApprovalNo', label: 'MitarbNr (MA-xxxx)', required: true,
                                addAttributes: 'pattern="MA-\d{4}" title="MA-xxxx, bsw MA-0123"'},
                            {name: 'showHidden', type: 'checkbox', label: 'zeige versteckte Elemente'},
                            {name: 'hidableElement', type: 'textarea', label: 'ausblendbares Feld', placeholder: 'ich war versteckt',
                                showWhen: 'demoForm.showHidden==true', rows: '3'},
                            {name: 'finishingTime', type: 'datetime', label: 'Ende der Arbeitszeit'}
                        ]};

                    element = $compile( DIRECTIVE_TAG )( $rootScope );
                    $rootScope.$digest();

                    expect( element.html() ).not.toContain( "FEHLER:" );

                    // check if all form field are compiled
                    var currentEl;
                    currentEl = element.find( '#' + DEFAULT_FORM_NAME_WITH_SUFFIX + 'status1_1' );
                    expect( getTypeOfElement( currentEl ) ).toBe( 'radio' );
                    expect( element.find( "input[type='radio']" ).length ).toBe( 3 );

                    currentEl = element.find( '#' + DEFAULT_FORM_NAME_WITH_SUFFIX + 'status2' );
                    expect( getTypeOfElement( currentEl ) ).toBe( 'select' );
                    expect( currentEl.find( 'option' ).length ).toBeGreaterThan( 2 ); //meaning exactly 3 or 4, if ng prints first item blank

                    currentEl = element.find( '#' + DEFAULT_FORM_NAME_WITH_SUFFIX + 'repairComment' );
                    expect( getTypeOfElement( currentEl ) ).toBe( 'textarea' );
                    expect( currentEl.attr( 'rows' ) ).toBe( '5' );

                    currentEl = element.find( "[name='replacementparts']" );
                    expect( currentEl.length ).toBe( 4 );
                    expect( getTypeOfElement( currentEl ) ).toBe( 'checkbox' );

                    currentEl = element.find( '#' + DEFAULT_FORM_NAME_WITH_SUFFIX + 'customerApprovalPerson' );
                    expect( getTypeOfElement( currentEl ) ).toBe( 'text' );
                    expect( currentEl.prop( 'required' ) ).toBeTruthy();

                    currentEl = element.find( '#' + DEFAULT_FORM_NAME_WITH_SUFFIX + 'customerApprovalNo' );
                    expect( getTypeOfElement( currentEl ) ).toBe( 'text' );
                    expect( currentEl.prop( 'required' ) ).toBeTruthy();

                    currentEl = element.find( '#' + DEFAULT_FORM_NAME_WITH_SUFFIX + 'showHidden' );
                    expect( getTypeOfElement( currentEl ) ).toBe( 'checkbox' );

                    currentEl = element.find( '#' + DEFAULT_FORM_NAME_WITH_SUFFIX + 'hidableElement' );
                    expect( getTypeOfElement( currentEl ) ).toBe( 'textarea' );
                    expect( currentEl.attr( 'rows' ) ).toBe( '3' );
                    expect( currentEl.parent().attr( 'ng-show' ) ).toBeDefined();

                    currentEl = element.find( '#' + DEFAULT_FORM_NAME_WITH_SUFFIX + 'finishingTime' );
                    expect( getTypeOfElement( currentEl ) ).toBe( 'datetime' );

                } );
            } );


        } ); // describe form builder
    } ); // describe rejitsu
}( jasmine, describe, it, expect, beforeEach, afterEach, module, inject, angular )); //IIFE
