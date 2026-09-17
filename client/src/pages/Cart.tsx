import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useCart } from "@/lib/cart";
import { ArrowLeft, CheckCircle, Minus, PawPrint, Plus, ShoppingBag, Trash, UserCircle } from "@phosphor-icons/react";
import { useLocation } from "wouter";

export default function Cart() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const cart = useCart();
  const [notice, setNotice] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", phone: "" });
  const delivery = cart.subtotal >= 50 ? 0 : 5;
  const total = cart.subtotal + delivery;

  function startCheckout() {
    if (!isAuthenticated) {
      setNotice("Log in to continue to secure checkout");
      window.setTimeout(startLogin, 650);
      return;
    }
    setCheckoutOpen(true);
  }

  function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    setOrderComplete(true);
    cart.clear();
  }

  return <div className="cart-page"><header className="cart-header"><div className="cart-header-inner"><button className="cart-brand" onClick={() => navigate("/")}><span className="brand-icon"><PawPrint size={19} weight="fill" /></span><strong>furry<span>tales</span></strong></button><button className="cart-back" onClick={() => navigate("/")}><ArrowLeft size={17} /> Continue shopping</button></div></header><main className="cart-main">
    {orderComplete ? <section className="cart-success"><div className="cart-success-icon"><CheckCircle size={39} weight="fill" /></div><span className="eyebrow">Order received</span><h1>Good things are<br /><em>on their way.</em></h1><p>Your Furry Tales order has been placed successfully. We’ll send the next update to your account email.</p><button className="button button--primary" onClick={() => navigate("/")}>Back to home <ArrowLeft size={18} /></button></section> : <>
      <div className="cart-title"><div><span className="eyebrow"><span className="eyebrow-dot" /> Your little haul</span><h1>Your cart</h1><p>{cart.count ? `${cart.count} ${cart.count === 1 ? "item" : "items"} ready for checkout.` : "A few good things for your companion."}</p></div><span className="cart-secure"><CheckCircle size={16} weight="fill" /> Secure checkout</span></div>
      {!cart.items.length ? <section className="cart-empty"><span className="cart-empty-icon"><ShoppingBag size={34} /></span><h2>Your cart is waiting.</h2><p>Find something joyful for your furry companion in our store.</p><button className="button button--primary" onClick={() => navigate("/")}>Explore the store <ArrowLeft size={18} /></button></section> : <div className="cart-layout"><section className="cart-items-panel">{cart.items.map((item) => <article className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-item-info"><strong>{item.name}</strong><small>{item.type}</small><span>${item.price.toFixed(2)}</span></div><div className="quantity-control"><button onClick={() => cart.update(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name}`}><Minus size={14} /></button><b>{item.quantity}</b><button onClick={() => cart.update(item.id, item.quantity + 1)} aria-label={`Increase ${item.name}`}><Plus size={14} /></button></div><button className="remove-item" onClick={() => cart.remove(item.id)} aria-label={`Remove ${item.name}`}><Trash size={17} /></button></article>)}</section><aside className="cart-summary"><span className="eyebrow">Order summary</span><h2>Ready when you are.</h2><div className="summary-line"><span>Subtotal</span><strong>${cart.subtotal.toFixed(2)}</strong></div><div className="summary-line"><span>Delivery</span><strong>{delivery ? `$${delivery.toFixed(2)}` : "Free"}</strong></div><p className="delivery-note">{delivery ? "Add $50 for free local delivery." : "You unlocked free local delivery."}</p><div className="summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div><button className="button button--primary button--full" onClick={startCheckout}>{isAuthenticated ? "Continue to checkout" : "Log in to buy"} <ShoppingBag size={18} /></button><small className="summary-footnote">Protected by secure sign-in · No payment is processed in this demo.</small></aside></div>}
    </>}
  </main>{notice && <div className="toast" role="status"><UserCircle size={19} weight="fill" /> {notice}</div>}
  {checkoutOpen && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Checkout" onClick={() => setCheckoutOpen(false)}><form className="booking-modal checkout-modal" onSubmit={placeOrder} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Close"><Plus size={20} /></button><div className="modal-icon"><ShoppingBag size={24} weight="duotone" /></div><div className="eyebrow">Almost there</div><h3>Delivery details</h3><p>Enter your details and we’ll prepare your order for confirmation.</p><label>Full name<input required value={shipping.name} onChange={(event) => setShipping({ ...shipping, name: event.target.value })} placeholder="Your name" /></label><label>Address<input required value={shipping.address} onChange={(event) => setShipping({ ...shipping, address: event.target.value })} placeholder="Street and unit number" /></label><div className="checkout-grid"><label>City<input required value={shipping.city} onChange={(event) => setShipping({ ...shipping, city: event.target.value })} placeholder="Your city" /></label><label>Contact number<input required value={shipping.phone} onChange={(event) => setShipping({ ...shipping, phone: event.target.value })} placeholder="09xx xxx xxxx" /></label></div><div className="checkout-total"><span>Total to confirm</span><strong>${total.toFixed(2)}</strong></div><button className="button button--primary button--full" type="submit">Place order <CheckCircle size={18} /></button></form></div>}
  </div>;
}
