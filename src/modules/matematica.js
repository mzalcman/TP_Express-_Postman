const PI = 3.14;
function sumar(x, y) {
    return x + y;
}
function restar(x, y) {
    return x - y;
}
const multiplicar = (a, b) => {
    return a * b;
};
const dividir = (a, b) => {
    return a / b;
};
// Exporto todo lo que yo quiero exponer del módulo hacia el exterior.

const variablesDefinidas =  ["dos", "cuatro", "ocho", "diez"]
export { PI, sumar, restar, multiplicar, dividir, variablesDefinidas};