# Team 19 - Retrospective 3

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 
  - Committed: 7
  - Done: 6
- Total points committed vs done 
  - Commited: 30
  - Done: 25
- Nr of hours planned vs spent (as a team)
  - Planned: 91h50m
  - Spent: 97h19m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed
- Integration tests passing

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   | 29      |    -   | 74h50m     | 75h34m       |
| KX9    | 2       | 8      | 04h00m     | 05h00m       |
| KX19   | 0       | 0      | 0h         | 0h           |
| KX10   | 6       | 13     | 09h00m     | 12h15m       |
| KX20   | 0       | 0      | 0h         | 0h           |
| KX14   | 1       | 2      | 02h30m     | 03h00m       |
| KX11   | 1       | 2      | 01h30m     | 01h30m       |
| KX17   | 0       | 5      | 0h         | 0h           |
   

> Note: the features needed for stories 19 and 20 were already developed in the previous sprint

- Hours per task (average, standard deviation)
  Estimated hours per task average: 1.65  
  Standard deviation: 0.87  

  Actual hours per task average: 1.81  
  Standard deviation: 1.16

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1
  $$\frac{91.83}{97.32} - 1 = -0.06$$

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 9h
  - Total hours spent: 11h15m
  - Nr of automated unit test cases: 103
  - Coverage (if available): 98.15%
- Integration Testing:
  - Total hours estimated: 1h
  - Total hours spent: 1h10m
  - Nr of automated unit test cases: 228
- E2E testing:
  - Total hours estimated: 3h
  - Total hours spent: 2h20m
- Code review 
  - Total hours estimated: 6h
  - Total hours spent: 7h50m
- Technical Debt management:
  - Strategy adopted: See TD_strategy.md in the root folder of the main branch
  - Total hours estimated at sprint planning: 9h30m
  - Total hours spent: 9h5m
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - For the tasks related to the diagram, estimation errors were caused by its complexity. We could not effectively estimate the time needed to implement it before starting to work on it, since we didn't know yet the technology to use.
  - Code review: problems on code meant that we spent more time than estimated on code reviews.
  - Unxepected issues while developing new features that increased the time spent on that feature.

- What lessons did you learn (both positive and negative) in this sprint?
  - We should try to better define the tasks at the start of the sprint, as we did for sprint 2. In this case, not knowing exactly how to implement the diagram and the time needed for it affected the definition and estimation of the tasks.
  - We managed to complete most of the tasks by the last Sunday of the sprint. This gave us plenty of time to review and test the features and fix any bug without rushing.


- Which improvement goals set in the previous retrospective were you able to achieve? 
  We were able to avoid rush situations by completing (most of) our tasks 3 days before the deadline.
  
- Which ones you were not able to achieve? Why?
  The code quality is much higher than in the last sprint, but there are still some improvements that can be made, especially for the frontend.
  Furthermore, in the next sprint we can implement a State Manager (e.g. Redux) to better manage the connection between the frontend and the database.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - Further improve code quality. We accepted some technical debt (especially for the diagram) that will need to be repayed in the next sprint.

- One thing you are proud of as a Team!!

  We were able to improve a lot during the sprints both on a personal level and in teamwork!