# Team 19 - Retrospective 4

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 
  - Committed: 4
  - Done: 4
- Total points committed vs done 
  - Committed: 34
  - Done: 34
- Nr of hours planned vs spent (as a team)
  - Planned: 93h00m
  - Spent: 93h40m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed
- Integration Tests passing

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   | 33      |    -   | 82h10m     | 83h30m       |
| KX17   | 2       | 5      | 03h00m     | 03h00m       |
| KX12   | 1       | 21     | 02h00m     | 03h00m       |
| KX13   | 2       | 5      | 05h30m     | 03h50m       |
| KX15   | 1       | 3      | 0h20m      | 0h20m        |
   


- Hours per task average, standard deviation (estimate and actual)

|            | Mean | StDev |
|------------|------|-------|
| Estimation | 1.80 | 1.42  | 
| Actual     | 1.99 | 1.41  |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = \frac{92.92}{93.66} - 1 = -0.008$$
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| = \frac{5.944}{39} = 0.15 $$

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 11h
  - Total hours spent: 11h
  - Nr of automated unit test cases: 147
  - Coverage: 98.84%
- Integration Testing:
  - Total hours estimated: 1h
  - Total hours spent: 1h05m
  - Nr of automated unit test cases: 288
- E2E testing:
  - Total hours estimated: 3h
  - Total hours spent: 3h25m
  - Nr of test cases: Not applicable, we performed E2E testing manually
- Code review 
  - Total hours estimated: 6h
  - Total hours spent: 6h45m
- Technical Debt management:
  - Strategy adopted: 
    - Code quality checks: each task was developed on a separate branch (one branch per task). Then, when the task was completed, a merge request was opened to merge that branch into the "dev" branch. The request was tested and reviewied and, if everything worked as expected, code quality standards (according to the atom-molecule-organism structure) were met, and the issues reported by SonarCloud were few and without a high severity, the merge was approved and the branch deleted
    - Technical debt repayment: we also dedicated some time to solving the issues reported by SonarCloud. We started from high and medium severity issues and, when possible, we also solved low severity issues.
  - Total hours estimated: 7h30m
  - Total hours spent: 6h50m
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Many tasks related to the Diagram (for example the background grid and the dragging of the nodes): the library we used had a lot of limitations and we had to find some workarounds to make everything working as we wanted to.

- What lessons did you learn (both positive and negative) in this sprint?
  - Some prefer to have many micro-tasks (~20-30m each), while others prefer to have fewer macro-tasks (~1h30m each). We learned to work together despite having different ways to manage our tasks and organize our work.
  - The library we used for the diagram had many limitations, so we should have spent more time evaluating the library before starting to work on it.
  - We tried to recreate the UI interface that was given to us from the cards, instead of trying to reinterpret it in a more creative way.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We managed to really improve the diagram's UI and UX, despite the limitations of the library.
  
- Which ones you were not able to achieve? Why?
  - The diagram's code quality can be further improved, and there are still some minor issues on UI and UX that can be fixed.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - Non applicable: this is the last sprint

- One thing you are proud of as a Team!!
  - When the project was presented to us, we didn't know where to start from. It seemed like a really steep mountain to climb. But now, after two months of work, we have learned and understood the libraries needed, the technical details, and we have been able to see our cultural differencies not as a challenge, but as an opportunity to expand our horizons. Even if at first glance something appears impossible, with good work organization and above all a good team everything is achievable. And we can work across different timezones!
