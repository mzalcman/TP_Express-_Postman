import express from "express";
import cors from "cors";
import { sumar, restar, multiplicar, dividir } from "./modules/matematica.js";
import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./modules/omdb-wrapper.js";
import Alumno from "./models/alumno.js";
import ValidacionesHelper from './modules/validaciones-helper.js';
import DateTimeHelper     from './modules/datetime-helper.js';


const app = express();
const port = 5000;

// Agrego los Middlewares
app.use(cors()); // Middleware de CORS
app.use(express.json()); // Middleware para parsear y comprender JSON


// EndPoint "/"
app.get('/', (req, res) => { 
    res.status(200).send('Ya estoy respondiendo!');
})

app.get('/saludar/:nombre', (req, res) => {
    const nombre = ValidacionesHelper.getStringOrDefault(req.params.nombre, 'Anónimo');

    res.status(200).send(`Hola ${nombre}`);
})

app.get('/validarfecha/:ano/:mes/:dia', (req, res) => {

    const ano = ValidacionesHelper.getIntegerOrDefault(req.params.ano, 0);
    const mes = ValidacionesHelper.getIntegerOrDefault(req.params.mes, 0);
    const dia = ValidacionesHelper.getIntegerOrDefault(req.params.dia, 0);

    if (ano === 0 || mes === 0 || dia === 0) {
        return res.status(400).send("Parámetros inválidos");
    }

    const fecha = new Date(ano, mes - 1, dia);

    if (
        fecha.getFullYear() !== ano ||
        fecha.getMonth() !== mes - 1 ||
        fecha.getDate() !== dia
    ) {
        return res.status(400).send("Fecha inválida");
    }

    res.status(200).send("Fecha válida");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Endpoints matemática.js
app.get("/matematica/sumar/:n1/:n2", (req, res) => {
    const n1 = ValidacionesHelper.getIntegerOrDefault(req.params.n1, null);
    const n2 = ValidacionesHelper.getIntegerOrDefault(req.params.n2, null);

    if (n1 === null || n2 === null) {
        return res.status(400).send("n1 y n2 deben ser números");
    }

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

// Endpoints omdb-wrapper.js
app.get("/omdb/searchbypage/:search/:p", async (req, res) => {
    const search = ValidacionesHelper.getStringOrDefault(req.params.search, "");
    const page   = ValidacionesHelper.getIntegerOrDefault(req.params.p, 1);

    if (search === "") {
        return res.status(400).send("search es obligatorio");
    }

    const resultado = await OMDBSearchByPage(search, page);

    res.status(200).json({
        respuesta: resultado.respuesta,
        cantidadTotal: resultado.cantidadTotal,
        datos: resultado.datos
    });
});



app.get("/omdb/searchcomplete/:search", async (req, res) => {
    const search = ValidacionesHelper.getStringOrDefault(req.params.search, "");

    if (search === "") {
        return res.status(400).send("search es obligatorio");
    }

    const resultado = await OMDBSearchComplete(search);

    res.status(200).json({
        respuesta: resultado.respuesta,
        cantidadTotal: resultado.cantidadTotal,
        datos: resultado.datos
    });
});




app.get("/omdb/getbyomdbid/:id", async (req, res) => {
    const imdbID = ValidacionesHelper.getStringOrDefault(req.params.id, "");

    if (imdbID === "") {
        return res.status(400).send("imdbID es obligatorio");
    }

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

// Endpoints alumnos.js
app.get("/alumnos", (req, res) => {
    res.status(200).json(alumnosArray);
});

app.get("/alumnos/:dni", (req, res) => {
    const dni = ValidacionesHelper.getStringOrDefault(req.params.dni, "");

    if (dni === "") {
        return res.status(400).send("dni obligatorio");
    }

    const alumno = alumnosArray.find(a => a.dni === dni);

    if (!alumno) {
        return res.status(404).json({ error: "Alumno no encontrado" });
    }

    res.status(200).json(alumno);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/alumnos", (req, res) => {
    const username = ValidacionesHelper.getStringOrDefault(req.body?.username, "");
    const dni      = ValidacionesHelper.getStringOrDefault(req.body?.dni, "");
    const edad     = ValidacionesHelper.getIntegerOrDefault(req.body?.edad, 0);

    if (username === "" || dni === "" || edad <= 0) {
        return res.status(400).send("username, dni y edad son obligatorios");
    }

    const existe = alumnosArray.find(a => a.dni === dni);

    if (existe) {
        return res.status(400).send("El alumno ya existe");
    }

    const nuevoAlumno = new Alumno(username, dni, edad);
    alumnosArray.push(nuevoAlumno);

    res.status(201).json(nuevoAlumno);
});


app.delete("/alumnos", (req, res) => {
    const dni = ValidacionesHelper.getStringOrDefault(req.body?.dni, "");

    if (dni === "") {
        return res.status(400).send("dni obligatorio");
    }

    const index = alumnosArray.findIndex(a => a.dni === dni);

    if (index === -1) {
        return res.status(404).json({ error: "Alumno no encontrado" });
    }

    alumnosArray.splice(index, 1);

    res.status(200).json({ mensaje: "Alumno eliminado" });
});


app.get("/fechas/isDate", (req, res) => {
    const fecha = ValidacionesHelper.getDateOrDefault(req.query.fecha, null);

    if (!DateTimeHelper.isDate(fecha)) {
        return res.status(400).send("Fecha inválida");
    }

    res.status(200).json({
        valido: true
    });
});


app.get("/fechas/getEdadActual", (req, res) => {
    const fechaNacimiento = ValidacionesHelper.getDateOrDefault(req.query.fechaNacimiento, null);

    if (!DateTimeHelper.isDate(fechaNacimiento)) {
        return res.status(400).send("Fecha inválida");
    }

    res.status(200).json({
        edad: DateTimeHelper.getEdadActual(fechaNacimiento)
    });
});


app.get("/fechas/getDiasHastaMiCumple", (req, res) => {
    const fechaNacimiento = ValidacionesHelper.getDateOrDefault(req.query.fechaNacimiento, null);

    if (!DateTimeHelper.isDate(fechaNacimiento)) {
        return res.status(400).send("Fecha inválida");
    }

    res.status(200).json({
        diasRestantes: DateTimeHelper.getDiasHastaMiCumple(fechaNacimiento)
    });
});


app.get("/fechas/getDiaTexto", (req, res) => {
    const fecha = ValidacionesHelper.getDateOrDefault(req.query.fecha, null);
    const abr   = ValidacionesHelper.getBooleanOrDefault(req.query.abr, false);

    if (!DateTimeHelper.isDate(fecha)) {
        return res.status(400).send("Fecha inválida");
    }

    res.status(200).json({
        dia: DateTimeHelper.getDiaTexto(fecha, abr)
    });
});


app.get("/fechas/getMesTexto", (req, res) => {
    const fecha = ValidacionesHelper.getDateOrDefault(req.query.fecha, null);
    const abr   = ValidacionesHelper.getBooleanOrDefault(req.query.abr, false);

    if (!DateTimeHelper.isDate(fecha)) {
        return res.status(400).send("Fecha inválida");
    }

    res.status(200).json({
        mes: DateTimeHelper.getMesTexto(fecha, abr)
    });
});