# Data Journalism and D3
##### Homework 16

## Objective
- Visualize [2014 ACS 1-year estimates](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml). <br>The dataset includes data on rates of income, obesity, poverty, etc. by state.
Data are visuzalized using D3.  <br>
 <br>

## Methodology
- Visualization is built in two level of difficulties: 
 <br>Level 1 for basic visualization, and 
 <br>Level 2 for multi-axis visualization. 
<br>

## How to run
Right-click on "index.html" and "open in terminal". <br>
In terminal, type 
``` 
   python -m http.server
```
The page will be hosted at `localhost:8000` in your web browser. 
 <br>

 ## Level 1
 In level 1, we insure that data integrity by manipulating and plotting a pair of data. In our example, we choose to look if there is a relationship between "poverty" and "healthcare".  <br>
 <br>
    ![Lev1](images/Lev1.PNG)
    <br>

 ## Level 2
 In level 2, we will transform the static and basic Level1 graph into an interactive graph. We will integrate additional data from [2014 ACS 1-year estimates](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml), such as "Obesity", "Smoking rate", "Household income", and "Age".  <br>
 The graph will be automatically by clicking on the axis label. <br>
<br>
Default setting is set to "poverty" and "healthcare" <br>
 <br>
    ![Lev2_default](images/Lev2_default.PNG)
    <br>
<br>
Example of graph for "Obesity" and "Household income" is shown below: <br>
 <br>
    ![Lev2_ex2](images/Lev2_ex2.PNG)
    <br>
