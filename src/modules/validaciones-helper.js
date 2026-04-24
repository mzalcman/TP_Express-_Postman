class ValidacionesHelper {

  getIntegerOrDefault = (value, defaultValue) =>
    { 
        if (value === undefined || value === null) return defaultValue;

        const str = String(value).trim();

        if (!/^-?\d+$/.test(str)) {
          return defaultValue;
        }

      return Number(str);
    };

  getStringOrDefault = (value, defaultValue) =>
    {
        if (value === undefined || value === null) return defaultValue;
        if (value.trim() == "") return defaultValue;
        return String(value);
    };

  getDateOrDefault = (value, defaultValue) =>
    {
         if (value === undefined || value === null) return defaultValue;

        const fecha = new Date(value);
        return isNaN(fecha.getTime()) ? defaultValue : fecha;
    };

  getBooleanOrDefault = (value, defaultValue) =>
    {
        if (value === true || value === false) return value;

        if (typeof value === "string") {
        if (value.toLowerCase() === "true") return true;
        if (value.toLowerCase() === "false") return false;

        return defaultValue;
    }
    };

  isEmail = (value) => 
    {
      if (!value) return false;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    };

}


export default new ValidacionesHelper();