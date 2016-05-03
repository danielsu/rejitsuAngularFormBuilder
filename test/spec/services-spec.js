/*global
 jasmine,
 describe, it, expect,
 beforeEach, afterEach,
 module, inject,
 angular
 */

(function ( jasmine, describe, it, expect, beforeEach, afterEach, module, inject, angular ) {
    "use strict";

    describe( 'services', function () {


        beforeEach( module( 'services', 'constantsModule' ) );

        describe( 'bpmServices', function () {
            var scope, service, resourceMock, sampleProcessInstances, sampleTaskSummary, sampleProcessVarsWithMultipleVersions,
                    brmsBaseUrlMock = 'http://server:80/jitsdemo/servlets/forwardToBrms',
                    processUtilsBaseUrlMock = 'http://server:80/jitsdemo/rest/processutils',
                    emptyFunction = function () {
                    },
                    dummyConsole = {
                        log: emptyFunction, dir: emptyFunction, warn: emptyFunction
                    };

            // overwrite global variable, possible conflict with strict mode for testing!?
            console = dummyConsole;

            beforeEach( inject( function ( bpmService, $httpBackend ) {
                service = bpmService;
                resourceMock = $httpBackend;
            } ) );

            it( 'getProcesses should send GET request to /processutils/processlist/RejitsuDemoProcess/withvars', function () {
                resourceMock.when( 'GET', processUtilsBaseUrlMock + '/processlist/RejitsuDemoProcess/withvars' ).respond( [] );
                service.getProcesses( emptyFunction );
                checkHttpConnectionsToBeEmpty();
            } );

            it( 'getTaskForProcess should send GET request to /task/query?processInstanceId=42', function () {
                resourceMock.when( 'GET', brmsBaseUrlMock + '/task/query?processInstanceId=42' ).respond( {} );
                service.getTasksForProcess( 42, emptyFunction );
                checkHttpConnectionsToBeEmpty();
            } );

            it( 'claimTaskForMe should NOT send a request when already claimed', function () {
                var taskInProgress = {  id: '77', status: 'InProgress' };
                service.claimTaskForMe( taskInProgress, emptyFunction );

                // for this test, do not define resourceMock.when() and do not call resourceMock.flush()
                resourceMock.verifyNoOutstandingExpectation();
                resourceMock.verifyNoOutstandingRequest();
            } );

            it( 'claimTaskForMe should send POST request to /task/77/claim for available task', function () {
                var availableTask = {  id: '77', status: 'Ready' };
                resourceMock.when( 'POST', brmsBaseUrlMock + '/task/77/claim' ).respond( {} );
                service.claimTaskForMe( availableTask, emptyFunction );
                checkHttpConnectionsToBeEmpty();
            } );


            it( 'startTaskForMe should NOT send a request when already in progress', function () {
                var taskInProgress = {  id: '77', status: 'InProgress' };
                service.startTaskForMe( taskInProgress, emptyFunction );

                // for this test, do not define resourceMock.when() and do not call resourceMock.flush()
                resourceMock.verifyNoOutstandingExpectation();
                resourceMock.verifyNoOutstandingRequest();
            } );

            it( 'startTaskForMe should send POST request to /task/77/start for reserved task', function () {
                var availableTask = {  id: '77', status: 'Reserved' };
                resourceMock.when( 'POST', brmsBaseUrlMock + '/task/77/start' ).respond( {} );
                service.startTaskForMe( availableTask, emptyFunction );
                checkHttpConnectionsToBeEmpty();
            } );

            it( 'completeTask should send POST request to /task/77/complete for reserved task', function () {
                var availableTask = {  id: '77', status: 'Reserved' };
                resourceMock.when( 'POST', brmsBaseUrlMock + '/task/77/complete?' ).respond( {} );
                service.completeTask( availableTask, emptyFunction );
                checkHttpConnectionsToBeEmpty();
            } );


            function checkHttpConnectionsToBeEmpty() {
                resourceMock.flush();
                resourceMock.verifyNoOutstandingExpectation();
                resourceMock.verifyNoOutstandingRequest();
            }
        } ); // describe bpmServices
    } ); // describe services
}( jasmine, describe, it, expect, beforeEach, afterEach, module, inject, angular )); //IIFE