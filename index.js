/**
 * Constantes
 */
const TWO_PI = Math.PI * 2;

/**
 * Clase Aplicación
 */
class Application {
    /**
     * Constructor de la aplicación
     */
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.center = {
            x: this.width / 2,
            y: this.height / 2
        };

        this.circleContainers = [];

        // Escuchar el redimensionamiento de la ventana para ajustar el canvas dinámicamente
        window.addEventListener('resize', () => this.resizeCanvas(), false);
    }

    /**
     * Función simple de redimensionamiento. Reinicializa todo en el canvas al cambiar el ancho/alto
     */
    resizeCanvas() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.center = {
            x: this.width / 2,
            y: this.height / 2
        };

        // Vacía el contenedor anterior y lo llena de nuevo con objetos CircleContainer
        this.circleContainers = [];
        this.initializeCircleContainers();
    }

    /**
     * Crea varios objetos CircleContainer según la variable numberOfContainers
     * @return void
     */
    initializeCircleContainers() {
        for (let x = 0; x < this.width + 100; x += 100) {
            for (let y = 0; y < this.height + 100; y += 100) {
                // Inicializa una nueva instancia de la clase CircleContainer
                let circleContainer = new CircleContainer(this.context, x, y);

                // Permite que CircleContainer inicialice sus hijos
                circleContainer.initializeCircles();

                // Agrega el contenedor al arreglo de objetos CircleContainer
                this.circleContainers.push(circleContainer);
            }
        }
    }

    /**
     * Actualiza la aplicación y cada hijo de la aplicación
     * @return void
     */
    update() {
        for (let i = 0; i < this.circleContainers.length; i++) {
            this.circleContainers[i].update();
        }
    }

    /**
     * Renderiza la aplicación y cada hijo de la aplicación
     * @return void
     */
    render() {
        // Limpia todo el canvas en cada renderizado
        this.context.clearRect(0, 0, this.width, this.height);

        // Llama a la función render de cada elemento hijo
        for (let i = 0; i < this.circleContainers.length; i++) {
            this.circleContainers[i].render();
        }
    }

    /**
     * Actualiza y renderiza la aplicación al menos 60 veces por segundo
     * @return void
     */
    loop() {
        this.update();
        this.render();

        window.requestAnimationFrame(() => this.loop());
    }
}

/**
 * Clase CircleContainer
 */
class CircleContainer {
    /**
     * Constructor de CircleContainer
     * @param context - El contexto del objeto canvas de la Aplicación
     * @param x
     * @param y
     */
    constructor(context, x, y) {
        this.context = context;
        this.position = {x, y};

        this.numberOfCircles = 19;
        this.circles = [];

        this.baseRadius = 20;
        this.bounceRadius = 150;
        this.singleSlice = TWO_PI / this.numberOfCircles;
    }

    /**
     * Crea varios objetos Circle según la variable numberOfCircles
     * @return void
     */
    initializeCircles() {
        for (let i = 0; i < this.numberOfCircles; i++) {
            this.circles.push(new Circle(this.position.x, this.position.y + Math.random(), this.baseRadius, this.bounceRadius, i * this.singleSlice));
        }
    }

    /**
     * Intenta actualizar la aplicación al menos 60 veces por segundo
     * @return void
     */
    update() {
        for (let i = 0; i < this.numberOfCircles; i++) {
            this.circles[i].update(this.context);
        }
    }

    /**
     * Intenta renderizar la aplicación al menos 60 veces por segundo
     * @return void
     */
    render() {
        for (let i = 0; i < this.numberOfCircles; i++) {
            this.circles[i].render(this.context);
        }
    }
}

/**
 * Clase Circle
 */
class Circle {
    /**
     * Constructor de Circle
     * @param x - Posición horizontal de este círculo
     * @param y - Posición vertical de este círculo
     * @param baseRadius
     * @param bounceRadius
     * @param angleCircle
     */
    constructor(x, y, baseRadius, bounceRadius, angleCircle) {
        this.basePosition = {x, y};
        this.position = {x, y};
        this.speed = 0.01;
        this.baseSize = 10;
        this.size = 10;
        this.angle = (x + y);
        this.baseRadius = baseRadius;
        this.bounceRadius = bounceRadius;
        this.angleCircle = angleCircle;
    }

    /**
     * Actualiza la posición de este objeto
     * @return void
     */
    update() {
        this.position.x = this.basePosition.x + Math.cos(this.angleCircle) * (Math.sin(this.angle + this.angleCircle) * this.bounceRadius + this.baseRadius);
        this.position.y = this.basePosition.y + Math.sin(this.angleCircle) * (Math.sin(this.angle + this.angleCircle) * this.bounceRadius + this.baseRadius);
        this.size = Math.cos(this.angle) * 8 + this.baseSize;

        this.angle += this.speed;
    }

    /**
     * Dibuja este objeto Circle en el canvas
     * @param context - El contexto del objeto canvas de la Aplicación
     * @return void
     */
    render(context) {
        context.fillStyle = "hsl(195, 100%, "+this.size * 4+"%)";
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.size, 0, TWO_PI);
        context.fill();
    }
}

/**
 * La función onload se ejecuta cuando la página ha terminado de cargar, inicializa la aplicación
 */
window.onload = function () {
    // Crea una nueva instancia de la aplicación
    const application = new Application();

    // Inicializa los objetos CircleContainer
    application.initializeCircleContainers();

    // Inicia el ciclo principal por primera vez
    application.loop();
};
