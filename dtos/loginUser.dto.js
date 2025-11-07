export function LoginUserDTO(body) {
  return {
    correo: body.correo,
    password: body.password
  };
}
