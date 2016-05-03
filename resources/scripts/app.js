(function ( angular ) {
    "use strict";

    angular.module( "jitsApp", [
        "rejitsuHelpers",
        "rejitsuDirectives",
        "ngRoute"
    ] )
        .filter( 'prettifyJson', function () {
            return function ( input ) {
                return JSON.stringify( input, undefined, 2 );
            }
        } )
        .controller( "dynaFormDocuController", [
            "$rootScope",
            function ( $rootScope ) {
                $rootScope.showDetailView = false;
                $rootScope.selectedPage = 'dynaFormDocu';
                prettyPrint();
            } ] )
        .controller( "dynaFormExamplesController", [
            "$rootScope",
            "$scope",
            "mockDataService",
            function ( $rootScope, $scope, mockDataService ) {
                $rootScope.showDetailView = false;
                $rootScope.selectedPage = 'dynaFormExamples';

                $scope.formCollection = mockDataService.getAllMockedFormSchemata();
            } ] )
        .factory( "mockDataService", [
            function () {
                return {
                    getAllMockedFormSchemata: function () {
                        return mockFormSchemata;
                    }
                }
            }
        ] )
        .config( function ( $routeProvider ) {
            $routeProvider
                .when( '/', {
                    templateUrl: 'pages/dynaFormExamplesPage.html',
                    controller: 'dynaFormExamplesController'
                } )
                .when( '/dynaFormExamples', {
                    templateUrl: 'pages/dynaFormExamplesPage.html',
                    controller: 'dynaFormExamplesController'
                } )
                .when( '/dynaFormDocu', {
                    templateUrl: 'pages/dynaFormDocuPage.html',
                    controller: 'dynaFormDocuController'
                } )
                .otherwise( {
                    redirectTo: '/'
                } )

        } );

    /**
     * Avoid a 300 - 450ms delay on mobile devices, caused by browser waiting for double tap etc.
     */
    if ( window.addEventListener ) {
        // check for existence avoids selenium htmlunit crash
        window.addEventListener( 'load', function () {
            FastClick.attach( document.body );
        }, false );
    }

    // #######################################
    // #       form schemata
    // #######################################
    var mockFormSchemata = {};

    mockFormSchemata.minimalFormExample = {
        formName: 'myMinimalForm',
        fields: [
            { name: 'vorname' },
            { name: 'nachname' },
            { name: 'strasse' },
            { name: 'hausnummer' },
            { name: 'plz' },
            { name: 'ort' },
            { name: 'bemerkungen' }
        ]
    };
    mockFormSchemata.moreSpecificFormExample = {
        formName: 'mySpecificForm',
        fields: [
            { name: 'vorname', label: 'Vorname' },
            { name: 'nachname', label: 'Nachname', required: true },
            { name: 'strasse_und_nummer', label: 'Straße und Hausnummer', help: 'mit Leereichen getrennt' },
            { name: 'plz', label: 'Postleitzahl' },
            { name: 'ort', label: 'Ort', placeholder: 'D-00000' },
            { name: 'newsletter', type: 'checkbox', label: 'Newsletter erwünscht?' },
            { name: 'bemerkungen', type: 'textarea', label: 'Was Sie noch mitteilen möchten:', placeholder: 'Ich wünsche Informationen zu ...' }
        ]
    };
    mockFormSchemata.groupFormExample = {
        formName: 'myGroupErrorForm',
        fields: [
            {
                groupName: 'Rechnungsanschrift',
//                groupLabel: 'Anschrift für die Rechnung',
                fields: [
                    { name: 'inv_vorname', label: 'Vorname' },
                    { name: 'inv_nachname', label: 'Nachname' },
                    { name: 'inv_strasse', label: 'Straße' },
                    { name: 'inv_hausnummer', label: 'Hausnummer' },
                    { name: 'inv_plz', label: 'PLZ' },
                    { name: 'inv_ort', label: 'Ort' }
                ]
            },

            {
                groupName: 'Lieferanschrift',
                // groupLabel: 'abweichende Lieferanschrift',
                fields: [
                    { name: 'deliv_vorname', label: 'Vorname' },
                    { name: 'deliv_nachname', label: 'Nachname' },
                    { name: 'deliv_strasse', label: 'Straße' },
                    { name: 'deliv_hausnummer', label: 'Hausnummer' },
                    { name: 'deliv_plz', label: 'PLZ' },
                    { name: 'deliv_ort', label: 'Ort' }
                ]
            }
        ]
    };


    mockFormSchemata.basicErrorExample = {
        // intentionally left blank
    };
    mockFormSchemata.groupErrorExample = {
        formName: 'myGroupErrorForm',
        fields: [
            {
                groupName: 'group1',
                fields: [
                    { name: 'Feld_in_Gruppe_1' }
                ]
            },

            {
                groupName: 'group2'
            },
            { name: 'Feld_ohne_Gruppe' }
        ]
    };


    mockFormSchemata.complexFormExample = {
        formName: 'myComplexForm',
        fields: [
            {
                groupName: 'repairGroup',
                groupLabel: 'Daten zur Reparatur',
                fields: [
                    {
                        name: 'rejitsuStateInput', type: 'radio', label: 'Status 1 (radio w. string-array)',
                        options: [
                            { label: 'erfolgreich repariert', value: 'repaired' },
                            { label: 'anderen Fehler repariert', value: 'repairedOther' },
                            { label: 'nicht repariert, weil...', value: 'notRepaired' }
                        ]
                    },
                    {
                        name: 'status2', type: 'select', label: 'Status 2 (select w. objects)',
                        options: [ 'erfolgreich repariert',
                                   'anderen Fehler repariert',
                                   'nicht repariert, weil...'
                        ]
                    },
                    { name: 'repairCommentInput', label: 'Reparaturbericht', type: 'textarea', rows: '5' },
                    {
                        name: 'replacementPartsInput', label: 'benötigte Ersatzteile', type: 'checkbox',
                        options: [
                            'Schraube',
                            'Druckluftschlauch',
                            'Niete',
                            'Gummidichtung'
                        ]
                    }
                ]
            },
            {
                groupName: 'approvalGroup',
                groupLabel: 'Bemerkungen zur Abnahme',
                fields: [
                    { name: 'activateApproval', type: 'checkbox', label: 'aktiviere Abnahme' },
                    {
                        name: 'customerApprovalPersonInput',
                        label: 'Kundenabnahme durch',
                        addAttributes: 'ng-disabled="!formDatamyComplexForm.activateApproval"'
                    },
                    {
                        name: 'customerApprovalNoInput',
                        label: 'MitarbNr (MA-xxxx)',
                        required: true,
                        addAttributes: 'pattern="MA-\\d{4}" title="MA-xxxx, bsw MA-0123" ng-disabled="!formDatamyComplexForm.activateApproval"'
                    },
                    {
                        name: 'doneTimeInput',
                        type: 'datetime',
                        label: 'Ende der Arbeitszeit',
                        addAttributes: 'ng-disabled="!formDatamyComplexForm.activateApproval"'
                    }
                ]
            },
            { name: 'showHidden', type: 'checkbox', label: 'zeige versteckte Elemente außerhalb der Gruppe' },
            {
                name: 'hidableElement', type: 'textarea', label: 'ausblendbares Feld',
                placeholder: 'ich war versteckt', showWhen: 'formDatamyComplexForm.showHidden==true', rows: '3'
            }
        ]
    };
}( angular ));