/*
* Modelo
*/
var Modelo = function () {
  this.preguntas = preguntasParseadas; 
  this.ultimoId = idParseado;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.votoAgregado = new Evento(this);
  this.preguntaEditada = new Evento(this); 
  this.todoEliminado = new Evento(this); 
};

 
var preguntasGuardadas = (function(){

  if(localStorage.getItem('preguntas')===null){
     
    return "[]"
  } else {
    return localStorage.getItem('preguntas')}
  })(); 
    
var preguntasParseadas = JSON.parse(preguntasGuardadas);
var idParseado = (function () {
  var ids = [];
  if (preguntasParseadas.length === 0) {
    return 0
  } else {
    preguntasParseadas.forEach(pregunta => {
      ids.push(pregunta.id)
    })
  }
  return ids.reduce((prev, current) => current > prev ? current : prev)
})();



Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function () {
    return this.ultimoId;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function (pregunta, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    this.ultimoId = id;
    var nuevaPregunta = { 'textoPregunta': pregunta, 'id': id, 'cantidadPorRespuesta': respuestas };
    this.preguntas.push(nuevaPregunta);
    console.log(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  //se guardan las preguntas
  guardar: function () {
    localStorage.setItem('preguntas', JSON.stringify(this.preguntas))

  },

  borrar: function () {
    localStorage.removeItem('preguntas');
    localStorage.setItem('preguntas', JSON.stringify(this.preguntas))

  },

  borrarPregunta: function (id) {
    var contexto = this;

    this.preguntas.forEach(objetoPregunta => {
      var elementoIdentificado = (objetoPregunta.id === id);
      if (elementoIdentificado) {
        var posicion = contexto.preguntas.indexOf(objetoPregunta)
        contexto.preguntas.splice(posicion, 1);
      }
      this.borrar();
      this.preguntaEliminada.notificar();
    })
  },

  editarPregunta: function (id, nuevaPregunta) {
    console.log(id);
    var contexto = this;
    this.preguntas.forEach(objetoPregunta => {
      var elementoIdentificado = (objetoPregunta.id === id);
      if (elementoIdentificado) {
        objetoPregunta.textoPregunta = nuevaPregunta;
      }
    })

    this.guardar();
    this.preguntaEditada.notificar(); 

  },

  agregarVoto: function (nombrePregunta, respuestaSeleccionada) {
    console.log(nombrePregunta, respuestaSeleccionada);

    this.preguntas.forEach(pregunta => {
      if (pregunta.textoPregunta === nombrePregunta) {
        var respuestas = pregunta.cantidadPorRespuesta;
        respuestas.forEach(respuesta => {
          if (respuesta.textoRespuesta == respuestaSeleccionada) {
            respuesta.cantidad += 1;
          }
        })
      }
    })
    this.guardar();
    this.votoAgregado.notificar();
  },

  borrarTodo: function () {
    this.preguntas = []; 
    this.guardar();
    this.todoEliminado.notificar();
  }

};

