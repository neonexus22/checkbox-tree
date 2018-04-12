class SearchClass {
    constructor(ref, url) {
        this.ref = ref;
        this.url = url;
        this.container = document.getElementById(ref + "_container");
        this.ulContainer = document.getElementById(ref + "_ul_container");
        this.search = document.getElementById(ref + "_search");
        this.selectAll = document.getElementById(ref + "_select_all");
        this.resetAll = document.getElementById(ref + "_reset_all");
        this.searchBtn = document.getElementById(ref + "_search_btn");
        this.spans = [];
        this.search.addEventListener('keyup', this.handleSearchTextChange.bind(this));
        this.selectAll.addEventListener('click', this.handleSelectAllEvent.bind(this));
        this.resetAll.addEventListener('click', this.handleResetAllEvent.bind(this));
        this.searchBtn.addEventListener('click', this.handleSearchBtnClick.bind(this));
    }

    //make ajax call for data and then calls renderTree to render the tree
    start() {
        const self = this;
        fetch(self.url)
            .then(res => res.json())
            .then(data => {
                let tempDoc = document.createDocumentFragment();
                self.renderTree(data.tree, tempDoc, "root" + 100);
                self.ulContainer.appendChild(tempDoc);
                self.removeInitialMinusSign();
                self.spans = document.querySelectorAll(`#${self.ref}_container span.filter_text_title`);
            })
            .catch(err => console.log(err));
    }

    //render tree structure using recursive function
    renderTree(tree, container, count) {
        const self = this;
        const newUl = document.createElement('ul');
        newUl.setAttribute('class', "my-filter-ul " + count);
        Array
            .prototype
            .forEach
            .call(tree, function (item) {
                const classForLi = 'my-filter-li ' + count;
                const newLi = document.createElement('li');
                newLi.setAttribute('class', classForLi);
                // add material ui checkbox design const newText =
                // document.createTextNode(item.name);
                const newLabel = document.createElement('label');
                const newInput = document.createElement('input');
                newInput.setAttribute('type', 'checkbox');
                newInput.setAttribute('id', item.id);
                newInput.setAttribute('class', 'filled-in');
                // add a listener when checkbox is checked/unchecked
                newInput.onchange = self
                    .checkboxChangeListener
                    .bind(self);

                const newSpan = document.createElement('span');
                const newText = document.createTextNode(item.name);
                newSpan.setAttribute('class', 'filter_text_title');
                newSpan.appendChild(newText);
                newLabel.appendChild(newInput);
                newLabel.appendChild(newSpan);

                // end of checkbox content newLi.appendChild(newText);
                newLi.appendChild(newLabel);

                const myicon = document.createElement('span');
                myicon.setAttribute('class', 'expand_collapse_icon minus');
                const textForIcon = document.createTextNode(' -');
                myicon.appendChild(textForIcon);
                myicon.style.color = 'red';
                myicon.onclick = self
                    .minusClicked
                    .bind(self);
                newLi.appendChild(myicon);

                newUl.appendChild(newLi);
                container.appendChild(newUl);
                if (item.tree) {
                    self.renderTree(item.tree, newLi, "rand" + parseInt(Math.random(10, 1000).toFixed(4) * 10000));
                }
            });
    }

    //this function is to remove minus from the last child of every hierarchy
    removeInitialMinusSign() {
        const self = this;
        // using document fragmentation to remove + sign after the last child
        let temp = document.createDocumentFragment();
        // putting ulContainer div inside the temporary container. this is remove the
        // div from DOM
        temp.append(self.ulContainer);
        // looking for all li inside the temp container var lis =
        // temp.querySelectorAll('#fund_org_ul_container li');
        let lis = temp.querySelectorAll(`#${self.ref}_ul_container li`);
        // looping throught the li
        Array
            .prototype
            .forEach
            .call(lis, function (item) {
                // if there is an element li/ul
                if (item.children[1]) {
                    // if item has two children only, if it has ul, then it will have three children
                    // the chidren of ul will be label, span(icon ko), and ul but if it has 2
                    // elements it will just have label and span(icon ko). so here we will do
                    // removing of icon
                    if (item.children.length === 2) {
                        // removing the icon children denoted by index 1 from the item that has 2
                        // elements
                        item.removeChild(item.children[1]);
                    }
                }
            });
        self
            .container
            .append(temp);
    }

    //this function is called to collapse the menu
    minusClicked(e) {
        const self = this;
        var parent = e.target.parentNode;
        // to switch from minus to plus sign and add event at the end
        const newSpan = document.createElement('span');
        newSpan.setAttribute('class', 'expand_collapse_icon plus');
        newSpan.style.color = 'currentColor';
        const newText = document.createTextNode(' +');
        newSpan.appendChild(newText);
        newSpan.onclick = self
            .plusClicked
            .bind(self);

        // removing the child with index 1 that is span
        parent.removeChild(parent.children[1]);
        // getting the first child so as to get the next sibling for the check below
        const myLastChild = parent.children[0];
        // check if it has next Sibling which is ul
        if (myLastChild.nextSibling) {
            // insert plus span just before the ul child
            parent.insertBefore(newSpan, myLastChild.nextSibling);
        }

        // get the ul element so as to hide it
        const theUl = parent.children[2];
        // add hidden attribute to hide the element
        theUl.setAttribute('hidden', 'hidden');
    }

    // this function is called to expand the view
    plusClicked(e) {
        const self = this;
        var parent = e.target.parentNode;
        //for changing the icon from plus to minus and adding event
        const newSpan = document.createElement('span');
        newSpan.setAttribute('class', 'expand_collapse_icon minus');
        newSpan.style.color = 'red';
        const newText = document.createTextNode(' -');
        newSpan.appendChild(newText);
        newSpan.onclick = self
            .minusClicked
            .bind(self);

        // remove the current span that has minus sign
        parent.removeChild(parent.children[1]);
        // get the first child of the parent
        const myLastChild = parent.children[0];
        // check if it has next sibling
        if (myLastChild.nextSibling) {
            // append the plus sign just before the next sibling in between first and
            // nextSibling
            parent.insertBefore(newSpan, myLastChild.nextSibling);
        }
        //get all the ul and li under this section
        const childrenBeneath = parent.querySelectorAll('li,ul');
        Array
            .prototype
            .forEach
            .call(childrenBeneath, function (item) {
                //display all the ul/li found
                item.removeAttribute('hidden');
            })

    }

    // when checkbox is changed, the change is persisted down to all its children
    checkboxChangeListener(e) {
        const self = this;
        const parentLi = e.target.parentNode.parentNode;
        const myBoolean = (e.target.checked)
            ? true
            : false;
        // console.log(parentLi.children);
        const targetUl = parentLi.children[2];
        // if we have ul as target
        if (targetUl) {
            // choose all the inputs below this ul
            const lis = targetUl.querySelectorAll('li>label>input');
            Array
                .prototype
                .forEach
                .call(lis, function (item) {
                    // change the status according to the target checked status
                    item.checked = myBoolean;
                })
        }

        if (!myBoolean) {
            // console.log('unchecked', e.target);
            self.uncheckParentFromChild(e.target.parentNode.parentNode);
        }

        if (myBoolean) {
            self.allChildSelectedTest(e.target);
        }
    }

    // look for above parent and see if its children are all checked, if yes, check it as well and move upward
    allChildSelectedTest(child) {
        const self = this;
        // input.label.li.ul
        const containerUl = (child.parentNode.parentNode.parentNode);
        // input.label.li.ul.li
        const containerParentLi = containerUl.parentNode;
        if (containerParentLi.localName === 'li') {
            const allChildCount = containerUl.children.length;
            const classes = containerUl.className;
            const id = classes.split(" ")[1];
            let count = 0;
            if (id) {
                const allLis = document.querySelectorAll(`li.${id}`);
                if (allLis.length === allChildCount) {
                    for (let i = 0; i < allChildCount; i++) {
                        const child = allLis[i].querySelector('label>input');
                        if (child.checked) {
                            count++;
                        }
                    }
                }
            }
            if (count === allChildCount) {
                const target = containerParentLi.querySelector('label>input');
                target.checked = true;
                self.allChildSelectedTest(target);
            }
            
        }

    }

    // look for all parents above and uncheck them as child is unchecked
    uncheckParentFromChild(child) {
        // going up two level till we get li
        const dest = child.parentNode.parentNode;
        if (dest.localName === 'li') {
            const target = dest.querySelector('label>input');
            target.checked = false;
            return this.uncheckParentFromChild(dest);
        }
        return null;
    }

    //handle serch box text change and filter the lis in the tree
    handleSearchTextChange(e) {
        const self = this;
        const value = (e.target.value).toLowerCase();
        const nodesArray = [];
        Array.prototype.forEach
            .call(self.spans, function (item) {
                // span.label.li
                const parent = item.parentNode.parentNode;
                const text = (item.innerText).toLowerCase();
                if (text.indexOf(value) > -1) {
                    // add in the nodesArray all the lis that match so that later we can 
                    // unhide the lis and its parents even they are hidden by the code below
                    nodesArray.push(parent);
                } else {
                    // hide all the lis that do not match the above condition
                    parent.setAttribute('hidden', 'hidden');
                }
            })

        nodesArray.forEach(function (node) {
            //this mathod unhides the node as well as all the parent nodes till the beginning
            self.findLastParentUlNode(node);
        });
    }

    //find all parent nodes going in upward direction recursively
    findLastParentUlNode(node) {
        //unhide the node which can be self first and then parent as it moves upward
        node.hidden = false;
        let parentNode = node.parentNode;
        // if parent is ul/li continue upward search
        if (parentNode.localName === 'li' || parentNode.localName === 'ul') {
            return this.findLastParentUlNode(parentNode);
        }
        return parentNode;
    }

    handleSelectAllEvent(){
        const temp = document.createDocumentFragment();
        temp.append(this.ulContainer);
        const inputs = temp.querySelectorAll(`input`);
        Array.prototype.forEach.call(inputs, function(eachInputItem){
            eachInputItem.checked = true;
        })
        this.container.append(temp);
    }

    handleResetAllEvent(){
        const temp = document.createDocumentFragment();
        temp.append(this.ulContainer);
        const inputs = temp.querySelectorAll('input');
        Array.prototype.forEach.call(inputs, function(eachInputItem){
            eachInputItem.checked = false;
        })
        this.container.append(temp);
    }

    handleSearchBtnClick(){
        console.log(this.ulContainer.querySelectorAll('input:checked'));
    }

}