/*
 * Vista usuario
 */
var VistaUsuario = function (modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  //suscripcion a eventos del modelo
  this.modelo.preguntaAgregada.suscribir(() => contexto.reconstruirLista())
  this.modelo.preguntaEliminada.suscribir(() => contexto.reconstruirLista());
  this.modelo.votoAgregado.suscribir(() => contexto.reconstruirGrafico());
  this.modelo.preguntaEditada.suscribir(() => contexto.reconstruirLista());
  this.modelo.todoEliminado.suscribir(() => contexto.reconstruirLista());

};

VistaUsuario.prototype = {
  //muestra la lista por pantalla y agrega el manejo del boton agregar
  inicializar: function () {
    this.reconstruirLista();
    var elementos = this.elementos;
    var contexto = this;

    elementos.botonAgregar.click(function () {
      contexto.agregarVotos();
    });

    this.reconstruirGrafico();
  },

  //reconstruccion de los graficos de torta
  reconstruirGrafico: function () {
    var contexto = this;
    //obtiene las preguntas del local storage
    var preguntas = this.modelo.preguntas;
    preguntas.forEach(function (pregunta) {
      var listaParaGrafico = [[pregunta.textoPregunta, 'Cantidad']];
      var respuestas = pregunta.cantidadPorRespuesta;
      respuestas.forEach(function (respuesta) {
        listaParaGrafico.push([respuesta.textoRespuesta, respuesta.cantidad]);
      });
      contexto.dibujarGrafico(pregunta.textoPregunta, listaParaGrafico);
    })
  },


  reconstruirLista: function () {

    var listaPreguntas = this.elementos.listaPreguntas;
    listaPreguntas.html('');
    var contexto = this;
    var preguntas = this.modelo.preguntas


    preguntas.forEach(function (pregunta) {
      //completar
      //agregar a listaPreguntas un elemento div con valor "pregunta.textoPregunta", texto "pregunta.textoPregunta", id "pregunta.id" 
      var item = $('<div>', {
        'value': pregunta.textoPregunta,
        'id': pregunta.id,
      })
      item.html(`${pregunta.textoPregunta}`);
      listaPreguntas.append(item);
      var respuestas = pregunta.cantidadPorRespuesta;
      contexto.mostrarRespuestas(listaPreguntas, respuestas, pregunta);
    })
  },

  //muestra respuestas
  mostrarRespuestas: function (listaPreguntas, respuestas, pregunta) {
    respuestas.forEach(function (respuesta) {
      listaPreguntas.append($('<input>', {
        type: 'radio',
        value: respuesta.textoRespuesta,
        name: pregunta.id,
      }));
      listaPreguntas.append($("<label>", {
        for: respuesta.textoRespuesta,
        text: respuesta.textoRespuesta
      }));
    });
  },

  agregarVotos: function () {
    var contexto = this;
    $('#preguntas').find('div').each(function () {
      var nombrePregunta = $(this).attr('value'); 
      var id = $(this).attr('id');
      var respuestaSeleccionada = $('input[name=' + id + ']:checked').val();
      $('input[name=' + id + ']').prop('checked', false);
      contexto.controlador.agregarVoto(nombrePregunta, respuestaSeleccionada);
    });
  },

  dibujarGrafico: function (nombre, respuestas) {
    var seVotoAlgunaVez = false;
    for (var i = 1; i < respuestas.length; ++i) {
      if (respuestas[i][1] > 0) {
        seVotoAlgunaVez = true;
      }
    }
    var contexto = this;
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = google.visualization.arrayToDataTable(respuestas);

      var options = {
        title: nombre,
        is3D: true,
      };
      var ubicacionGraficos = contexto.elementos.graficosDeTorta;
      var id = (nombre.replace(/\W/g, '')).split(' ').join('') + '_grafico';
      if ($('#' + id).length) { $('#' + id).remove() }
      var div = document.createElement('div');
      ubicacionGraficos.append(div);
      div.id = id;
      div.style.width = '400';
      div.style.height = '300px';
      var chart = new google.visualization.PieChart(div);
      if (seVotoAlgunaVez) {
        chart.draw(data, options);
      }
    }
  },
};
