TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 
  - Commited: 3
  - Done: 3
- Total points committed vs. done 
  - Committed: 13
  - Done: 13
- Nr of hours planned vs. spent (as a team)
  - Planned: 96h30m
  - Spent: 101h40m

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
| _#0_   |   26    |        |    61h     |    58h10m    |
| KX1    |    9    |    2   |   12h30m   |     21h      |
| KX2    |    6    |    3   |   10h30m   |    08h20m    |
| KX3    |   10    |    8   |   12h30m   |    14h10m    |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)  
  Estimated hours per task average: 1.89  
  Standard deviation: 1.78  
  
  Actual hours per task average: 2.21  
  Standard deviation: 1.89  
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = \frac{96.5}{101.67} - 1 = -0.05$$
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| = \frac{1}{51} \left| \frac{96.5}{101.67} - 1 \right| = 0.00100$$
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 7h30
  - Total hours spent: 13h25
  - Nr of automated unit test cases: 48
  - Coverage (if available): 65.03%
- E2E testing:
  - Total hours estimated: 1h10
  - Total hours spent: 1h15
- Code review 
  - Total hours estimated: 1h
  - Total hours spent: 30m
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Integration testing: while working on them, we found a better and faster way of doing them, so the spent hours are much less than the estimated ones
  - Unit testing: they had to be re-written due to changes to methods
  - Merge problems on GitHub: much time was spent solving merge conflicts when pushing our code to GitHub
  - Re-understanding the tasks (lack of adequate description in the tasks)

- What lessons did you learn (both positive and negative) in this sprint?
  - Add description to every task at the start of the sprint
  - Better organize the code (atoms-molecules-organisms in frontend), in order to have less merge problems
  - Assign stories instead of tasks and have everyone defining their own tasks
  - Produce feedback earlier about our work
  - Have shorter and more frequent scrum meetings (monday - 9pm, wednesday - 9pm, friday - after class)
  - Fully understand the stories before starting to work on them, so that problems about the organization and the methods needed arise at the very start of the sprint instead of when working on the stories
  

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We had better communication between front-end and back-end teams, though it can still use some improvement
  - The workload was better distributed among the sprint duration
  
- Which ones you were not able to achieve? Why?
  - Rush situations are still present, because of last-minute code reviews that showed unexpected bugs

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Propose one or two
  
  - Different way to define tasks (assign stories instead of tasks and have everyone defining their own tasks)
  - Take some time to understand the stories that we need to develop before start working on them

- One thing you are proud of as a Team!!
  - We discuss a lot about the issues we encounter and try to solve them together