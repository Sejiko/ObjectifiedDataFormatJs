class ObjectifiedDataFormat {
	constructor() {
		this.objectContainer = document.querySelectorAll("[data-container]");
		this.boundFunctionList = [];
		this.objectList = [];
		this.init();
	}

	getObjectName(obj) {
		for (var nameOfVariable in window) {
			if (eval(nameOfVariable + "=== obj")) {
				return nameOfVariable;
			}
		}
		return false;
	}

	init() {
		this.createObjectList();
		this.createFunctionBindings();
	}

	createFunctionBindings() {
		let functionsToBind = document.querySelectorAll("[data-bindfunction]");
		for (let userFunction of functionsToBind) {
			let functionInformation = userFunction.dataset.bindfunction.split(/=|\./);
			this.boundFunctionList.push(functionInformation[2].trim());
			let usfunc =
				functionInformation[1].trim() + "." + functionInformation[2].trim();
			userFunction.addEventListener(functionInformation[0].trim(), () => {
				eval(usfunc)();
			});
		}
	}

	createObjectList() {
		for (let singleObject of this.objectContainer) {
			this.createObject(singleObject);
		}
	}

	createObject(objectSelector) {
		let globalObject = this.defineObject(objectSelector);
		this.defineObjectProperties(objectSelector, globalObject);
		this.createTwoWayBindings(objectSelector, globalObject);
		this.objectList.push();
	}

	defineObject(object) {
		window[object.dataset.container] = new Proxy(Object.create(Object), {
			get: (target, property, receiver) => {
				if (property === "getInformation") {
					return Object.assign({},
						...Object.getOwnPropertyNames(target).map(k => ({
							[k]: target[k]
						}))
					);
				}

				if (this.boundFunctionList.indexOf(property) > -1) {
					let origMethod = target[property];
					return function (...args) {
						origMethod.apply(target, args);
					};
				}

				return target[property];
			},
			set(obj, prop, value, receiver) {
				if (typeof value === "string") {
					value = value.trim();
				}

				const customEvent = new CustomEvent(
					object.dataset.container + "." + prop + "_updateview", {
						bubbles: true,
						detail: {
							value
						}
					}
				);

				document.querySelector("body>*").dispatchEvent(customEvent);
				return Reflect.set(obj, prop, value, receiver);
			}
		});

		return window[object.dataset.container];
	}

	defineObjectProperties(objectSelector, globalObject) {
		//Hint: init attributes
		let objectAttributeList = objectSelector.querySelectorAll(
			"[data-attribute]"
		);

		for (let objectAttribute of objectAttributeList) {
			let attributeName = objectAttribute.dataset.attribute;
			Object.defineProperty(globalObject, attributeName, {
				value: "",
				writable: true
			});
		}

		Object.defineProperty(globalObject, "getInformation", {
			writable: false,
			configurable: true
		});
	}

	createTwoWayBindings(objectSelector, globalObject) {
		let listeners = objectSelector.querySelectorAll("[data-attribute]");
		let modelView = Array.from(document.querySelectorAll("[data-bind]"));
		modelView.forEach(valueToUpdate => {
			document
				.querySelector("body")
				.addEventListener(valueToUpdate.dataset.bind + "_updateview", function (
					event
				) {
					//Hint: triggers ModelView to update
					valueToUpdate.innerHTML = event.detail.value;
				});
		});

		listeners.forEach(listener => {
			const attributeName = listener.dataset.attribute; //name
			listener.addEventListener("keyup", event => {
				//HINT: activates setter of Created Object
				globalObject[attributeName] = listener.value;
			});
		});
	}
}

const _ObjectifiedDataFormat = new ObjectifiedDataFormat();