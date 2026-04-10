import express from "express";
import cors from "cors";
import { sumar, restar, multiplicar, dividir } from "./modules/matematica.js";
import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./modules/omdb-wrapper.js";
import { Alumno } from "./models/alumno.js";


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

app.get("/omdb/searchbypage/:search/:p", async (req, res) => {
    const search = req.params.search;
    const page = Number(req.params.p);

    const resultado = await OMDBSearchByPage(search, page);

    res.status(200).json({
        respuesta: resultado.respuesta,
        cantidadTotal: resultado.cantidadTotal,
        datos: resultado.datos
    });
});


app.get("/omdb/searchcomplete/:search", async (req, res) => {
    const search = req.params.search;

    const resultado = await OMDBSearchComplete(search);

    res.status(200).json({
        respuesta: resultado.respuesta,
        cantidadTotal: resultado.cantidadTotal,
        datos: resultado.datos
    });
});


app.get("/omdb/getbyomdbid/:id", async (req, res) => {
    const imdbID = req.params.id;

    const resultado = await OMDBGetByImdbID(imdbID);

    res.status(200).json({
        respuesta: resultado.respuesta,
        cantidadTotal: resultado.cantidadTotal,
        datos: resultado.datos 
    });
});

const alumnosArray = [];
alumnosArray.push(new Alumno("Esteban Dido" , "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
alumnosArray.push(new Alumno("Elba Calao" , "32623391", 18));

app.get("/alumnos", (req, res) => {
    res.status(200).json(alumnosArray);
});