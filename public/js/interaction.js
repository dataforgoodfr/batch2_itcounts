var updateData = function(data){
	var dataAN = data
	var nbFemme = 0;
	var nbHomme = 0;
	console.log("DATA",data)
	// _.forEach(anData, function(value, key){
	// 	if (anData[key].display) anData[key].display.value =  -1;
	// })
	_.forEach(anData, function(value, key){
		if (anData[key].display) anData[key].display.value =  -1;
		var obj = _.find(dataAN, {place_en_hemicycle: key.toString()});
		console.log("obj",obj);
		// if(!obj){
		// 	console.log("no obj", dataAN, key)
		// }

		if (obj && anData[key].display ) {
			nbFemme += (obj.sexe == 'F') ? 1 : 0;
			nbHomme += (obj.sexe == 'H') ? 1 : 0;
			anData[key].display.value = (obj.sexe == 'F') ? 1 : 0;
		}
	})
	console.log(anData)
	if (anData.ready) refresh();

	//refresh parity bar
	$('#bar-femme-span').html(((nbFemme)/(nbFemme + nbHomme)*100).toFixed(2).toString() + '%');
	$('#bar-femme').attr('data-percent',((nbFemme)/(nbFemme + nbHomme)*100).toString() + '%');
	$('#bar-homme-span').html(((nbHomme)/(nbFemme + nbHomme)*100).toFixed(2).toString() + '%');
	$('#bar-homme').attr('data-percent',((nbHomme)/(nbFemme + nbHomme)*100).toString() + '%');
	$('.skillbar').each(function(){
      $(this).find('.skillbar-bar').animate({
        width:$(this).attr('data-percent')
      },6000);
    });
}