import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  LocateFixed,
  Minus,
  Motorbike,
  NotebookPen,
  Phone,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  X,
} from "lucide-react";
import { DEFAULT_MENU_DATA, Dish } from "./data/menuData";
import { getPeruDateTime, PeruDateTime } from "./utils/peruTime";

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
  const [peruTime, setPeruTime] = useState<PeruDateTime>(() => getPeruDateTime());
  const [menuNoticeModalOpen, setMenuNoticeModalOpen] = useState(false);
  const categoryButtons = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setPeruTime(getPeruDateTime());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const hasUnavailableMenuItems = useMemo(() => {
    if (peruTime.isMenuAvailable) return false;
    return cart.some((item) => item.esMenu);
  }, [cart, peruTime.isMenuAvailable]);

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
    const shouldLock = showCart || Boolean(pendingDish) || showCheckout || menuNoticeModalOpen;
    const previousOverflow = document.body.style.overflow;
    if (shouldLock) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showCart, pendingDish, showCheckout, menuNoticeModalOpen]);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    document.getElementById(`categoria-${categoryId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openDishDialog = (dish: Dish, item?: CartItem) => {
    if (dish.esMenu && !peruTime.isMenuAvailable) {
      setMenuNoticeModalOpen(true);
      return;
    }
    setDishNote(item?.notas ?? "");
    setPendingDish({ dish, cartId: item?.cartId });
  };

  const saveDish = () => {
    if (!pendingDish) return;
    if (pendingDish.dish.esMenu && !peruTime.isMenuAvailable) {
      setPendingDish(null);
      setMenuNoticeModalOpen(true);
      return;
    }
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
    if (hasUnavailableMenuItems) {
      setMenuNoticeModalOpen(true);
      return;
    }
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
    if (hasUnavailableMenuItems) {
      setMenuNoticeModalOpen(true);
      return;
    }
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
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="King Wok, ir al inicio">
          <img src="/king-wok-logo.png" alt="King Wok" className="brand-logo" />
          <span><strong>KING WOK</strong><small>CHIFA ORIENTAL NIKKEI</small></span>
        </a>
        <a className="phone-link" href="tel:935661827"><Phone size={16} /> 935 661 827</a>
        <button className="bag-button" onClick={() => setShowCart(true)} aria-label={`Ver pedido, ${count} productos`}>
          <ShoppingBag size={19} /><span>Pedido</span>{count > 0 && <b>{count}</b>}
        </button>
      </header>

      <main>
        <section
          className="hero"
          id="inicio"
          onClick={() => document.getElementById("carta")?.scrollIntoView({ behavior: "smooth" })}
          style={{ cursor: "pointer" }}
          aria-label="King Wok - Portada principal, toca para ir a la carta"
        >
          <img src="/king-wok-hero.png" alt="King Wok - El Wok Manda" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <div className="eyebrow"><Flame size={14} /><span>SABOR CHIFA · FUEGO DE VERDAD</span></div>
            <h1>EL WOK<br /><em>MANDA.</em></h1>
            <p className="hero-lead">Chaufa, tallarines y clásicos del barrio hechos al instante, con fuego alto y corazón.</p>
          </div>
          <div className="hero-stamp" title="King Wok - Chifa Oriental Nikkei">
            <img src="/king-wok-logo.png" alt="King Wok Logo" className="hero-stamp-img" />
          </div>
          <div className="hero-scroll-cue">
            <span>TOCA PARA VER LA CARTA</span>
            <ChevronDown size={14} />
          </div>
          <div className="ticker" aria-label="Información y especialidades de King Wok">
            <div className="ticker-track">
              <div className="ticker-group">
                <span>KING WOK</span><i>火</i>
                <span>PIDE AL 935 661 827</span><i>火</i>
                <span>CHIFA · BROASTER · SOPAS</span><i>火</i>
                <span>COCINA AL FUEGO</span><i>火</i>
                <span>SABOR ORIENTAL NIKKEI</span><i>火</i>
                <span>ESPECIALIDADES AL WOK</span><i>火</i>
              </div>
              <div className="ticker-group" aria-hidden="true">
                <span>KING WOK</span><i>火</i>
                <span>PIDE AL 935 661 827</span><i>火</i>
                <span>CHIFA · BROASTER · SOPAS</span><i>火</i>
                <span>COCINA AL FUEGO</span><i>火</i>
                <span>SABOR ORIENTAL NIKKEI</span><i>火</i>
                <span>ESPECIALIDADES AL WOK</span><i>火</i>
              </div>
            </div>
          </div>
        </section>

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

                {category.esMenu && (
                  <div className={`menu-letrero ${peruTime.isMenuAvailable ? "open" : "closed"}`}>
                    <div className="menu-letrero-top">
                      <div className="menu-letrero-tag">
                        <Clock size={16} />
                        <span>HORARIO DEL MENÚ</span>
                      </div>
                      <div className={`menu-status-badge ${peruTime.isMenuAvailable ? "status-open" : "status-closed"}`}>
                        <span className="status-dot" />
                        <span>{peruTime.statusText}</span>
                      </div>
                    </div>
                    <div className="menu-letrero-body">
                      <h3>SOLO VÁLIDO DE LUNES A SÁBADO HASTA LAS 3:00 PM</h3>
                      <p>
                        {peruTime.isMenuAvailable
                          ? `¡Menú disponible hoy! Pide antes de las 3:00 PM. Hora actual en Perú: ${peruTime.timeString12}.`
                          : peruTime.reason}
                      </p>
                    </div>
                    <div className="menu-letrero-footer">
                      <span>🇵🇪 Hora en Perú: <strong>{peruTime.timeString12}</strong> · {peruTime.dayName}</span>
                      {!peruTime.isMenuAvailable && (
                        <span className="menu-closed-alert">🚫 Pedidos bloqueados fuera de horario</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="dish-grid">
                  {category.items.map((dish, dishIndex) => {
                    const isDishBlocked = Boolean(dish.esMenu && !peruTime.isMenuAvailable);
                    return (
                      <article
                        className={`dish-card ${dish.destacado ? "featured" : ""} ${isDishBlocked ? "menu-card-disabled" : ""}`}
                        key={`${dish.nombre}-${dish.descripcion ?? ""}-${dishIndex}`}
                      >
                        <div className="dish-number">{String(dishIndex + 1).padStart(2, "0")}</div>
                        <div className="dish-copy">
                          {dish.destacado && (
                            <span className="dish-badge">
                              <Flame size={11} /> Favorito de la casa
                            </span>
                          )}
                          {isDishBlocked && <span className="dish-badge-closed">Fuera de horario</span>}
                          <h3>{dish.nombre}</h3>
                          {dish.descripcion && <p>{dish.descripcion}</p>}
                        </div>
                        <div className="dish-action">
                          <strong>{money(dish.precio)}</strong>
                          <button
                            onClick={() => openDishDialog(dish)}
                            className={isDishBlocked ? "btn-disabled" : ""}
                            aria-label={isDishBlocked ? `${dish.nombre} no disponible por horario` : `Agregar ${dish.nombre} al pedido`}
                            title={isDishBlocked ? "El Menú solo está disponible de lunes a sábado hasta las 3:00 PM" : undefined}
                          >
                            {isDishBlocked ? <Clock size={18} /> : <Plus size={18} />}
                          </button>
                        </div>
                      </article>
                    );
                  })}
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
        <div className="brand footer-brand">
          <img src="/king-wok-logo.png" alt="King Wok" className="brand-logo" />
          <span><strong>KING WOK</strong><small>CHIFA ORIENTAL NIKKEI</small></span>
        </div>
        <div className="footer-slogan-card">
          <div className="slogan-badge-line">
            <span className="slogan-sep" />
            <span className="slogan-star">✦</span>
            <span className="slogan-sep" />
          </div>
          <p className="footer-slogan-title">CHIFA ORIENTAL NIKKEI</p>
          <span className="footer-slogan-sub">Sabor al Wok · Fuego de Verdad</span>
        </div>
        <a href="tel:935661827" className="footer-phone-cta">
          <small>PEDIDOS DIRECTOS</small>
          <strong>935 661 827</strong>
        </a>
      </footer>

      <div className="tu-carta-bar">
        <div className="tu-carta-container">
          <span className="tu-carta-label">Hecho por</span>
          <span className="tu-carta-brand">
            <span className="tc-part1">Tu</span>
            <span className="tc-part2">Carta</span>
          </span>
        </div>
      </div>

      <AnimatePresence>
        {count > 0 && !showCart && !showCheckout && !pendingDish && (
          <div className="floating-cart-container">
            <motion.button
              className="floating-cart"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => setShowCart(true)}
              aria-label={`Ver pedido, ${count} productos`}
            >
              <span className="floating-cart-badge">
                <ShoppingBag size={19} />
                <b>{count}</b>
              </span>
              <span className="floating-cart-label">VER PEDIDO</span>
              <strong className="floating-cart-total">{money(total)}</strong>
            </motion.button>
          </div>
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
                  {hasUnavailableMenuItems && (
                    <div className="cart-warning-box">
                      <AlertTriangle size={18} />
                      <div>
                        <strong>Menú del Día fuera de horario</strong>
                        <p>Los platos del menú solo se pueden pedir de lunes a sábado hasta las 3:00 PM. Por favor retíralos para poder continuar con tu pedido a la carta.</p>
                      </div>
                    </div>
                  )}
                  <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>
                  <button
                    className={`whatsapp-button ${hasUnavailableMenuItems ? "btn-disabled" : ""}`}
                    onClick={startCheckout}
                    disabled={hasUnavailableMenuItems}
                  >
                    {hasUnavailableMenuItems ? "RETIRA EL MENÚ PARA CONTINUAR" : "CONTINUAR PEDIDO"} <ChevronRight size={19} />
                  </button>
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
                    <button type="button" onClick={() => selectOrderType("delivery")}>
                      <span className="order-type-circle">
                        <Motorbike size={28} strokeWidth={2.3} />
                      </span>
                      <div className="order-type-info">
                        <strong>DELIVERY</strong>
                        <small>Lo llevamos a tu dirección</small>
                      </div>
                      <ChevronRight size={20} className="order-type-arrow" />
                    </button>
                    <button type="button" onClick={() => selectOrderType("pickup")}>
                      <span className="order-type-circle">
                        <Store size={27} strokeWidth={2.3} />
                      </span>
                      <div className="order-type-info">
                        <strong>RECOJO EN TIENDA</strong>
                        <small>Te avisamos para que lo recojas</small>
                      </div>
                      <ChevronRight size={20} className="order-type-arrow" />
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={sendOrder} className="checkout-form">
                  <button type="button" className="back-button" onClick={() => setOrderType(null)}>
                    <ChevronLeft size={15} /> CAMBIAR MODALIDAD
                  </button>
                  <span className="dialog-kicker">{orderType === "delivery" ? "DATOS DE DELIVERY" : "DATOS PARA RECOJO"}</span>
                  <h2 id="checkout-title">{orderType === "delivery" ? "¿DÓNDE LO LLEVAMOS?" : "¿A NOMBRE DE QUIÉN?"}</h2>
                  <div className="form-grid">
                    <div className="name-grid-row">
                      <label>
                        <span>Nombre</span>
                        <input required autoComplete="given-name" value={checkout.nombre} onChange={(event) => updateCheckout("nombre", event.target.value)} placeholder="Tu nombre" />
                      </label>
                      {orderType === "delivery" && (
                        <label>
                          <span>Apellido</span>
                          <input required autoComplete="family-name" value={checkout.apellido} onChange={(event) => updateCheckout("apellido", event.target.value)} placeholder="Tu apellido" />
                        </label>
                      )}
                    </div>
                    <label className="full-field">
                      <span>Celular <small>(9 dígitos)</small></span>
                      <input required type="tel" inputMode="numeric" pattern="[0-9]{9}" minLength={9} maxLength={9} autoComplete="tel" value={checkout.telefono} onChange={(event) => updateCheckout("telefono", event.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="987654321" />
                    </label>
                    {orderType === "delivery" && (
                      <>
                        <label className="full-field">
                          <span>Dirección exacta</span>
                          <input required autoComplete="street-address" value={checkout.direccion} onChange={(event) => updateCheckout("direccion", event.target.value)} placeholder="Av., calle, número, distrito" />
                        </label>
                        <label className="full-field">
                          <span>Referencia</span>
                          <input required value={checkout.referencia} onChange={(event) => updateCheckout("referencia", event.target.value)} placeholder="Ej. Frente al parque, puerta negra" />
                        </label>
                        <div className="location-field full-field">
                          <button type="button" className={`location-button ${locationStatus === "success" ? "success" : ""}`} onClick={shareLocation} disabled={locationStatus === "loading"}>
                            <LocateFixed size={18} />
                            <span>
                              {locationStatus === "loading" ? "OBTENIENDO UBICACIÓN…" : locationStatus === "success" ? "UBICACIÓN AGREGADA ✓" : "COMPARTIR UBICACIÓN EN TIEMPO REAL"}
                            </span>
                          </button>
                          <p>Dale clic para que tu pedido llegue más rápido.</p>
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

      <AnimatePresence>
        {menuNoticeModalOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuNoticeModalOpen(false)}>
            <motion.div className="dialog menu-notice-dialog" role="dialog" aria-modal="true" aria-labelledby="menu-notice-title" initial={{ opacity: 0, y: 28, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .98 }} onClick={(event) => event.stopPropagation()}>
              <button className="dialog-close" onClick={() => setMenuNoticeModalOpen(false)} aria-label="Cerrar"><X /></button>
              <span className="dialog-kicker">HORARIO DEL MENÚ</span>
              <h2 id="menu-notice-title">MENÚ NO DISPONIBLE</h2>
              <div className="notice-time-banner">
                <Clock size={24} />
                <div>
                  <strong>Hora actual en Perú: {peruTime.timeString12} · {peruTime.dayName}</strong>
                  <p>{peruTime.reason}</p>
                </div>
              </div>
              <p className="notice-rule">
                ⚠️ El <strong>Menú del Día</strong> (Chaufa, Aeropuerto y Tallarín con verduras) solo está habilitado para pedidos de <strong>lunes a sábado hasta las 3:00 PM</strong> (hora de Perú).
              </p>
              <p className="notice-sub">
                ¡Pero no te quedes con el antojo! Puedes pedir cualquiera de nuestros deliciosos platos a la carta disponibles: Broastería, Aeropuertos especiales, Chaufas, Combinados y Lomos.
              </p>
              <button className="dialog-primary" onClick={() => setMenuNoticeModalOpen(false)}>
                EXPLORAR PLATOS A LA CARTA <ChevronRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
