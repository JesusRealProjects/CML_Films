

var cliente;
var facturas=[];
const cont_pelis= document.querySelector("#cont_pelis");

const cont_user= document.querySelector("#cont_user");
const cont_cine=document.querySelector("#cont_cine");
const cont_sesion=document.querySelector("#cont_sesion");
const cont_datos=document.querySelector("#cont_datos");
const cont_login=document.querySelector("#cont_login");
const cont_register=document.querySelector("#cont_register");
const cont_facturas=document.querySelector("#cont_facturas");//cont facturas

const btn_see_menu= document.querySelector("#see_menu");
const btn_menuRegister= document.querySelector("#menuRegister");
const btn_menuLogin= document.querySelector("#menuLogin");
const btn_login=document.querySelector("#login_user");
const btn_logof=document.querySelector("#logof_user");
const btn_register=document.querySelector("#register_user");
const register_user_admin=document.querySelector("#register_user_admin");
const ver_reservas=document.querySelector("#ver_reservas");
var btn_exit_reserva;
var btn_factura;

const txt_user_login=document.querySelector("#inputLUser");
const txt_pwd_login=document.querySelector("#inputLPassword");

const txt_user_register=document.querySelector("#inputRUser");
const txt_pwd_register=document.querySelector("#inputRPassword");
const txt_email_register=document.querySelector("#inputREmail");
const tipoClienteR=document.querySelector("#tipoClienteR");

const btn_go_cont_sesion=document.querySelectorAll(".go_cont_sesion");
btn_go_cont_sesion.forEach(function(b){b.addEventListener("click",showContSesion);});

const dato_nombre=document.querySelector("#dato_nombre");
const dato_email=document.querySelector("#dato_email");
const dato_tipo=document.querySelector("#dato_tipo");

btn_see_menu.addEventListener("click",seeMenu);
btn_menuRegister.addEventListener("click",menuRegister);
btn_menuLogin.addEventListener("click",menuLogin);
btn_login.addEventListener("click",loginUser);
btn_logof.addEventListener("click",logofUser);
btn_register.addEventListener("click",registerUser);
register_user_admin.addEventListener("click",menuRegister);
ver_reservas.addEventListener("click",showFacturas);


function showProfile() {
	
	dato_nombre.textContent=cliente["usuario"];
	dato_email.textContent=cliente["email"];
	dato_tipo.textContent=cliente["tipo"];
	
	register_user_admin.style.display="none";
	ver_reservas.style.display="none";
	if (typeof cliente !== 'undefined') {
		if (cliente.tipo == "administrador") {
			register_user_admin.style.display="flex";
		}else if( cliente["tipo"]=="usuario"){
			ver_reservas.style.display="flex";
		}
	}
	disableCont(cont_sesion);
	disableCont(cont_facturas);
	disableCont(cont_login);
	enableCont(cont_datos);
}

async function showFacturas() {
	//cont_datos
	await obtenerFacturas(cliente.usuario).then(function(value) {facturas= value;});
	let addFacturas="";
	let num=1;
	facturas.forEach(factura => {
		addFacturas += '<p  data-id="'+ factura.id +'">' + factura.pelicula +" "+factura.fecha + '</p>';
	});
	cont_facturas.innerHTML='<b>LISTADO</b>'+addFacturas+'<input type="submit" class="showProfile" value="ATRAS"></input>';
	btn_exit_reserva=document.querySelector(".showProfile");
	btn_exit_reserva.addEventListener("click",showProfile);
	console.log(facturas);
	btn_factura=document.querySelectorAll("#cont_facturas p");
	btn_factura.forEach(btn => {
        btn.addEventListener("click", ({ target: { dataset } }) => {	
			generarPdf(facturas.find(element=>element.id==btn.dataset.id));
		});
    });
	disableCont(cont_datos);
	enableCont(cont_facturas);
}
function showContSesion() {

	if (typeof cliente !== 'undefined') {
		if (cliente.tipo == "administrador") {
			register_user_admin.style.display="flex";
			
			disableCont(cont_login);
			enableCont(cont_datos);
			disableCont(cont_register);
			disableCont(cont_sesion);
			enableCont(cont_datos);
		}
	}else{
		disableCont(cont_login);
		disableCont(cont_datos);
		disableCont(cont_register);
		enableCont(cont_sesion);
	}
		

}
async function registerUser() {
	var tipo=tipoClienteR.options[tipoClienteR.selectedIndex].value;
	var res=await registrarUsuario(txt_user_register.value,txt_pwd_register.value,txt_email_register.value,tipo);
	alert(res);
}

function logofUser() {
	disableCont(cont_datos);
	enableCont(cont_sesion);
	sessionStorage.clear();
	window.location.href = "../index.html";
}

async function loginUser() {
	cliente=await logearUsuario(txt_user_login.value,txt_pwd_login.value);
	if((String)(cliente["email"])!="undefined"){
		sessionStorage.User=txt_user_login.value;
		sessionStorage.Pasw=txt_pwd_login.value;
		window.location.href = "../index.html";
	}else{
		alert("Login incorrecto");
		sessionStorage.clear();
	}
	
}
function menuRegister() {

	const option = document.createElement('option');
	limpiarSelect();
	if (typeof cliente !== 'undefined') {
		if (cliente.tipo == "administrador") {
			option.value = "trabajador";
			option.text = "trabajador";
			tipoClienteR.appendChild(option);

		}
	}else{
		option.value = "usuario";
		option.text = "usuario";
		tipoClienteR.appendChild(option);
	}
	disableCont(cont_datos);
	disableCont(cont_sesion);
	enableCont(cont_register);
}
const limpiarSelect = () => {
	for (let i = tipoClienteR.options.length; i >= 0; i--) {
		tipoClienteR.remove(i);
	}
  };
function menuLogin() {
	disableCont(cont_sesion);
	enableCont(cont_login);
}
function enableCont(container){
	container.style.display="initial";
}
function disableCont(container){
	container.style.display="none";
}

function seeMenu(){
	var sign=btn_see_menu.textContent;
	
	if (sign=="<"){
		btn_see_menu.textContent='>';
		cont_cine.style.width="100%";
		cont_user.style.left="-20%";
	}else{
		btn_see_menu.textContent='<';
		cont_cine.style.width="80%";
		cont_user.style.left="0%";
	}
	
}
async function checkLogin(show) {
	if ((String)(sessionStorage.User) == "undefined" || (String)(sessionStorage.Pasw) == "undefined") {
		console.log(sessionStorage.User+" desconectado");
		if ((String)(localStorage.idInvitado)== "undefined"){
			localStorage.idInvitado= Math.trunc(Math.random()*(1000));
		}
		
	} else{
		cliente=await logearUsuario(sessionStorage.User,sessionStorage.Pasw);
		if((String)(cliente["email"])!="undefined" && show){
			showProfile();
		}
	}

	
}
export const obtenerUsuario = async() => {
	await checkLogin(false);
	return cliente;
}
//checkLogin(true);



seeMenu();

