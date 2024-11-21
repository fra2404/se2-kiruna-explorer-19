TEMPLATE FOR RETROSPECTIVE (Team 19)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 
  - Commited: 6
  - Done: 5
- Total points committed vs. done 
  - Committed: 28
  - Done: 20
- Nr of hours planned vs. spent (as a team)
  - Planned: 95h40m
  - Spent: 97h32m

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed
- Integration Tests passing

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   24    |        |   55h20m   |    55h57m    |
| KX4    |    2    |    5   |   02h30m   |    02h40m    |
| KX5    |    2    |    3   |   02h30m   |    02h35m    |
| KX6    |    1    |    2   |   02h30m   |    02h30m    |
| KX7    |   12    |    5   |   19h20m   |    21h10m    |
| KX8    |    4    |    5   |   10h30m   |    13h40m    |
| KX9    |    1    |    8   |     3h     |      0h      |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)  
  Estimated hours per task average: 2.08  
  Standard deviation: 1.86  
  
  Actual hours per task average: 2.20  
  Standard deviation: 1.99  
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

  $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = \frac{97.53}{95.67} - 1 = 0.019$$
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

  $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| = \frac{1}{45} \left| \frac{97.53}{95.67} - 1 \right| = 0.00042$$
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 12h30m
  - Total hours spent: 12h30m
  - Nr of automated unit test cases: 91
  - Coverage (if available): 84.67%
- Integration Testing:
  - Total hours estimated: 30m
  - Total hours spent: 22m
  - Nr of automated unit test cases: 144
- E2E testing:
  - Total hours estimated: 2h
  - Total hours spent: 2h
- Code review 
  - Total hours estimated: 3h30m
  - Total hours spent: 6h20m
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - E2E testing and Code Review: we should both increase the time estimated on E2E and code review, and try to write code with superior quality and logic before opening a new merge request. This would allow us to reduce the time spent on code review.
  - Unit testing: non-uniformity of the code written by different people. Therefore different testing methodology.
  - Unexpected problems while developing a task that increase the time spent on that task

- What lessons did you learn (both positive and negative) in this sprint?
  - We managed the git repository in a very effective way. This allowed us to have a branch (dev) that is always up ad running and to check the code quality before merging into dev.
  - Increase the minimun value in terms of code quality to accept the merge requests.
  - Rush situations are still present in some cases. We should better organize our time during the sprint.
  - The route unit tests are not very effective, since in order to get them working we needed to mock the routes, making the tests useless. We test the routes via integration testing, and run unit test only on services and controllers.
  

- Which improvement goals set in the previous retrospective were you able to achieve?
  - We had a better method of assigning stories and tasks.
  - Estimate a story and began to work on it only after having fully understood it.
  
  
- Which ones you were not able to achieve? Why?
  - None
  

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Propose one or two
  
  - Increase the code quality by writing cleaner code and trying to reduce to a minimum the new issue opened on SonarCloud.
  - Try to avoid rush situation as much as possible, by better organizing the workload of individuals.

- One thing you are proud of as a Team!!
  - We improved from the previous sprint, and these improvements can be seen in the quality of the project.