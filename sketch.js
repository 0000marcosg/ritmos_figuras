let cr = 200;
let ang = 1.57,
  dang = 0.5;
let x = 200;
let y = 200;
let r = 100;
let npuntos = 6;
let contador = 0;
let cooldown;
let cool;

let puntos = [];
let ex;
let ey;

let mic;

var input1;
var input2;


function setup() {
  createCanvas(400, 400);
  contador = 0;
  cooldown = 0;
  input1 = createInput();
  input1.position(20, 20);
  /////// EL PRIMER INPUTS ES PARA MODIFICAR EL NUMERO MÁXIMO DE PUNTOS
  button = createButton('Aceptar');
  button.position(input1.x + input1.width, 20);
  button.mousePressed(cambioNum);

  input2 = createInput();
  input2.position(20, 40);
  /////// EL PRIMER INPUTS ES PARA MODIFICAR LA VELOCIDAD
  button = createButton('Aceptar');
  button.position(input2.x + input2.width, 40);
  button.mousePressed(cambioVel);

  mic = new p5.AudioIn();

  mic.start();
  
}

function draw() {
  background(220);
  stroke(0);
  noFill();
  circle(200, 200, 200);
  fill(250, 150, 0);
  noStroke();

  //////// Mostrar Puntos Naranja
  for (let i = 0; i < puntos.length; i++) {
    puntos[i].mostrar();
  }

  ////////////////// LINEAS
  stroke(250, 150, 0);
  for (let h = 0; h < puntos.length; h++) {
    if (h == puntos.length - 1) {
      line(puntos[h].x, puntos[h].y, puntos[0].x, puntos[0].y);
    } else {
      line(puntos[h].x, puntos[h].y, puntos[h + 1].x, puntos[h + 1].y);
    }
  }
  
  ////////// PUNTO DE TIEMPO
  ex = cr + r * cos(ang);
  ey = cr + r * sin(ang);
  ang += dang / 28.2;
  fill(120, 120, 100);
  noStroke();
  circle(ex, ey, 25);

  ////////// BORRAR PUNTOS LUEGO DE UN CICLO
  for (let i = puntos.length - 1; i >= 0; i--) {
    if (puntos[i].contiene(ex, ey) && puntos[i].inmV == false) {
      puntos.splice(i, 1);
    }
  }

  /////////////////// COOLDOWN ENTRE PUNTO Y PUNTO
  if (cool) {
    cooldown++;
  }
  if (cooldown > 10) {
    cool = false;
    cooldown = 0;
  }

  /////////////////// PONER PUNTO POR INPUT DEL MICRO
  let vol = mic.getLevel();
  if (vol > 0.02) {
    marca();
  }
}


function marca() {
  if (!cool) {
    if (puntos.length < npuntos) {
      let b = new DOT(ex, ey);
      puntos.push(b);
      contador++;
      if (contador > puntos) {
        contador = 0;
      }
      cool = true;
    } else {
      ///////////////// ACÁ ESTÁ EL PROBLEMA DE QUÉ HACER
      /// UNA VEZ YA SE COLOCARON TODOS LOS PUNTOS DEFINIDOS
        puntos[0].x = ex;
        puntos[0].y = ey;
        puntos[0].inm = 0;
        puntos[0].inmV = true;
        contador++;
        if (contador > puntos) {
          contador = 0;
        }
        cool = true;
      }
    }
  }


  function cambioNum() {
    let num = input1.value();
    npuntos = num;
  }

  function cambioVel() {
    let num = input2.value();
    dang = num;
  }


  class DOT {
    constructor(px, py, ) {
      this.x = px;
      this.y = py;
      this.inm = 0;
      this.inmV = true;
    }

    contiene(px, py) {
      let d = dist(px, py, this.x, this.y);
      if (d < 15) {
        return true;
      } else {
        return false;
      }
    }

    mostrar() {
      ellipse(this.x, this.y, 15, 15);
      if (this.inm < 100) {
        this.inm++;
        if (this.inm == 100) {
          this.inmV = false;
        }
      }
      //print(this.inmV);
    }
  }