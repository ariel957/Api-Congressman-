let chamber = document.querySelector("#senate") ? "senate" : "house"

let URLAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`;

let bodyhtml = document.querySelector("body");

let init = {
    method: "GET",
    headers: {
        "X-API-Key": "ournQsaUKTYWSA4QpHLPfKbMzR66B6sqWrOtIXek",
    },
};
Vue.createApp({
    data() {
        return {
            message: 'Hello Vue!',
            miembros: [],
            miembrosFiltrados: [],
            check: [],
            ordenarEstado: [],
            filtrados: [],
            elegirSelector: "all",
            filtroTabla: [],
            contadorR: 0,
            contadorD: 0,
            contadorID: 0,
            votosR: 0,
            votosD: 0,
            votosID: 0,
            miembrosTotal: 0,
            porcentajeTotal: 0,

            arrayCortadoMayor: 0,
            arrayCortadoMenor: 0,
            arrayMostLoyal: 0,
            arrayLeastLoyal: 0,
        }
    },
    created() {
        fetch(URLAPI, init)
            .then(response => response.json())
            .then(data => {
                this.miembros = data.results[0].members
                this.estadosOrdenados(this.miembros)
                this.contarMiembrosPorPartido()
                this.tablas()
            })

    },

    methods: {
        estadosOrdenados(array) {
            let estadosEnOrden = [];
            array.forEach(miembro => {
                if (!estadosEnOrden.includes(miembro.state)) {
                    estadosEnOrden.push(miembro.state)
                };
            });
            this.ordenarEstado = estadosEnOrden.sort()
        },
        filtrarPorPartidos() {
            let miembrosFiltradosPorPartido = []
            if (this.check.length == 0) {

                miembrosFiltradosPorPartido = this.miembros
            } else {
                this.miembros.forEach(miembros => {
                    this.check.forEach(arrayCheckValor => miembros.party == arrayCheckValor ? miembrosFiltradosPorPartido.push(miembros) : "");
                })
            }
            this.filtrados = miembrosFiltradosPorPartido
        },

        filtrarPorEstados() {

            let filtrarMiembrosPorEstado = [];
            this.filtrados.forEach(miembros => {
                if (this.elegirSelector == "all") {
                    filtrarMiembrosPorEstado.push(miembros)
                } else if (this.elegirSelector == miembros.state) {
                    filtrarMiembrosPorEstado.push(miembros);
                };
            });
            this.filtroTabla = filtrarMiembrosPorEstado
        },
        contarMiembrosPorPartido() {
            this.miembros.forEach(representante => {
                if (representante.party == "D") {
                    this.contadorD++;
                    this.votosD = this.votosD + representante.votes_with_party_pct;

                };
                if (representante.party == "R") {
                    this.contadorR++;
                    this.votosR = this.votosR + representante.votes_with_party_pct;

                };
                if (representante.party == "ID") {
                    this.contadorID++;
                    this.votosID = this.votosID + representante.votes_with_party_pct;

                };

            });

            this.resultadoR = Math.floor(this.votosR / this.contadorR);
            this.resultadosD = Math.floor(this.votosD / this.contadorD);
            this.resultadosID = Math.floor(this.votosID / this.contadorID);

            if (this.contadorID == 0) {
                this.resultadosID = 0
            };
            this.miembrosTotal = Math.floor(this.contadorD + this.contadorID + this.contadorR)

            this.porcentajeTotal = Math.floor(this.votosR + this.votosD + this.votosID)

        },





        tablas() {
            let porcenjateDiez = Math.floor(this.miembros.length * 0.10);


            const ordenarMenor = (x, y) => y.missed_votes_pct - x.missed_votes_pct;
            const ordenarMayor = (x, y) => x.missed_votes_pct - y.missed_votes_pct

            const lealtadMayor = (x, y) => y.votes_with_party_pct - x.votes_with_party_pct;
            const lealtadMenor = (x, y) => x.votes_with_party_pct - y.votes_with_party_pct;


            function cortarArray(array) {
                let arrayCortado = [];
                for (let i = 0; i < porcenjateDiez; i++) {
                    arrayCortado.push(array[i]);
                };
                return arrayCortado;
            };

            let menores = this.miembros.sort(ordenarMenor);
            this.arrayCortadoMenor = cortarArray(menores);



            let mayores = this.miembros.sort(ordenarMayor);
            this.arrayCortadoMayor = cortarArray(mayores);


            let masLeales = this.miembros.sort(lealtadMayor);
            this.arrayMostLoyal = cortarArray(masLeales);


            let menosLeales = this.miembros.sort(lealtadMenor);
            this.arrayLeastLoyal = cortarArray(menosLeales);


        },


    },
    computed: { //funciones que se estan ejecutancdo constantemente(((add.event.listener)))
        actualizarTablas() {
            this.filtrarPorPartidos(),
                this.filtrarPorEstados()

        }
    }

}).mount('#app')

