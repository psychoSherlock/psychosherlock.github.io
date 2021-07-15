//  Type Write Effect for logo
//--------------------------------------------

var logoName = document.getElementById('nav__logo');

var typewriter = new Typewriter(logoName, {
  loop:true
});

typewriter
  .typeString('Athul Prakash')
  .pauseFor(5000)
  .deleteAll()
  .typeString('psychoSherlock')
  .pauseFor(5000)
  .start();

//---------------------------------------------