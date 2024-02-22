// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()

  // Toggle Used
  let taxSwitch= document.getElementById("flexSwitchCheckDefault");
  taxSwitch.addEventListener("click",()=>{
   let tax_info= document.getElementsByClassName("tax-info");
   for(info of tax_info){
    if(info.style.display !="inline"){
      info.style.display="inline";
    }
    else{
      info.style.display="none";
    }
   }
  })