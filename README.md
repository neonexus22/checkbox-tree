# checkbox-tree
Folder tree structure with checkbox

This is a tree structure with checkboxes I created using pure javascript. It has two files, js_custom/SearchClass.js and index.html
In index.html I have two divs with unique ids. Then I call a function named renderTheFirstLayout(id) to create a layout for the tree 
structure that consists of a search field, button and select all/ reset all links. Below there is a div that consists the dynamically created
folder-tree-with-checkbox.

Example : 
// to get the parent div element
 const container = document.querySelector('#container');
 // render the initial layout in that div
 container.innerHTML = renderTheFirstLayout('fund_org_tree');
 
 // creating an instance of the SearchClass from js_custom/SearchClass.js
 // it takes two arguments, the div to add the checkbox-tree and url from where to fetch the data
 // please check the url to see the data structure that should be provided to the instance
 const myInstance = new SearchClass('fund_org_tree', 'https://api.myjson.com/bins/y2i5r');
 // calling start method of the class
 myInstance.start();
 
 //Search Class has following methods
 1. start -> It creates a document fragment and calls renderTree method
 2. renderTree -> It takes the tree as data, dom element as container and a randomly generated id as count
    It recursively reads the tree data and creates the tree-checkbox structure
    Then it adds a -(minus) sign after every li. In order to remove minus sign from last node li, 
    I used removeInitialMinusSign() method 
 3. removeInitialMinusSign -> it finds last node li by searching for two elements (span and label)
 4. minusClicked -> this function hides all the children under it
 5. plusClicked -> this function show all the children under it
 6. checkboxChangeListener -> checks if the checkbox is checked or unchecked.
 7. uncheckParentFromChild -> unchecks parent element as well recursively when the child is checked
 8. allChildSelectedTest -> tests if all child are selected, is yes, checks the parent li all the way up
 9. handleSearchTextChange -> adds all the checked elements in an array called nodesArray and hides rest
 10. findLastParentUlNode -> finds all the parents of the current child recursively and unhides the parent if the child is checked
 11. handleSelectAllEvent -> checks all the li's
 12. handleResetAllEvent -> unchecks all the li's
 
 
 Its a very simple project. I hope it helps them who are looking for a simple solution.
