## Document Object Model  

The Document Object Model is used to access and change html elements dynamically.
The way in which to use these methods looks like this. `document.getElementById("demo")`.  
### First some basic JS notation

#### Assigning variables:
- `let name = "Rory"; `  
    This is a global variable that can be updated.
- `const age = 25; `  
    This is a global variable that cannot be updated.

#### Function declaration:  
- `function nextStep() {}`  
    The function name is NextStep and can be called as such. the contents of the function are placed in the curly brackets.  
- `function(user) {return user.online;}`  
    Functions can also be declared with the short hand method: `user => user.online`.  
    This can be useful for array methods or things where u must pass a function and return something. such as `users.every((user) => {user.ISONLINE})`
#### mathematical operators:  
- addition  
    `+`
- subtraction  
    `-`
- multiplication  
    `*`
- exponentiation  
    `**`
- division  
    `/`
- modular (remainder)    
    `%`
- increment  
    `++` and `--`

#### Using scope:  

When creating a function and passing a variable, it passes primitive values, essentially a copy of the variable. Not by reference.

<pre>
let a = 4;

function Dosomething(variable) {
    variable =variable+2
}
console.log(a)
>>> 4
</pre>

#### Objects:  
Objects name:value pairs created inside curly braces:  
`{firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"};`  
it can also be created in the following format. (like a class).
<pre>
const person = {};

// Add Properties
person.firstName = "John";
person.lastName = "Doe";
person.age = 50;
person.eyeColor = "blue";
</pre>  
or can be created like this:  
`const mySelf = new Person("Johnny", "Rally", 22, "green");`  
a object method is referenced as `this` (instead of self).
you can use the const variable to make it immutable. also note that whenever an object is passed into a function, it passes the reference, so can be updated from within a function.  

#### For loop:  
<pre>
for (expression 1; expression 2; expression 3) {
  // code block to be executed
}

for (let i = 0; i < 10; i++) {
    console.log(i)
}
//will print the 0-9 values
</pre>  

- expression 1 is executed one time before the execution of the code block
- expression 2 is the condition for executing the code block
- expresssion 3 is executed every time before the code block has been executed.

#### If statement:  

<pre>
if (condition) {
      // Code if true
    } else {
      // Code if false
    }
</pre>

The if else statement uses the above notation. also note that it can be run with just the if statement.


### Method for find html content:
- `getElementbyId()`  
    If printed in the console, it will print the divs with this id.
- `document.getElementsByTagName(name)`  
    Finds the element by tag name.
- `document.getElementsByClassName(name)`  
    Finds the element by classname.
- `getElementsbyClassName(name)[0].id`  
    will return the elements id of the first element.

### Methods for updating html content:
The way in which these methods are used would look something like this. `document.getElementById("demo").innerHTML = "Hello World!";`
- `innerHTML()`  
    This property can update the contents of html divs. 
- `element.attribute = *new value*`  
    Change the attribute value of an element.
- `element.style.property = new style`  
    Change the style of a element.
- `element.setAttribute(attribute, value)`  
    Set the attribute of an element.
### Adding or deleting elements: 
- `document.createElement(element)`
- `document.removeChild(element)`
- `document.appendChild(element)`
- `document.replaceChild(new, old)`
- `document.write(text)`

### Event handler:  
`document.getElementById(id).onclick = function(){code}`  
The above code adds a handler for all elements when they are clicked.  

- `const x = document.querySelectorAll("p.intro");`  
The above code will return all <p> elements with class="intro"

### Class list: 

The class list can be used to edit the classes in a html element.

<pre>
const list = element.classList;
list.add("myStyle"); 
</pre>
The above code will add the myStyle class (as defined in the css) to that particular element.
`<button onclick="myFunction()">Add</button>`
Note that the code above is also how a button can execute javascript
- `list.remove("myStyle");`
- `list.toggle("myStyle");` 
toggles on and off the style class
Where list is a list of classes for a particular element.
- `list.add("myStyle");`

### Map  
The map has some useful features.
- `const myMap new Map();`
- `myMap.get(key);`




