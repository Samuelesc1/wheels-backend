export class UserEntity {
  constructor({ id, nombre, apellido, idUniversidad, correo, numeroContacto, foto, rol, placaVehiculo, fotoVehiculo, capacidadVehiculo, fotoSOAT, marca, modelo }) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.idUniversidad = idUniversidad;
    this.correo = correo;
    this.numeroContacto = numeroContacto;
    this.foto = foto;
    this.rol = rol;
    this.placaVehiculo = placaVehiculo;
    this.fotoVehiculo = fotoVehiculo;
    this.capacidadVehiculo = capacidadVehiculo;
    this.fotoSOAT = fotoSOAT;
    this.marca = marca;
    this.modelo = modelo;
  }
}
