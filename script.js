document.getElementById('calculate').addEventListener('click', calculateDerivative);
document.getElementById('clear').addEventListener('click', clearFields);
document.getElementById('close').addEventListener('click', closeWindow); // Vinculación del botón cerrar

const appendToFormula = (char) => {
    const formulaInput = document.getElementById('formula');
    formulaInput.value += char;
};

const deleteLastChar = () => {
    const formulaInput = document.getElementById('formula');
    formulaInput.value = formulaInput.value.slice(0, -1);
};

function calculateDerivative() {
    const expressionInput = document.getElementById('formula').value.trim();

    try {
        let parsedExpression;
        // Reemplazar símbolos de raíz por la notación de potencia
        if (expressionInput.includes('√')) {
            expressionInput = expressionInput.replace(/√(\d+)/g, 'sqrt($1)');
            parsedExpression = math.parse(expressionInput);
        } else {
            parsedExpression = math.parse(expressionInput);
        }

        const derivative = math.derivative(parsedExpression, 'x');
        const simplifiedDerivative = math.simplify(derivative).toString();

        document.getElementById('functionInput').value = `Función: ${expressionInput}`;
        document.getElementById('derivativeOutput').value = `Derivada: ${simplifiedDerivative}`;

        // Graficar las funciones
        plotFunction(parsedExpression, 'functionGraph', 'Función Original');
        plotFunction(derivative, 'derivativeGraph', 'Derivada');

    } catch (error) {
        alert('Por favor, introduce una función válida. ' + error.message);
    }
}

function clearFields() {
    document.getElementById('formula').value = '';
    document.getElementById('functionInput').value = '';
    document.getElementById('derivativeOutput').value = '';
    Plotly.purge('functionGraph');
    Plotly.purge('derivativeGraph');
}

function plotFunction(expression, plotId, title) {
    const xValues = math.range(-10, 10, 0.1).toArray();
    const yValues = xValues.map(x => expression.evaluate({x}));

    const trace = {
        x: xValues,
        y: yValues,
        mode: 'lines',
        name: title
    };

    const layout = {
        title: title,
        xaxis: { title: 'x' },
        yaxis: { title: 'y' }
    };

    Plotly.newPlot(plotId, [trace], layout);
}

function closeWindow() {
    window.close();
}

// Función para manejar clics en los botones
function handleButtonClick(event) {
    const value = this.textContent;
    if (value === '⌫') {
        deleteLastChar();
    } else if (value === 'AC') {
        clearFields();
    } else if (value !== '=') {
        appendToFormula(value);
    }
}

// Asegurarse de que los eventos de clic se agreguen solo una vez
document.querySelectorAll('.button').forEach(button => {
    button.removeEventListener('click', handleButtonClick); // Eliminar cualquier evento previo
    button.addEventListener('click', handleButtonClick); // Agregar el nuevo evento
});
