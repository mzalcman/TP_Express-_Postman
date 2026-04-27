class DateTimeHelper {

  isDate = (fecha) => {
    return fecha instanceof Date && !isNaN(fecha.getTime());
  };

  getOnlyDate = (fecha = new Date()) => {
    const copia = new Date(fecha);
    copia.setHours(0, 0, 0, 0);
    return copia;
  };

  getEdadActual = (fechaNacimiento) => {
    if (!this.isDate(fechaNacimiento)) return -1;

    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    return edad;
  };

  getDiasHastaMiCumple = (fechaNacimiento) => {
    if (!this.isDate(fechaNacimiento)) return -1;

    const hoy = new Date();
    let proximo = new Date(
      hoy.getFullYear(),
      fechaNacimiento.getMonth(),
      fechaNacimiento.getDate()
    );

    if (proximo < hoy) {
      proximo.setFullYear(hoy.getFullYear() + 1);
    }

    const diff = proximo - hoy;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  getDiaTexto = (fecha, abr = false) => {
    if (!this.isDate(fecha)) return null;

    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const dia = dias[fecha.getDay()];

    return abr ? dia.substring(0, 3) : dia;
  };

  getMesTexto = (fecha, abr = false) => {
    if (!this.isDate(fecha)) return null;

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                   "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const mes = meses[fecha.getMonth()];

    return abr ? mes.substring(0, 3) : mes;
  };
}

export default new DateTimeHelper();