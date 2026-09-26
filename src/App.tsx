import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Flame, Minus, Phone, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { DEFAULT_MENU_DATA, Dish } from "./data/menuData";

const WHATSAPP_NUMBER = "51935661827";
type CartItem = Dish & { cantidad: number };
const money = (price: string) => `S/ ${Number(price).toFixed(2)}`;

export default function App() {
  const [activeCategory, setActiveCategory] = useState(DEFAULT_MENU_DATA[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const count = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const total = cart.reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0);
  const currentCategory = useMemo(() => DEFAULT_MENU_DATA.find((category) => category.id === activeCategory) ?? DEFAULT_MENU_DATA[0], [activeCategory]);

  const addItem = (dish: Dish) => setCart((items) => {
    const index = items.findIndex((item) => item.nombre === dish.nombre && item.precio === dish.precio);
    if (index === -1) return [...items, { ...dish, cantidad: 1 }];
    return items.map((item, i) => i === index ? { ...item, cantidad: item.cantidad + 1 } : item);
  });

  const updateQuantity = (dish: CartItem, delta: number) => setCart((items) => items
    .map((item) => item.nombre === dish.nombre && item.precio === dish.precio ? { ...item, cantidad: item.cantidad + delta } : item)
    .filter((item) => item.cantidad > 0));

  const sendOrder = () => {
    const lines = cart.map((item) => `• ${item.cantidad} x ${item.nombre} — ${money(String(Number(item.precio) * item.cantidad))}`);
    const message = `Hola King Wok, quiero hacer este pedido:\n\n${lines.join("\n")}\n\nTotal: ${money(String(total))}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="King Wok, inicio"><span className="brand-seal" aria-hidden="true">火</span><span><strong>KING WOK</strong><small>CHIFA · COCINA AL FUEGO</small></span></a>
        <a className="phone-link" href="tel:935661827"><Phone size={16} /> 935 661 827</a>
        <button className="bag-button" onClick={() => setShowCart(true)} aria-label={`Ver pedido, ${count} productos`}><ShoppingBag size={19} /><span>Pedido</span>{count > 0 && <b>{count}</b>}</button>
      </header>

      <main>
        <section className="hero" id="inicio">
          <img src="/king-wok-hero.png" alt="Arroz chaufa salteándose sobre el fuego de un wok" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="eyebrow"><Flame size={15} /> SABOR CHIFA · FUEGO DE VERDAD</p>
            <h1>EL WOK<br /><em>MANDA.</em></h1>
            <p className="hero-lead">Chaufa, tallarines y clásicos del barrio hechos al instante, con fuego alto y corazón.</p>
            <button className="primary-cta" onClick={() => document.getElementById("carta")?.scrollIntoView({ behavior: "smooth" })}>VER LA CARTA <ChevronRight size={18} /></button>
          </div>
          <div className="hero-stamp"><span>HECHO</span><strong>AL WOK</strong><span>CON CORAZÓN</span></div>
          <div className="ticker"><span>KING WOK</span><i>火</i><span>PIDE AL 935 661 827</span><i>火</i><span>CHIFA · BROASTER · SOPAS</span></div>
        </section>

        <section className="menu" id="carta">
          <div className="menu-intro"><div><span className="section-kicker">CARTA 2026</span><h2>ELIGE TU<br />ANTOJO</h2></div><p>Recetas contundentes, porciones generosas y ese golpe de fuego que hace único a cada plato.</p></div>
          <nav className="category-nav" aria-label="Categorías de la carta">
            {DEFAULT_MENU_DATA.map((category, index) => <button key={category.id} onClick={() => setActiveCategory(category.id)} className={activeCategory === category.id ? "active" : ""}><small>{String(index + 1).padStart(2, "0")}</small>{category.nombre}</button>)}
          </nav>

          <AnimatePresence mode="wait">
            <motion.section key={currentCategory.id} className="category-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .22 }} aria-labelledby={`heading-${currentCategory.id}`}>
              <div className="category-heading"><span>{currentCategory.sello}</span><h3 id={`heading-${currentCategory.id}`}>{currentCategory.nombre}</h3><b>{String(DEFAULT_MENU_DATA.indexOf(currentCategory) + 1).padStart(2, "0")}</b></div>
              <div className="dish-grid">
                {currentCategory.items.map((dish, index) => <article className={`dish-card ${dish.destacado ? "featured" : ""}`} key={`${dish.nombre}-${index}`}>
                  <div className="dish-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="dish-copy">{dish.destacado && <span className="dish-badge">Favorito de la casa</span>}<h4>{dish.nombre}</h4>{dish.descripcion && <p>{dish.descripcion}</p>}</div>
                  <div className="dish-action"><strong>{money(dish.precio)}</strong><button onClick={() => addItem(dish)} aria-label={`Agregar ${dish.nombre} al pedido`}><Plus size={18} /></button></div>
                </article>)}
              </div>
            </motion.section>
          </AnimatePresence>
        </section>

        <section className="order-banner"><span className="brand-seal large" aria-hidden="true">火</span><div><small>¿YA ELEGISTE?</small><h2>QUE EMPIECE EL FUEGO.</h2></div><a href="https://wa.me/51935661827" target="_blank" rel="noreferrer">PEDIR POR WHATSAPP <ChevronRight size={18} /></a></section>
      </main>

      <footer><div className="brand footer-brand"><span className="brand-seal" aria-hidden="true">火</span><span><strong>KING WOK</strong><small>CHIFA · COCINA AL FUEGO</small></span></div><p>Cada plato hecho al wok, con corazón.</p><a href="tel:935661827">PEDIDOS: 935 661 827</a></footer>

      <AnimatePresence>{count > 0 && !showCart && <motion.button className="floating-cart" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} onClick={() => setShowCart(true)}><span><ShoppingBag size={20} /><b>{count}</b></span><span>VER PEDIDO</span><strong>{money(String(total))}</strong></motion.button>}</AnimatePresence>

      <AnimatePresence>{showCart && <motion.div className="cart-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)}>
        <motion.aside className="cart-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 280 }} onClick={(event) => event.stopPropagation()} aria-label="Resumen del pedido">
          <div className="cart-header"><div><small>TU SELECCIÓN</small><h2>MI PEDIDO</h2></div><button onClick={() => setShowCart(false)} aria-label="Cerrar pedido"><X /></button></div>
          {cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={38} /><p>Tu pedido está vacío.</p><button onClick={() => setShowCart(false)}>VOLVER A LA CARTA</button></div> : <><div className="cart-list">{cart.map((item) => <div className="cart-item" key={`${item.nombre}-${item.precio}`}><div><h4>{item.nombre}</h4><strong>{money(item.precio)}</strong></div><div className="quantity"><button onClick={() => updateQuantity(item, -1)} aria-label={`Quitar uno de ${item.nombre}`}><Minus size={15} /></button><span>{item.cantidad}</span><button onClick={() => updateQuantity(item, 1)} aria-label={`Agregar uno de ${item.nombre}`}><Plus size={15} /></button></div><button className="remove" onClick={() => updateQuantity(item, -item.cantidad)} aria-label={`Eliminar ${item.nombre}`}><Trash2 size={17} /></button></div>)}</div><div className="cart-total"><span>Total</span><strong>{money(String(total))}</strong></div><button className="whatsapp-button" onClick={sendOrder}>ENVIAR PEDIDO POR WHATSAPP <ChevronRight size={19} /></button></>}
        </motion.aside>
      </motion.div>}</AnimatePresence>
    </div>
  );
}
