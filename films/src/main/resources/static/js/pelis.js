//-----------------------------------------------------------------------------------------------
import { obtenerUsuario } from "./menu_login.js";
var pelis=[];
var cliente;
//await obtenerUsuario().then(function(value) {cliente= value;});
//await obtenerPelis().then(function(value) {pelis= value;});


const cont_pelis= document.querySelector("#cont_pelis");

let addPelis='';
pelis.forEach(element =>{

	addPelis+='<article class="peli">'+
                    '<div class="img" style="background-image: url(\''+element["url"]+'\')"> </div>'+
                    '<div class="peli_hover">'+
						'<p class="title">'+element["nombre"]+'</p>'+
						'<p class="descripcion"><b>'+element["descripcion"]+'</b></p>'+
						'<buton class="btnReservar" data-id="'+element["id"]+'">RESERVAR </buton>'+
					'</div>'+
                '</article>';
                

});
cont_pelis.innerHTML=addPelis;

const btns_reserva=document.querySelectorAll(".btnReservar");

btns_reserva.forEach(btn =>{
	btn.addEventListener("click",({target: {dataset}}) => {
		//reservar(dataset.id)
        localStorage.peliid=dataset.id;
		window.location.href = "../htmls/reservarPeli.html";
	})
});

