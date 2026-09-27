import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  LocateFixed,
  Minus,
  NotebookPen,
  Phone,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { DEFAULT_MENU_DATA, Dish } from "./data/menuData";

const WHATSAPP_NUMBER = "51935661827";

type CartItem = Dish & {
  cartId: string;
  cantidad: number;
  notas: string;
};

type PendingDish = {
  dish: Dish;
  cartId?: string;
};

type OrderType = "delivery" | "pickup";

type CheckoutForm = {
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  referencia: string;
  ubicacion: string;
};

const EMPTY_CHECKOUT: CheckoutForm = {
  nombre: "",
  apellido: "",
  telefono: "",
  direccion: "",
  referencia: "",
  ubicacion: "",
};

const money = (price: string | number) => `S/ ${Number(price).toFixed(2)}`;

export default function App() {
  const [activeCategory, setActiveCategory] = useState(DEFAULT_MENU_DATA[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [pendingDish, setPendingDish] = useState<PendingDish | null>(null);
  const [dishNote, setDishNote] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [checkout, setCheckout] = useState<CheckoutForm>(EMPTY_CHECKOUT);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const categoryButtons = useRef<Record<string, HTMLButtonElement | null>>({});

  const { count, total } = useMemo(() => ({
    count: cart.reduce((sum, item) => sum + item.cantidad, 0),
    total: cart.reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0),
  }), [cart]);

  useEffect(() => {
    const updateActiveCategory = () => {
      const activationLine = window.scrollY + 145;
      let nextCategory = DEFAULT_MENU_DATA[0].id;

      DEFAULT_MENU_DATA.forEach((category) => {
        const section = document.getElementById(`categoria-${category.id}`);
        if (section && section.offsetTop <= activationLine) nextCategory = category.id;
      });

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
        nextCategory = DEFAULT_MENU_DATA.at(-1)?.id ?? nextCategory;
      }

      setActiveCategory((current) => current === nextCategory ? current : nextCategory);
    };

    updateActiveCategory();
    window.addEventListener("scroll", updateActiveCategory, { passive: true });
    window.addEventListener("resize", updateActiveCategory);
    return () => {
      window.removeEventListener("scroll", updateActiveCategory);
      window.removeEventListener("resize", updateActiveCategory);
    };
  }, []);

  useEffect(() => {
    categoryButtons.current[activeCategory]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCategory]);

  useEffect(() => {
    const shouldLock = showCart || Boolean(pendingDish) || showCheckout;
    const previousOverflow = document.body.style.overflow;
    if (shouldLock) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showCart, pendingDish, showCheckout]);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    document.getElementById(`categoria-${categoryId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openDishDialog = (dish: Dish, item?: CartItem) => {
    setDishNote(item?.notas ?? "");
    setPendingDish({ dish, cartId: item?.cartId });
  };

  const saveDish = () => {
    if (!pendingDish) return;
    const notas = dishNote.trim();

    if (pendingDish.cartId) {
      setCart((items) => items.map((item) => item.cartId === pendingDish.cartId ? { ...item, notas } : item));
    } else {
      setCart((items) => {
        const existing = items.find((item) => (
          item.nombre === pendingDish.dish.nombre
          && item.precio === pendingDish.dish.precio
          && item.notas === notas
        ));

        if (existing) {
          return items.map((item) => item.cartId === existing.cartId ? { ...item, cantidad: item.cantidad + 1 } : item);
        }

        return [...items, {
          ...pendingDish.dish,
          cartId: crypto.randomUUID(),
          cantidad: 1,
          notas,
        }];
      });
    }

    setPendingDish(null);
    setDishNote("");
  };

  const updateQuantity = (cartId: string, delta: number) => setCart((items) => items
    .map((item) => item.cartId === cartId ? { ...item, cantidad: item.cantidad + delta } : item)
    .filter((item) => item.cantidad > 0));

  const startCheckout = () => {
    setShowCart(false);
    setOrderType(null);
    setShowCheckout(true);
  };

  const selectOrderType = (type: OrderType) => {
    setOrderType(type);
    setLocationStatus("idle");
  };

  const updateCheckout = (field: keyof CheckoutForm, value: string) => {
    setCheckout((current) => ({ ...current, [field]: value }));
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latitude = coords.latitude.toFixed(6);
        const longitude = coords.longitude.toFixed(6);
        updateCheckout("ubicacion", `https://www.google.com/maps?q=${latitude},${longitude}`);
        setLocationStatus("success");
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  };

  const sendOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!orderType || checkout.telefono.length !== 9) return;

    const itemLines = cart.flatMap((item) => {
      const itemTotal = Number(item.precio) * item.cantidad;
      const lines = [`• ${item.cantidad} x ${item.nombre} — ${money(itemTotal)}`];
      if (item.notas) lines.push(`  Nota: ${item.notas}`);
      return lines;
    });

    const customerLines = orderType === "delivery"
      ? [
          "Modalidad: DELIVERY",
          `Cliente: ${checkout.nombre.trim()} ${checkout.apellido.trim()}`,
          `Celular: ${checkout.telefono}`,
          `Dirección: ${checkout.direccion.trim()}`,
          `Referencia: ${checkout.referencia.trim()}`,
          `Ubicación: ${checkout.ubicacion || "No compartida"}`,
        ]
      : [
          "Modalidad: RECOJO EN TIENDA",
          `Cliente: ${checkout.nombre.trim()}`,
          `Celular: ${checkout.telefono}`,
        ];

    const message = [
      "Hola King Wok, quiero hacer este pedido:",
      "",
      ...itemLines,
      "",
      `Total: ${money(total)}`,
      "",
      ...customerLines,
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="site-shell">
      <header className="topbar" id="inicio">
        <a className="brand" href="#carta" aria-label="King Wok, ir a la carta">
          <img src="/king-wok-logo.png" alt="King Wok" className="brand-logo" />
          <span><strong>KING WOK</strong><small>CHIFA · COCINA AL FUEGO</small></span>
        </a>
        <a className="phone-link" href="tel:935661827"><Phone size={16} /> 935 661 827</a>
        <button className="bag-button" onClick={() => setShowCart(true)} aria-label={`Ver pedido, ${count} productos`}>
          <ShoppingBag size={19} /><span>Pedido</span>{count > 0 && <b>{count}</b>}
        </button>
      </header>

      <main>
        <section className="menu" id="carta">
          <div className="menu-intro">
            <img src="/king-wok-logo.png" alt="Logo de King Wok" className="menu-logo" />
            <div><span className="section-kicker">CARTA 2026</span><h1>ELIGE TU<br />ANTOJO</h1></div>
            <p>Recetas contundentes, porciones generosas y ese golpe de fuego que hace único a cada plato.</p>
          </div>

          <div className="category-dock">
            <button className="dock-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Volver al inicio de la carta">
              <img src="/king-wok-logo.png" alt="" />
            </button>
            <nav className="category-nav" aria-label="Categorías de la carta">
              {DEFAULT_MENU_DATA.map((category, index) => (
                <button
                  key={category.id}
                  ref={(element) => { categoryButtons.current[category.id] = element; }}
                  onClick={() => scrollToCategory(category.id)}
                  className={activeCategory === category.id ? "active" : ""}
                  aria-current={activeCategory === category.id ? "true" : undefined}
                >
                  <small>{String(index + 1).padStart(2, "0")}</small>{category.nombre}
                </button>
              ))}
            </nav>
            <button className="dock-bag" onClick={() => setShowCart(true)} aria-label={`Ver pedido, ${count} productos`}>
              <ShoppingBag size={19} />{count > 0 && <b>{count}</b>}
            </button>
          </div>

          <div className="menu-sections">
            {DEFAULT_MENU_DATA.map((category, categoryIndex) => (
              <section className="category-panel" id={`categoria-${category.id}`} key={category.id} aria-labelledby={`heading-${category.id}`}>
                <div className="category-heading">
                  <span>{category.sello}</span>
                  <h2 id={`heading-${category.id}`}>{category.nombre}</h2>
                  <b>{String(categoryIndex + 1).padStart(2, "0")}</b>
                </div>
                <div className="dish-grid">
                  {category.items.map((dish, dishIndex) => (
                    <article className={`dish-card ${dish.destacado ? "featured" : ""}`} key={`${dish.nombre}-${dish.descripcion ?? ""}-${dishIndex}`}>
                      <div className="dish-number">{String(dishIndex + 1).padStart(2, "0")}</div>
                      <div className="dish-copy">
                        {dish.destacado && <span className="dish-badge">Favorito de la casa</span>}
                        <h3>{dish.nombre}</h3>
                        {dish.descripcion && <p>{dish.descripcion}</p>}
                      </div>
                      <div className="dish-action">
                        <strong>{money(dish.precio)}</strong>
                        <button onClick={() => openDishDialog(dish)} aria-label={`Agregar ${dish.nombre} al pedido`}><Plus size={18} /></button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="order-banner">
          <img src="/king-wok-logo.png" alt="" />
          <div><small>¿YA ELEGISTE?</small><h2>QUE EMPIECE EL FUEGO.</h2></div>
          <button onClick={() => setShowCart(true)}>VER MI PEDIDO <ChevronRight size={18} /></button>
        </section>
      </main>

      <footer>
        <div className="brand footer-brand"><img src="/king-wok-logo.png" alt="King Wok" className="brand-logo" /><span><strong>KING WOK</strong><small>CHIFA · COCINA AL FUEGO</small></span></div>
        <p>Cada plato hecho al wok, con corazón.</p>
        <a href="tel:935661827">PEDIDOS: 935 661 827</a>
      </footer>

      <AnimatePresence>
        {count > 0 && !showCart && !showCheckout && !pendingDish && (
          <motion.button className="floating-cart" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} onClick={() => setShowCart(true)}>
            <span><ShoppingBag size={20} /><b>{count}</b></span><span>VER PEDIDO</span><strong>{money(total)}</strong>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCart && (
          <motion.div className="cart-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)}>
            <motion.aside className="cart-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 280 }} onClick={(event) => event.stopPropagation()} aria-label="Resumen del pedido">
              <div className="cart-header"><div><small>TU SELECCIÓN</small><h2>MI PEDIDO</h2></div><button onClick={() => setShowCart(false)} aria-label="Cerrar pedido"><X /></button></div>
              {cart.length === 0 ? (
                <div className="empty-cart"><ShoppingBag size={38} /><p>Tu pedido está vacío.</p><button onClick={() => setShowCart(false)}>VOLVER A LA CARTA</button></div>
              ) : (
                <>
                  <div className="cart-list">
                    {cart.map((item) => (
                      <div className="cart-item" key={item.cartId}>
                        <div className="cart-item-copy">
                          <h3>{item.nombre}</h3>
                          <strong>{money(item.precio)}</strong>
                          {item.notas && <p>“{item.notas}”</p>}
                          <button className="edit-note" onClick={() => openDishDialog(item, item)}><NotebookPen size={14} />{item.notas ? "Editar nota" : "Agregar nota"}</button>
                        </div>
                        <div className="quantity"><button onClick={() => updateQuantity(item.cartId, -1)} aria-label={`Quitar uno de ${item.nombre}`}><Minus size={15} /></button><span>{item.cantidad}</span><button onClick={() => updateQuantity(item.cartId, 1)} aria-label={`Agregar uno de ${item.nombre}`}><Plus size={15} /></button></div>
                        <button className="remove" onClick={() => updateQuantity(item.cartId, -item.cantidad)} aria-label={`Eliminar ${item.nombre}`}><Trash2 size={17} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>
                  <button className="whatsapp-button" onClick={startCheckout}>CONTINUAR PEDIDO <ChevronRight size={19} /></button>
                </>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingDish && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPendingDish(null)}>
            <motion.div className="dialog dish-dialog" role="dialog" aria-modal="true" aria-labelledby="dish-dialog-title" initial={{ opacity: 0, y: 28, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .98 }} onClick={(event) => event.stopPropagation()}>
              <button className="dialog-close" onClick={() => setPendingDish(null)} aria-label="Cerrar"><X /></button>
              <span className="dialog-kicker">PERSONALIZA TU PLATO</span>
              <h2 id="dish-dialog-title">{pendingDish.dish.nombre}</h2>
              <p>¿Tienes alguna indicación especial? Escríbela aquí y la enviaremos junto a tu pedido.</p>
              <label htmlFor="dish-note">Notas para cocina <small>(opcional)</small></label>
              <textarea id="dish-note" value={dishNote} onChange={(event) => setDishNote(event.target.value.slice(0, 220))} maxLength={220} placeholder="Ej. Sin cebolla, poco picante, salsa aparte…" autoFocus />
              <div className="character-count">{dishNote.length}/220</div>
              <button className="dialog-primary" onClick={saveDish}>{pendingDish.cartId ? "GUARDAR NOTA" : "AGREGAR AL PEDIDO"}<Plus size={18} /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckout && (
          <motion.div className="modal-backdrop checkout-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCheckout(false)}>
            <motion.div className="dialog checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title" initial={{ opacity: 0, y: 28, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .98 }} onClick={(event) => event.stopPropagation()}>
              <button className="dialog-close" onClick={() => setShowCheckout(false)} aria-label="Cerrar"><X /></button>
              {!orderType ? (
                <>
                  <span className="dialog-kicker">ÚLTIMO PASO</span>
                  <h2 id="checkout-title">¿CÓMO QUIERES TU PEDIDO?</h2>
                  <p>Elige una modalidad antes de enviarlo por WhatsApp.</p>
                  <div className="order-type-grid">
                    <button onClick={() => selectOrderType("delivery")}><span><Truck size={28} /></span><strong>DELIVERY</strong><small>Lo llevamos a tu dirección</small><ChevronRight size={20} /></button>
                    <button onClick={() => selectOrderType("pickup")}><span><Store size={28} /></span><strong>RECOJO EN TIENDA</strong><small>Te avisamos para que lo recojas</small><ChevronRight size={20} /></button>
                  </div>
                </>
              ) : (
                <form onSubmit={sendOrder}>
                  <button type="button" className="back-button" onClick={() => setOrderType(null)}><ChevronLeft size={17} /> CAMBIAR MODALIDAD</button>
                  <span className="dialog-kicker">{orderType === "delivery" ? "DATOS DE DELIVERY" : "DATOS PARA RECOJO"}</span>
                  <h2 id="checkout-title">{orderType === "delivery" ? "¿DÓNDE LO LLEVAMOS?" : "¿A NOMBRE DE QUIÉN?"}</h2>
                  <div className="form-grid">
                    <label>Nombre<input required autoComplete="given-name" value={checkout.nombre} onChange={(event) => updateCheckout("nombre", event.target.value)} placeholder="Tu nombre" /></label>
                    {orderType === "delivery" && <label>Apellido<input required autoComplete="family-name" value={checkout.apellido} onChange={(event) => updateCheckout("apellido", event.target.value)} placeholder="Tu apellido" /></label>}
                    <label className={orderType === "pickup" ? "full-field" : ""}>Celular <small>(9 dígitos)</small><input required type="tel" inputMode="numeric" pattern="[0-9]{9}" minLength={9} maxLength={9} autoComplete="tel" value={checkout.telefono} onChange={(event) => updateCheckout("telefono", event.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="987654321" /></label>
                    {orderType === "delivery" && (
                      <>
                        <label className="full-field">Dirección exacta<input required autoComplete="street-address" value={checkout.direccion} onChange={(event) => updateCheckout("direccion", event.target.value)} placeholder="Av., calle, número, distrito" /></label>
                        <label className="full-field">Referencia<input required value={checkout.referencia} onChange={(event) => updateCheckout("referencia", event.target.value)} placeholder="Ej. Frente al parque, puerta negra" /></label>
                        <div className="location-field full-field">
                          <button type="button" className={`location-button ${locationStatus === "success" ? "success" : ""}`} onClick={shareLocation} disabled={locationStatus === "loading"}>
                            <LocateFixed size={21} />
                            {locationStatus === "loading" ? "OBTENIENDO UBICACIÓN…" : locationStatus === "success" ? "UBICACIÓN EN TIEMPO REAL AGREGADA" : "COMPARTIR UBICACIÓN EN TIEMPO REAL"}
                          </button>
                          <p>Dale clic a este botón para compartir tu ubicación exacta y que tu pedido llegue más rápido.</p>
                          {locationStatus === "error" && <small className="form-error">No pudimos obtenerla. Activa el permiso de ubicación e inténtalo otra vez.</small>}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="checkout-total"><span>Total del pedido</span><strong>{money(total)}</strong></div>
                  <button className="dialog-primary" type="submit">ENVIAR PEDIDO POR WHATSAPP <ChevronRight size={18} /></button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
