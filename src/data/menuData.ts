export interface Dish {
  nombre: string;
  descripcion?: string;
  precio: string;
  destacado?: boolean;
  esMenu?: boolean;
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
      },
      {
        nombre: "Aeropuerto",
        descripcion: "Chaufa al wok salteado con fideos y frejolito chino",
        precio: "15",
        esMenu: true,
      },
      {
        nombre: "Tallarín con verduras",
        descripcion: "Tallarines salteados al wok con verduras frescas de temporada y pollo",
        precio: "15",
        esMenu: true,
      },
    ],
  },
  {
    id: "broaster",
    nombre: "Broastería",
    sello: "Crocante",
    items: [
      { nombre: "Broaster", precio: "18" },
      { nombre: "Alitas broaster", precio: "22" },
      { nombre: "Alitas con salsa", descripcion: "Tamarindo, acevichada, ostión, picante o BBQ", precio: "30", destacado: true },
      { nombre: "Limonkay", precio: "25" },
      { nombre: "Salchipapa", precio: "16" },
    ],
  },
  {
    id: "aeropuertos",
    nombre: "Aeropuertos",
    sello: "De la casa",
    items: [
      { nombre: "Aeropuerto", precio: "18" },
      { nombre: "Aeropuerto de pollo y carne", precio: "22" },
      { nombre: "Aeropuerto especial", precio: "25" },
      { nombre: "Aeropuerto con tallarín", precio: "23" },
      { nombre: "Aeropuerto con enrollado", precio: "30" },
      { nombre: "Aeropuerto con langostinos", precio: "38" },
      { nombre: "Aeropuerto King especial", descripcion: "Chancho, pollo, carne, huevo de codorniz y plátano frito", precio: "38", destacado: true },
    ],
  },
  {
    id: "chaufa",
    nombre: "Chaufa",
    sello: "Al wok",
    items: [
      { nombre: "Chaufa de pollo", precio: "16" },
      { nombre: "Chaufa de carne", precio: "18" },
      { nombre: "Chaufa mixto", precio: "20" },
      { nombre: "Chaufa especial", descripcion: "Pollo, carne y huevo de codorniz", precio: "25", destacado: true },
      { nombre: "Chaufa a lo pobre", precio: "25" },
      { nombre: "Chaufa con langostinos", precio: "35" },
    ],
  },
  {
    id: "combinados",
    nombre: "Combinados con chaufa",
    sello: "Dos sabores",
    items: [
      { nombre: "Lomo saltado", precio: "22" },
      { nombre: "Tallarín con verduras", precio: "20" },
      { nombre: "Tipakay", precio: "25" },
      { nombre: "Chijaukay", precio: "25" },
      { nombre: "Limonkay", precio: "25" },
      { nombre: "Pollo con piña", precio: "25" },
      { nombre: "Pollo con durazno", precio: "26" },
      { nombre: "Pollo con frutas", precio: "30" },
      { nombre: "Enrollado de verduras", descripcion: "En salsa de ostión", precio: "28" },
      { nombre: "Enrollado de verduras", descripcion: "En salsa de tamarindo", precio: "30" },
      { nombre: "Kamlu wantán", descripcion: "Todas las carnes, huevo de codorniz, langostinos, frutas y verduras", precio: "39", destacado: true },
    ],
  },
  {
    id: "tallarines",
    nombre: "Tallarines",
    sello: "Salteados",
    items: [
      { nombre: "Tallarín con verdura y carne", precio: "22" },
      { nombre: "Tallarín con verdura y pollo", precio: "20" },
      { nombre: "Tallarín con verdura, carne y pollo", precio: "22" },
    ],
  },
  {
    id: "lomos",
    nombre: "Lomos",
    sello: "Fuego alto",
    items: [
      { nombre: "Lomo saltado montado", precio: "27", destacado: true },
      { nombre: "Lomo de carne", precio: "22" },
      { nombre: "Lomo de pollo", precio: "20" },
      { nombre: "Lomo de pollo y carne", precio: "25" },
    ],
  },
  {
    id: "sopas",
    nombre: "Sopas",
    sello: "Reconfortantes",
    items: [
      { nombre: "Sopa de verduras", precio: "16" },
      { nombre: "Sopa wantán", precio: "17" },
      { nombre: "Sopa de kion", precio: "16" },
      { nombre: "Sopa especial", precio: "25", destacado: true },
    ],
  },
  {
    id: "triples",
    nombre: "Triples · Muralla China",
    sello: "Para compartir",
    items: [
      { nombre: "Chaufa + Tipakay + tallarín", descripcion: "Tallarines con verduras", precio: "38" },
      { nombre: "Chaufa + Chijaukay + tallarín", descripcion: "Tallarines con verduras", precio: "38" },
      { nombre: "Taypa a la plancha", descripcion: "Langostinos, pollo, chancho, carne, huevos de codorniz y verduras", precio: "42", destacado: true },
      { nombre: "Tallarín a la plancha", precio: "42" },
    ],
  },
];
