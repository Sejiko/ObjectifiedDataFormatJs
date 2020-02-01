# ObjectifiedDataFormatJS

---

## General Idea

This Library is designed to create an javascript object from a defined Html structure.
The idea is to pack all data as an object togehter, therefore allows you easy and fast access to it. It has build-in two-way databinding.

## How to use

### Keywords

#### html data-tags

- `data-container`
- `data-attribute`
- `data-bindfunction`
- `data-bind`

#### js object information

- `getInformation`

First we need to setup our structure inside html:

```html
<div data-container="Person">
  <label for="firstname">Enter Name</label>
  <input id="firstname" type="text" data-attribute="name" />
  <label for="lastname">Enter Surname</label>
  <input id="lastname" type="text" data-attribute="surname" />
</div>
```

This creates a javascript object "Person" with the properties "name" and "surname".
When a user Enters now Text inside an inputfield it gets atomatically updated inside javascript.

---

Now lets say we want to validat the user Input with an function we provide.

Setup Html:

```html
<div data-container="Person">
  <label for="firstname">Enter Name</label>
  <input id="firstname" type="text" data-attribute="name" />
  <label for="lastname">Enter Surname</label>
  <input id="lastname" type="text" data-attribute="surname" />
  <button data-bindfunction="click=Person.validate">
    click me to execute a function
  </button>
</div>
```

Setup JS:

```js
Person.validate = () => {
  if (this.name.length > 0) {
    alert("The Person name is valid");
  }
};
```

As you can see with `data-bindfunction` you can add an eventlistener with your own funtion and also can access the data via this.

Syntax description:
`data-bindfunction = "EVENT=OBJECTNAME.METHODNAME"`
