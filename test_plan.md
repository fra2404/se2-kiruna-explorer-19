# Test documentation for Kiruna eXplorer

This document describes the details of the implementation and execution of E2E and integration tests for the project. Unit Tests have also been conducted, and can be found in server/src/\_\_tests__.

## Integration tests

### Purpose
Integration tests verify that the routes work as expected.

### Implementation
Via Swagger, integration tests for the routes were automatically created, and were imported in PostMan. The JSON file with those tests can be found in server/integration.

## E2E Tests

### Purpose
E2E tests are conducted before merging new code into the "dev" branch, in order to check that the new code works properly. E2E tests are also performed before merging the "dev" branch into the "main" branch.

### Implementation
The branches on Git are organized in the following way:

For each task, a separate branch is created. When the task is completed, a new merge request is opened, to merge that branch in the "dev" branch. The people assigned to code review and E2E testing will test and review the merge request and, if the code is written properly (according to the atoms-molecules-organisms structure) and the new features work as expected, the request is approved. Otherwise, the person who made the merge request is notified of the issues and the request is rejected. Backend methods must also pass Unit Tests and Integration Tests in order to be approved.  
The "dev" branch is then merged in the "main" branch at the end of the sprint, after the whole application has been tested again and we are sure there are no issues in the code.  
The "main" branch contains the running code that is presented during demos.