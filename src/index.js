import express from "express";
import cors from "cors";
import { sumar, restar, multiplicar, dividir } from "./modules/matematica.js";

const app = express();
const port = 5000;

// Agrego los Middlewares
app.use(cors()); // Middleware de CORS
app.use(express.json()); // Middleware para parsear y comprender JSON


app.get('/', (req, res) => { // EndPoint "/"
    res.status(200).send('Ya estoy respondiendo!');
})

app.get('/saludar/:nombre', (req, res) => { // EndPoint "/saludar"
    res.status(200).send(`Hola ${req.params.nombre}`);
})

app.get('/validarfecha/:ano/:mes/:dia', (req, res) => { // EndPoint "/saludar"
    const { ano, mes, dia } = req.params;

    // Armamos la fecha en formato válido
    const fecha = `${ano}-${mes}-${dia}`;

    // Validamos con Date.parse
    if (isNaN(Date.parse(fecha))) {
        return res.status(400).send("Fecha inválida");
    }

    res.status(200).send("Fecha válida")
})


//
// Inicio el Server y lo pongo a escuchar.
//
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Endpoints matemática.js
app.get("/matematica/sumar/:n1/:n2", (req, res) => {
    const n1 = Number(req.params.n1);
    const n2 = Number(req.params.n2);

    const resultado = sumar(n1, n2);

    res.status(200).json({ resultado });
});

app.get("/matematica/restar/:n1/:n2", (req, res) => {
    const n1 = Number(req.params.n1);
    const n2 = Number(req.params.n2);

    const resultado = restar(n1, n2);

    res.status(200).json({ resultado });
});

app.get("/matematica/multiplicar/:n1/:n2", (req, res) => {
    const n1 = Number(req.params.n1);
    const n2 = Number(req.params.n2);

    const resultado = multiplicar(n1, n2);

    res.status(200).json({ resultado });
});

app.get("/matematica/dividir/:n1/:n2", (req, res) => {
    const n1 = Number(req.params.n1);
    const n2 = Number(req.params.n2);

    if (n2 === 0) {
        return res.status(400).json({ error: "El divisor no puede ser cero" });
    }

    const resultado = dividir(n1, n2);

    res.status(200).json({ resultado });
});