ENDPOINTS DE ESPACIOS

GET [/espacios] obtengo todos los espacios ------------HECHO
GET [/espacios/:idEspacio] un espacio en particular --------HECHO
POST [/espacios] inserto un espacio nuevo --------HECHO
POST [/espacios/:idEspacio/fotos] añado una foto -----------HECHO
POST [/espacios/:idEspacio/votos] añado un voto al espacio-------------------------------------------
PUT [/espacios/:idEspacio] edito un espacio concreto ----------HECHO
DELETE [/espacios/:idEspacio] elimino un espacio ------------HECHO
DELETE [/espacios/:idEspacio/fotos/:idFoto] elimino una foto----------------HECHO



ENDPOINTS DE USUARIOS

GET [/usuarios/:idUsuario] me da info de un usuario concreto ------------------------HECHO
POST [/usuarios] crea un usuario pendiente de validar--------------------------HECHO
POST [/usuarios/registro] logea a un usuario retornando un token----------------HECHO
GET [/usuarios/validado/:codigoRegistro] valida un usuario recien registrado
PUT [/usuarios/:idUsuario] edita campos del usuario------------HECHO
PUT [/usuarios/:idUsuario/password] cambia la pass
PUT [/usuarios/password/recover] envia un correo de reseteo
PUT [/usuarios/password/reset] resetea la contrasena
DELETE [/usuarios/:idUser] borra un usuario------------------------DONE TE






ENDPOINTS DE RESERVAS---DUDASSSSSS----------

POST /espacios/:idEspacio/reservas hago una reserva como usuario
GET /reservas me devuelve la info de mis reservas
GET /reservas/:idReserva obtengo informacion de una reserva en concreto
PUT /reservas/:idReserva modifico una reserva
DELETE /reservas/:idReserva elimino una reserva
