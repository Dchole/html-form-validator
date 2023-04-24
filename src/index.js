import "./styles.css";

const FORM = document.querySelector("form");

/**
 * @function to initialise form validation
 * @param {HTMLFormElement} form - form element to validate
 */
function init(form, onSubmit) {
  form.noValidate = true;
  const touchedInputs = [];
  const initialDescriptionProps = {};

  form.addEventListener("focusout", (event) => {
    if (event.target.tagName.toLowerCase() === "input") {
      checkInputValidity(event.target);
      touchedInputs.push(event.target.name);
      checkInputValidity(event.target);
    }
  });

  form.addEventListener("input", (event) => checkInputValidity(event.target));

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (checkFormValidity(form)) onSubmit(event);
    else {
      const inputs = form.querySelectorAll("input");
      inputs.forEach((input) => {
        touchedInputs.push(input.name);
        checkInputValidity(input);
      });
    }
  });

  /**
   *
   * @param {HTMLInputElement & EventTarget} input
   */
  function checkInputValidity(input) {
    const { name, validity, validationMessage } = input;

    /** @type {HTMLInputElement} */
    const messageEl = document.getElementById(`${name}-field-description`);

    if (!initialDescriptionProps[name]) {
      initialDescriptionProps[name] = getProps(messageEl);
    }

    if (touchedInputs.includes(name) && !validity.valid) {
      console.log(touchedInputs, name, validity.valid);
      messageEl.innerText = validationMessage;
      messageEl.classList.add("error");
      input.classList.add("error");
    } else {
      const initialEl = initialDescriptionProps[name];
      for (const attr in initialEl.attributes) {
        messageEl.setAttribute(attr, initialEl.attributes[attr]);
      }
      messageEl.replaceChildren(...initialEl.children);
      input.classList.remove("error");
    }
  }

  /**
   * @param {HTMLFormElement} form - form to validate
   */
  function checkFormValidity(form) {
    return form.checkValidity();
  }

  /**
   *
   * @param {HTMLElement} el
   * @returns {HTMLElement}
   */
  function getProps(el) {
    const props = { attributes: {}, children: el.children };

    const attributeNames = el.getAttributeNames();
    attributeNames.splice(attributeNames.indexOf("id"), 1);

    for (const attribute of attributeNames) {
      props.attributes[attribute] = el.getAttribute(attribute);
    }

    return props;
  }
}

init(FORM, () => {
  console.log("form submitted");
});
