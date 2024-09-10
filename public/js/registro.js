const inputNombre=document.getElementById("first_name")
const inputApellido=document.getElementById("last_name")
const inputAge=document.getElementById("age")
const inputEmail=document.getElementById("email")
const inputPassword=document.getElementById("password")
const btnSubmit=document.getElementById("registro")

btnSubmit.addEventListener("click", async(e)=>{
    e.preventDefault()
    let nombre=inputNombre.value.trim()
    let apellido= inputApellido.value.trim()
    let age= inputAge.value.trim()
    let email=inputEmail.value.trim()
    let password=inputPassword.value.trim()
  

    if(!nombre || !apellido|| !age|| !email || !password){
        alert("Por favor, complete todos los datos")
        return 
    }

    let body=JSON.stringify({
        first_name: nombre, 
        last_name: apellido,
        age,
        email, 
        password
    })

    let respuesta= await fetch("/api/session/registro", {
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body
    })

    let datos= await respuesta.json()
    if(respuesta.status===201){
        location.href=`/login?mensaje=Registro correcto para ${email}...!!!`
    }else{
        alert(datos.error)
    }

})