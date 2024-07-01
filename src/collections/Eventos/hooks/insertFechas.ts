import { CollectionBeforeChangeHook } from "payload/types";

export const insertFechas: CollectionBeforeChangeHook = async ({
  data, // incoming data to update or create with
  req, // full express request
  operation, // name of the operation ie. 'create', 'update'
  originalDoc, // original document
}) => {
  // If the incoming data has the `enable_multi_dates` checkbox checked
  if (data.enable_multi_dates) {
    // If the incoming data has the `fecha_unica` field
    // order date.fechas_horas by date.fecha_hora
    data.fechas_horas.sort((a, b) => {
      return (
        new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime()
      );
    });
    data.fecha_inicio = new Date(data.fechas_horas[0].fecha_hora);
    data.fecha_fin = new Date(
      data.fechas_horas[data.fechas_horas.length - 1].fecha_hora,
    );
  } else {
    const fecha_unica = new Date(data.fecha_unica);
    data.fecha_inicio = fecha_unica;
    data.fecha_fin = fecha_unica;
    data.fechas_horas = [{ fecha_hora: fecha_unica }];
  }
  return data; // Return data to either create or update a document with
};
