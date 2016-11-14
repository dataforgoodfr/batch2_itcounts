$(document).ready(function(){
    $('#hemicycle-submit').click(function(event) {
        event.preventDefault();
        var criteres= $('#hemicycle-form').serialize();

        if($("#slider-age").slider("option", "min") != $("#slider-age").slider("values")[0]){
        	 var min_ddn = new Date();
        	min_ddn.setFullYear( min_ddn.getFullYear() - $("#maxAge").html());
        	criteres +='&date_naissance-gte='+ min_ddn.getFullYear()+(min_ddn.getMonth()+1)+min_ddn.getDate();
        }
       	if($("#slider-age").slider("option", "max") != $("#slider-age").slider("values")[1]){
			var max_ddn = new Date();
	        max_ddn.setFullYear( max_ddn.getFullYear() - $("#minAge").html());
	        criteres +='&date_naissance-lte='+ max_ddn.getFullYear()+(max_ddn.getMonth()+1)+max_ddn.getDate();
       	}
        
   
        if($("#slider-mandat").slider("option", "min") != $("#slider-mandat").slider("values")[0]){
			criteres +='&nb_mandats-gte='+ $("#minNbMandat").html();
		}
		 if($("#slider-mandat").slider("option", "max") != $("#slider-mandat").slider("values")[1]){
	        criteres +='&nb_mandats-lte='+ $("#maxNbMandat").html();
	    }

        $.post('/api/hemicycle/search', criteres, function(resp) {
            console.log(JSON.stringify(resp));
        });
    });

    $( "#slider-age" ).slider({
      range: true,
      min: parseInt($('#minAge').html()),
      max: parseInt($('#maxAge').html()),
      values: [ parseInt($('#minAge').html()), parseInt($('#maxAge').html()) ],
      slide: function( event, ui ) {
        $('#minAge').html(ui.values[ 0 ]);
         $('#maxAge').html(ui.values[ 1 ]);
      }
    });

    $( "#slider-mandat" ).slider({
      range: true,
      min: parseInt($('#minNbMandat').html()),
      max: parseInt($('#maxNbMandat').html()),
      values: [ parseInt($('#minNbMandat').html()), parseInt($('#maxNbMandat').html()) ],
      slide: function( event, ui ) {
        $('#minNbMandat').html(ui.values[ 0 ]);
         $('#maxNbMandat').html(ui.values[ 1 ]);
      }
    });

});