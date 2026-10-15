
let display = document.getElementById("display");
let expression = "";
let finished = false;

function append(value) {
    if (finished && /[0-9.]/.test(value)) {
        expression = "";
    }

    finished = false;
    expression += value;
    updateDisplay();
}

function updateDisplay() {
    display.value = expression || "0";

    try {
        let result = calculateExpression(expression);
        if (result !== null) {
            display.value = result;
        }
    } catch (error) {
        // Keep showing the entered expression.
    }
}

function calculateExpression(exp) {
    if (!exp || !/^[0-9+\-*/.%()\s]+$/.test(exp)) {
        return null;
    }

    // Convert percentages, for example 50% to (50/100).
    exp = exp.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

    let result = Function('"use strict"; return (' + exp + ')')();

    if (typeof result !== "number" || !Number.isFinite(result)) {
        return null;
    }

    return Number(result.toPrecision(10));
}

function calculate() {
    try {
        let result = calculateExpression(expression);

        if (result === null) {
            display.value = "Error";
            expression = "";
        } else {
            expression = String(result);
            display.value = expression;
        }

        finished = true;
    } catch (error) {
        display.value = "Error";
        expression = "";
        finished = true;
    }
}

function clearDisplay() {
    expression = "";
    display.value = "0";
    finished = false;
}

function deleteLast() {
    expression = expression.slice(0, -1);
    finished = false;
    updateDisplay();
}

// Keyboard support
document.addEventListener("keydown", function(event) {
    if (/^[0-9.]$/.test(event.key)) {
        append(event.key);
    } else if (["+", "-", "*", "/", "%", "(", ")"].includes(event.key)) {
        append(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        deleteLast();
    } else if (event.key === "Escape") {
        clearDisplay();
    }
});
