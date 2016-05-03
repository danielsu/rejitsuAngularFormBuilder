/*global
    jasmine,
    describe, it, expect,
    beforeEach, afterEach,
    module, inject,
    angular
 */

(function ( jasmine, describe, it, expect, beforeEach, afterEach, module, inject, angular ) {
    "use strict";

    describe( 'controllers', function () {

        beforeEach( module( 'controllers', 'constantsModule' ) );

        describe( 'processController', function () {
            var scope, controller, bpmServiceMock, testProcess;

            beforeEach( inject( function ( $rootScope, $controller ) {
                scope = $rootScope.$new(); // dollar-new

                bpmServiceMock = (function () {
                    return{
                        getProcesses: function () {
                            return [];
                        },
                        getRules: function () {
                            return [];
                        },
                        getDevices: function () {
                            return [];
                        }
                    }
                }()); // IIFE

                controller = $controller( 'processController', {
                    $scope: scope,
                    bpmService: bpmServiceMock
                } );
            } ) );

            beforeEach( function () {
                var testProcess = {};
                testProcess.id = 42;
                testProcess.device = 'DEV-000-ABCDEF';
                testProcess.state = 'warning';
                testProcess.date = (new Date()).getTime();
                testProcess.description = 'some dummy text';
                testProcess.isUnread = false;
                testProcess.tasks = [
                    {
                        id: 'task_' + testProcess.id + '.01',
                        name: 'Ersatzteile bestellen'
                    },
                    {
                        id: 'task_' + testProcess.id + '.02',
                        name: 'Meldung bestätigen'
                    }
                ];
            } );

            it( 'should select a process', function () {
                expect( scope.selectedProcess ).toBeNull();
                scope.selectProcessFn( testProcess );
                expect( scope.selectedProcess ).toEqual( testProcess );
            } );

        } ); // describe processController
    } ); // describe controllers
}( jasmine, describe, it, expect, beforeEach, afterEach, module, inject, angular )); //IIFE