# Technical debt management strategy

This document describes how we are going to include code quality checks within the sprint and how we will pay back technical debt.

## Code quality checks
  - Manually: for each task, a separate branch is created. Then, when the task is completed, a new merge request is opened to merge that branch into the "dev" branch. Team members assigned to testing and code review will test and review the merge request, in order to be sure that there are no issues and that the code quality standards (according to the atom-molecule-organism structure) are met. If there are no flaws, the merge request is accepted and the branch is deleted. Otherwise, the merge request is rejected and the group member who opened the request is notified about the issues.
  - Automatically via SonarCloud: when checking the merge request, also the issues raised by SonarCloud are taken into consideration. The request is accepted only if the issues reported by SonarCloud are contained and there are no major problems.
    - On SonarCloud we use GitHub Continous Integration, because it allows us to run SonarCloud on the "dev" branch (otherwise we could have only run it on the main branch).
    - We created a second GitHub action that checks the issues even if the tests do not pass. By default, the SonarCloud analysis is not performed if the tests do not pass, so we created this secondary GitHub action so that new issues are always checked independently from tests.

## How to pay back Technical Debt
  - Starting from the third sprint, a new task about technical debt rapayment is added. Team members dedicated to pay back technical debt will focus on high and medium priority issues first. Then, if there is still some time left from the stories development, they will also solve some of the low priority issues

## Conclusion
The code quality standards set when reviewing the merge requests are very high, so as to try as much as possible to have clean and mantainable code. However, on a project of this scale there will always be some issues to solve and code to refactor and this is why, starting from sprint 3, we have a task dedicated to exaclty that.