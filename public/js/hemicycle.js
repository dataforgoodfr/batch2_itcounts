var initializedMandat = false;
var initializedAge = false;

$(document).ready(function(){
    $('#hemicycle-submit').click(function(event) {
        event.preventDefault();
        var criteres= $('#hemicycle-form').serialize();
        // console.log("form", criteres);

   //      if($("#slider-age").slider("option", "max") != $("#slider-age").slider("values")[1]){
   //      	 var min_ddn = new Date();
   //      	min_ddn.setFullYear( min_ddn.getFullYear() - $("#maxAge").html());
   //      	criteres +='&date_naissance-gte='+ min_ddn.toISOString();
   //      }
   //     	if($("#slider-age").slider("option", "min") != $("#slider-age").slider("values")[0]){
			// var max_ddn = new Date();
	  //       max_ddn.setFullYear( max_ddn.getFullYear() - $("#minAge").html());
	  //       criteres +='&date_naissance-lte='+ max_ddn.toISOString();
   //     	}
        
   
  //       if($("#slider-mandat").slider("option", "min") != $("#slider-mandat").slider("values")[0]){
		// 	criteres +='&nb_mandats-gte='+ $("#minNbMandat").html();
		// }
		//  if($("#slider-mandat").slider("option", "max") != $("#slider-mandat").slider("values")[1]){
	 //        criteres +='&nb_mandats-lte='+ $("#maxNbMandat").html();
	 //    }

        // console.log("mandat",mandatSlider.noUiSlider.get())
        criteres +='&nb_mandats-gte='+ $("#infNbMandat").html();
        criteres +='&nb_mandats-lte='+ $("#supNbMandat").html();


        // console.log("age",ageSlider.noUiSlider.get())
        var min_ddn = new Date();
        min_ddn.setFullYear( min_ddn.getFullYear() - parseInt($("#supAge").html()));
        criteres +='&date_naissance-gte='+ min_ddn.toISOString();
        var max_ddn = new Date();
        max_ddn.setFullYear( max_ddn.getFullYear() - parseInt($("#infAge").html()));
        criteres +='&date_naissance-lte='+ max_ddn.toISOString();

        $.get('/api/hemicycle/search', criteres, function(resp) {
            updateData(resp);
            $('.skillbar').each(function(){
              $(this).find('.skillbar-bar').animate({
                width:$(this).attr('data-percent')
              },6000);
            });

            // console.log(JSON.stringify(resp));
        });
    });

  var mandatSlider = document.getElementById('range_03');

  if (!initializedMandat){
    noUiSlider.create(mandatSlider, {
       start: [parseInt($('#minNbMandat').html()), parseInt($('#maxNbMandat').html())],
       connect: true,
       step: 1,
       range: {
         'min': parseInt($('#minNbMandat').html()),
         'max': parseInt($('#maxNbMandat').html())
       },
    });
    initializedMandat=true;
  }

  mandatSlider.noUiSlider.on("change", function(e){
    // console.log("event", e);
    $("#infNbMandat").html(e[0]);
    $("#supNbMandat").html(e[1]);
  })
  
  var ageSlider = document.getElementById('range_04');

  if (!initializedAge){
    noUiSlider.create(ageSlider, {
       start: [parseInt($('#minAge').html()), parseInt($('#maxAge').html())],
       connect: true,
       step: 1,
       range: {
         'min': parseInt($('#minAge').html()),
         'max': parseInt($('#maxAge').html())
       },
    });
    initializedAge=true;
  }

  ageSlider.noUiSlider.on("change", function(e){
    // console.log("event", e);
    $("#infAge").html(e[0]);
    $("#supAge").html(e[1]);
  })


  $("#preset-1").on('click',function(){
    $("#hemicycle-form")[0].reset();
    // console.log([parseInt($('#maxNbMandat').html()),2])
    mandatSlider.noUiSlider.set([parseInt($('#minNbMandat').html()),2]);
    $('#hemicycle-submit').click();
  })

  $("#preset-2").on('click',function(){
    $("#hemicycle-form")[0].reset();
    ageSlider.noUiSlider.set([60,parseInt($('#maxAge').html())]);
    $('#cbox-11').attr("checked",true);
    $('#hemicycle-submit').click();
  })

  $("#preset-3").on('click',function(){
    $("#hemicycle-form")[0].reset();
    $("#cbox-11").attr("checked", false);
    ageSlider.noUiSlider.set([parseInt($('#minAge').html()),parseInt($('#maxAge').html())]);
    mandatSlider.noUiSlider.set([parseInt($('#minNbMandat').html()),parseInt($('#maxNbMandat').html())]);
    $('#hemicycle-submit').click();
  })
    // $( "#slider-age" ).slider({
    //   range: true,
    //   min: parseInt($('#minAge').html()),
    //   max: parseInt($('#maxAge').html()),
    //   values: [ parseInt($('#minAge').html()), parseInt($('#maxAge').html()) ],
    //   slide: function( event, ui ) {
    //     $('#minAge').html(ui.values[ 0 ]);
    //      $('#maxAge').html(ui.values[ 1 ]);
    //   }
    // });

    // $( "#slider-mandat" ).slider({
    //   range: true,
    //   min: parseInt($('#minNbMandat').html()),
    //   max: parseInt($('#maxNbMandat').html()),
    //   values: [ parseInt($('#minNbMandat').html()), parseInt($('#maxNbMandat').html()) ],
    //   slide: function( event, ui ) {
    //     $('#minNbMandat').html(ui.values[ 0 ]);
    //      $('#maxNbMandat').html(ui.values[ 1 ]);
    //   }
    // });
    $('#hemicycle-submit').click();
    

    $('.skillbar').each(function(){
      $(this).find('.skillbar-bar').animate({
        width:$(this).attr('data-percent')
      },2000);
    });

});