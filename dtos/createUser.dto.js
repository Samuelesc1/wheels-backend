export function CreateUserDTO(body) {
  // filtra y devuelve solo los campos permitidos del body
  return {
    nombre: body.nombre,
    apellido: body.apellido,
    idUniversidad: body.idUniversidad,
    correo: body.correo,
    numeroContacto: body.numeroContacto,
    foto: body.foto,
    rol: body.rol,
    placaVehiculo: body.placaVehiculo,
    fotoVehiculo: body.fotoVehiculo,
    capacidadVehiculo: body.capacidadVehiculo ? Number(body.capacidadVehiculo) : undefined,
    fotoSOAT: body.fotoSOAT,
    marca: body.marca,
    modelo: body.modelo,
    password: body.password
  };
}
