/*
 * Vista administrador
 */
var VistaAdministrador = function (modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(() => contexto.reconstruirLista());
  this.modelo.preguntaEliminada.suscribir(() => contexto.reconstruirLista());
  this.modelo.votoAgregado.suscribir(() => contexto.reconstruirLista());
  this.modelo.preguntaEditada.suscribir(() => contexto.reconstruirLista());
  this.modelo.todoEliminado.suscribir(() => contexto.reconstruirLista());
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function () {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    validacionDeFormulario();
    this.reconstruirLista();
    this.configuracionDeBotones();
  },

  construirElementoPregunta: function (pregunta) {
    var contexto = this;
    var nuevoItem = $("<li>", { 'class': 'list-group-item', 'id': pregunta.id, 'textoPregunta': pregunta.textoPregunta })
    //var nuevoItem = $(`<li class='list-group-item' id=${pregunta.id}> ${pregunta.textoPregunta} </li> `)

    //completar
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function (resp) {
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());

    return nuevoItem;
  },


  reconstruirLista: function () {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    console.log(preguntas); 
    for (var i = 0; i < preguntas.length; ++i) {
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },


  configuracionDeBotones: function () {
    var e = this.elementos;
    var contexto = this;
    //asociacion de eventos a boton

    e.botonAgregarPregunta.click(function () {
      var pregunta = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function () {
        var respuesta = $(this).val()
        if (respuesta !== "") {
          var cantVotos = 0;
          var nuevaRespuesta = { 'textoRespuesta': respuesta, 'cantidad': cantVotos }
          respuestas.push(nuevaRespuesta);
        }
      })
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(pregunta, respuestas);

    });
    
    e.botonBorrarPregunta.click(function () {
      var id = parseInt($('.list-group-item.active').attr('id'))
      console.log(id);
      contexto.controlador.borrarPregunta(id);
    })
    //asociar el resto de los botones a eventos
    
    e.botonEditarPregunta.click(function () {

      var id = parseInt($('.list-group-item.active').attr('id'))
      if(id) {
        let nuevaPregunta = prompt('Ingrese una nueva pregunta');
        contexto.controlador.editarPregunta(id, nuevaPregunta);
      }
    })

    e.borrarTodo.click(function () {
      contexto.controlador.borrarTodo(); 
    })
  },

  limpiarFormulario: function () {
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
