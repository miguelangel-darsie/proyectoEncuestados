/*
 * Controlador
 */
var Controlador = function (modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function (pregunta, respuestas) {
    this.modelo.agregarPregunta(pregunta, respuestas);
  },
  borrarPregunta: function (id) {
    this.modelo.borrarPregunta(id);
  },
  agregarVoto: function (nombrePregunta, respuestaSeleccionada) {
    this.modelo.agregarVoto(nombrePregunta, respuestaSeleccionada);
  },
  editarPregunta: function (id, nuevaPregunta) {
    this.modelo.editarPregunta(id, nuevaPregunta);
  },
  borrarTodo: function () {
    this.modelo.borrarTodo();
  },
};
