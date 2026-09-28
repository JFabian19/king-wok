export interface Dish {
  nombre: string;
  descripcion?: string;
  precio: string;
  destacado?: boolean;
  esMenu?: boolean;
  imagen?: string;
}

export interface Category {
  id: string;
  nombre: string;
  sello: string;
  items: Dish[];
  esMenu?: boolean;
}

export const DEFAULT_MENU_DATA: Category[] = [
  {
    id: "broaster",
    nombre: "Broastería",
    sello: "Crocante",
    items: [
      { nombre: "Broaster", precio: "18", imagen: "/dishes/broaster.webp" },
      { nombre: "Alitas broaster", precio: "22", imagen: "/dishes/alitas-broaster.webp" },
      { nombre: "Alitas con salsa", descripcion: "Tamarindo, acevichada, ostión, picante o BBQ", precio: "30", imagen: "/dishes/alitas-con-salsa.webp" },
      { nombre: "Alitas picantes", precio: "30", imagen: "/dishes/alitas-picantes.webp" },
      { nombre: "Alitas acevichadas", precio: "30", imagen: "/dishes/alitas-acevichadas.webp" },
      { nombre: "Ronda de alitas", descripcion: "Lleva 4 BBQ, 4 acevichadas y 4 BBQ picantes", precio: "60", destacado: true, imagen: "/dishes/ronda-alitas.webp" },
      { nombre: "Limonkay", precio: "25", imagen: "/dishes/limonkay.webp" },
      { nombre: "Salchipapa", precio: "16", imagen: "/dishes/salchipapa.webp" },
    ],
  },
  {
    id: "aeropuertos",
    nombre: "Aeropuertos",
    sello: "De la casa",
    items: [
      { nombre: "Aeropuerto", precio: "18", imagen: "/dishes/aeropuerto.webp" },
      { nombre: "Aeropuerto de pollo y carne", precio: "22", imagen: "/dishes/aeropuerto-pollo-carne.webp" },
      { nombre: "Aeropuerto especial", precio: "25", imagen: "/dishes/aeropuerto-especial.webp" },
      { nombre: "Aeropuerto con tallarín", precio: "23", imagen: "/dishes/aeropuerto-tallarin.webp" },
      { nombre: "Aeropuerto con enrollado", precio: "30", imagen: "/dishes/aeropuerto-enrollado.webp" },
      { nombre: "Aeropuerto con langostinos", precio: "38", imagen: "/dishes/chaufa-con-langostinos.webp" },
      { nombre: "Aeropuerto King especial", descripcion: "Chancho, pollo, carne, huevo de codorniz y plátano frito", precio: "38", destacado: true, imagen: "/dishes/aeropuerto-king-especial.webp" },
    ],
  },
  {
    id: "chaufa",
    nombre: "Chaufa",
    sello: "Al wok",
    items: [
      { nombre: "Chaufa de pollo", precio: "16", imagen: "/dishes/chaufa-pollo.webp" },
      { nombre: "Chaufa de carne", precio: "18", imagen: "/dishes/chaufa-carne.webp" },
      { nombre: "Chaufa mixto", precio: "20", imagen: "/dishes/chaufa-mixto.webp" },
      { nombre: "Chaufa especial", descripcion: "Pollo, carne y huevo de codorniz", precio: "25", destacado: true, imagen: "/dishes/chaufa-especial.webp" },
      { nombre: "Chaufa a lo pobre", precio: "25", imagen: "/dishes/chaufa-pobre.webp" },
      { nombre: "Chaufa con langostinos", precio: "35", imagen: "/dishes/chaufa-con-langostinos.webp" },
    ],
  },
  {
    id: "combinados",
    nombre: "Combinados con chaufa",
    sello: "Dos sabores",
    items: [
      { nombre: "Lomo saltado", precio: "22", imagen: "/dishes/lomo-saltado-chaufa.webp" },
      { nombre: "Tallarín con verduras", precio: "20", imagen: "/dishes/tallarin-con-verduras.webp" },
      { nombre: "Tipakay", precio: "25", imagen: "/dishes/tipakay.webp" },
      { nombre: "Chijaukay", precio: "25", imagen: "/dishes/chijaukay.webp" },
      { nombre: "Limonkay", precio: "25", imagen: "/dishes/limonkay.webp" },
      { nombre: "Pollo con piña", precio: "25", imagen: "/dishes/pollo-pina.webp" },
      { nombre: "Pollo con durazno", precio: "26", imagen: "/dishes/pollo-durazno.webp" },
      { nombre: "Pollo con frutas", precio: "30", imagen: "/dishes/pollo-frutas.webp" },
      { nombre: "Enrollado de verduras", descripcion: "En salsa de ostión", precio: "28", imagen: "/dishes/enrollado.webp" },
      { nombre: "Enrollado de verduras", descripcion: "En salsa de tamarindo", precio: "30", imagen: "/dishes/enrollado.webp" },
      { nombre: "Kamlu wantán", descripcion: "Todas las carnes, huevo de codorniz, langostinos, frutas y verduras", precio: "39", destacado: true, imagen: "/dishes/kamlu-wantan.webp" },
    ],
  },
  {
    id: "tallarines",
    nombre: "Tallarines",
    sello: "Salteados",
    items: [
      { nombre: "Tallarín con verdura y carne", precio: "22", imagen: "/dishes/tallarin-carne.webp" },
      { nombre: "Tallarín con verdura y pollo", precio: "20", imagen: "/dishes/tallarin-pollo.webp" },
      { nombre: "Tallarín con verdura, carne y pollo", precio: "22", imagen: "/dishes/tallarin-mixto.webp" },
    ],
  },
  {
    id: "lomos",
    nombre: "Lomos",
    sello: "Fuego alto",
    items: [
      { nombre: "Lomo saltado montado", precio: "27", destacado: true, imagen: "/dishes/lomo-montado.webp" },
      { nombre: "Lomo de carne", precio: "22", imagen: "/dishes/lomo-carne.webp" },
      { nombre: "Lomo de pollo", precio: "20", imagen: "/dishes/lomo-pollo-carne-cliente.webp" },
      { nombre: "Lomo de pollo y carne", precio: "25", imagen: "/dishes/lomo-pollo-mixto.webp" },
    ],
  },
  {
    id: "sopas",
    nombre: "Sopas",
    sello: "Reconfortantes",
    items: [
      { nombre: "Sopa de verduras", precio: "16", imagen: "/dishes/sopa-verduras.webp" },
      { nombre: "Sopa wantán", precio: "17", imagen: "/dishes/sopa-wantan.webp" },
      { nombre: "Sopa de kion", precio: "16", imagen: "/dishes/sopa-kion.webp" },
      { nombre: "Sopa especial", precio: "25", destacado: true, imagen: "/dishes/sopa-especial.webp" },
    ],
  },
  {
    id: "triples",
    nombre: "Triples · Muralla China",
    sello: "Para compartir",
    items: [
      { nombre: "Chaufa + Tipakay + tallarín", descripcion: "Tallarines con verduras", precio: "38", imagen: "/dishes/triple-tipakay.webp" },
      { nombre: "Chaufa + Chijaukay + tallarín", descripcion: "Tallarines con verduras", precio: "38", imagen: "/dishes/triple-chijaukay-cliente.webp" },
      { nombre: "Taypa a la plancha", descripcion: "Langostinos, pollo, chancho, carne, huevos de codorniz y verduras", precio: "42", destacado: true, imagen: "/dishes/taypa-plancha.webp" },
      { nombre: "Tallarín a la plancha", precio: "42", imagen: "/dishes/tallarin-plancha.webp" },
    ],
  },
  {
    id: "menu",
    nombre: "Menú",
    sello: "Hasta las 3 PM",
    esMenu: true,
    items: [
      {
        nombre: "Chaufa",
        descripcion: "Arroz chaufa al wok clásico con trozos de pollo, huevo y cebollita china",
        precio: "15",
        esMenu: true,
        imagen: "/dishes/chaufa.webp",
      },
      {
        nombre: "Aeropuerto",
        descripcion: "Chaufa al wok salteado con fideos y frejolito chino",
        precio: "15",
        esMenu: true,
        imagen: "/dishes/aeropuerto.webp",
      },
      {
        nombre: "Tallarín con verduras",
        descripcion: "Tallarines salteados al wok con verduras frescas de temporada y pollo",
        precio: "15",
        esMenu: true,
        imagen: "/dishes/tallarin-con-verduras.webp",
      },
    ],
  },
  {
    id: "cocteles",
    nombre: "Cócteles",
    sello: "Próximamente",
    items: [],
  },
];
